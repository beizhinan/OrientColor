 <template>
  <view class="color-picker-container">
    <!-- 切换高低色盘按钮 -->
    <view class="toggle-button-container">
      <button class="toggle-button" @click="handleCenterClick">
        {{ showLowChroma ? "切换到高艳色色盘" : "切换到低艳色色盘" }}
      </button>
    </view>

    <!-- 中心三个颜色显示 -->
    <!-- <view class="center-colors-info" v-if="centerColors.length > 0">
      <view 
        v-for="(color, index) in centerColors" 
        :key="index"
        class="center-color-item"
        :class="{ 'center-main': index === 1 }"
        @click="selectColor(color)"
      >
        <view 
          class="center-color-preview" 
          :style="{ backgroundColor: color.hex }"
        ></view>
        <text class="center-color-label">{{ color.label }}</text>
      </view>
    </view> -->

    <!-- 手势识别区域 -->
    <view
      class="gesture-container"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
    >
      <!-- 主图表容器 -->
      <view class="chart-fixed-container">
        <!-- 图表容器 -->
        <view class="chart-container">
          <canvas
            id="colorWheel"
            canvas-id="colorWheel"
            class="color-wheel-canvas"
          ></canvas>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  getCurrentInstance,
} from "vue";

// 获取当前组件实例
const instance = getCurrentInstance();

// 微信小程序兼容的动画帧函数
const raf = (callback) => {
  if (typeof wx !== "undefined" && wx.requestAnimationFrame) {
    return wx.requestAnimationFrame(callback);
  }
  return setTimeout(callback, 16);
};

const caf = (id) => {
  if (typeof wx !== "undefined" && wx.cancelAnimationFrame) {
    wx.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
};

// 添加节流控制变量
let throttleTimer = null;
let pendingDraw = false;
let lastDrawTime = 0;
const MIN_DRAW_INTERVAL = 16; // 约60fps

// 图表引用和状态
let canvasContext = null;
let updateTimer = null;
const selectedColor = ref(null);
const currentAngle = ref(0);
const showLowChroma = ref(false);
const drawFinished = ref(false); // 添加绘制完成状态

// 中心颜色相关
const centerColors = ref([]);

const emit = defineEmits(["low-chroma-toggle", "draw-finish"]); // 添加draw-finish事件

// 手势状态管理
const gestureState = ref({
  isDragging: false,
  isClick: true,
  startX: 0,
  startY: 0,
  startAngle: 0,
  lastTimestamp: 0,
  velocity: 0,
  inertiaTimer: null,
});

// LAB颜色空间转换函数
function labToRgb(l, a, b) {
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const x3 = x * x * x;
  const y3 = y * y * y;
  const z3 = z * z * z;

  x = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
  y = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
  z = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;

  x = x * 95.047;
  y = y * 100.0;
  z = z * 108.883;

  x = x / 100;
  y = y / 100;
  z = z / 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b2 = x * 0.0557 + y * -0.204 + z * 1.057;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b2 = b2 > 0.0031308 ? 1.055 * Math.pow(b2, 1 / 2.4) - 0.055 : 12.92 * b2;

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b2 = Math.min(Math.max(0, b2), 1);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b2 * 255),
  };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// 绘制扇形
function drawSector(
  ctx,
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  color
) {
  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius, startAngle, endAngle);
  ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// 绘制色轮
function drawColorWheel() {
  if (!canvasContext) return;

  const now = Date.now();
  // 实现更高效的节流控制，避免频繁绘制
  if (now - lastDrawTime < MIN_DRAW_INTERVAL) {
    if (!throttleTimer) {
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        pendingDraw = false;
        performDrawColorWheel();
      }, MIN_DRAW_INTERVAL - (now - lastDrawTime));
      pendingDraw = true;
    } else {
      pendingDraw = true;
    }
    return;
  }

  lastDrawTime = now;
  if (throttleTimer) {
    clearTimeout(throttleTimer);
    throttleTimer = null;
  }
  pendingDraw = false;

  performDrawColorWheel();
}

function performDrawColorWheel() {
  try {
    const query = uni.createSelectorQuery().in(instance);
    query.select("#colorWheel").boundingClientRect();

    query.exec((res) => {
      try {
        if (!res || !res[0] || !res[0].width || !res[0].height) {
          console.error("无法获取canvas节点或节点尺寸信息不完整:", res);
          drawFinished.value = true;
          emit("draw-finish");
          return;
        }

        const canvas = res[0];
        const width = canvas.width;
        const height = canvas.height;
        const cx = width / 2;
        // 将中心点重新设置在底部，以适配半圆显示
        const cy = height;
        // 调整半径计算方式，确保不会超出屏幕宽度
        const maxRadius = Math.min(width, height * 2) * 0.5;

        // 清空画布
        canvasContext.clearRect(0, 0, width, height);

        const currentData = showLowChroma.value ? low : gener;
        const minDisplayC = showLowChroma.value ? 0 : 14;
        const maxC = 100;

        // 绘制中心圆
        const centerRadius = maxRadius * (0.1 + (minDisplayC / maxC) * 0.9);
        canvasContext.beginPath();
        canvasContext.arc(cx, cy, centerRadius, 0, 2 * Math.PI);
        canvasContext.fillStyle = showLowChroma.value ? "#888" : "#f0f0f0";
        canvasContext.fill();

        // 计算旋转弧度
        const rotation = (currentAngle.value * Math.PI) / 180;

        // 绘制色块
        currentData.forEach((category) => {
          // 计算原始角度并转换为弧度
          const hStartOriginal =
            ((360 - (category.h[1] || 0)) * Math.PI) / 180;
          const hEndOriginal = ((360 - (category.h[0] || 0)) * Math.PI) / 180;

          // 应用旋转
          const hStart = hStartOriginal + rotation;
          const hEnd = hEndOriginal + rotation;

          if (showLowChroma.value) {
            // 低艳色色盘 - 简单渲染方式
            const colorObj = category.colors?.[0] || { l: 50, a: 0, b: 0 };
            const rgb = labToRgb(colorObj.l, colorObj.a, colorObj.b);
            const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);

            drawSector(
              canvasContext,
              cx,
              cy,
              centerRadius,
              maxRadius,
              hStart,
              hEnd,
              hexColor
            );
          } else {
            // 主色盘 - 按c范围划分
            const sortedCRanges = [...category.c].sort(
              (a, b) => (a[0] || 0) - (b[0] || 0)
            );
            let prevCEnd = minDisplayC;

            sortedCRanges.forEach((cRange) => {
              const cStart = Math.max(cRange[0] || 0, minDisplayC);
              const cEnd = cRange[1] || cStart || 0;

              const actualCStart = Math.max(cStart, prevCEnd);
              const actualCEnd = cEnd;

              if (actualCStart >= actualCEnd) return;

              let matchedColor = null;
              if (category.colors?.length > 0) {
                for (const color of category.colors) {
                  const colorC = color.c || 0;
                  if (colorC >= actualCStart && colorC < actualCEnd) {
                    matchedColor = color;
                    break;
                  }
                }
              }

              if (!matchedColor) {
                prevCEnd = actualCEnd;
                return;
              }

              const innerRadius =
                maxRadius * (0.1 + (actualCStart / maxC) * 0.9);
              const outerRadius =
                maxRadius * (0.1 + (actualCEnd / maxC) * 0.9);

              const rgb = labToRgb(
                matchedColor.l,
                matchedColor.a,
                matchedColor.b
              );
              const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);

              drawSector(
                canvasContext,
                cx,
                cy,
                innerRadius,
                outerRadius,
                hStart,
                hEnd,
                hexColor
              );

              prevCEnd = actualCEnd;
            });
          }
        });

        // 设置绘制未完成状态
        drawFinished.value = false;
        
        canvasContext.draw(false, () => {
          // 绘制完成后设置状态并触发事件
          drawFinished.value = true;
          emit("draw-finish");
        });
      } catch (error) {
        console.error("绘制色块失败:", error);
        drawFinished.value = true;
        emit("draw-finish");
      }
    });
  } catch (error) {
    console.error("查询canvas节点失败:", error);
    drawFinished.value = true;
    emit("draw-finish");
  }
}

// 处理中心点击
const handleCenterClick = () => {
  showLowChroma.value = !showLowChroma.value;
  drawColorWheel();

  // 发送事件通知父组件
  emit("low-chroma-toggle", showLowChroma.value);

  // 震动反馈（小程序环境）
  if (typeof wx !== "undefined" && wx.vibrateShort) {
    wx.vibrateShort();
  }
};

// 计算中心三个颜色
const calculateCenterColors = () => {
  const centerAngle = (((currentAngle.value + 90) % 360) + 360) % 360;
  const chartCenterAngle = centerAngle;

  const currentData = showLowChroma.value ? low : gener;
  const result = [];

  // 左侧颜色 (中心角度-15度)
  const leftAngle = (chartCenterAngle - 15 + 360) % 360;
  const leftColor = findColorAtAngle(currentData, leftAngle);
  if (leftColor) result.push(leftColor);

  // 中心颜色 (y轴正方向)
  const centerColor = findColorAtAngle(currentData, chartCenterAngle);
  if (centerColor) {
    result.push(centerColor);
    // 自动选择中心颜色
    if (!gestureState.value.isDragging) {
      selectedColor.value = centerColor;
    }
  }

  // 右侧颜色 (中心角度+15度)
  const rightAngle = (chartCenterAngle + 15) % 360;
  const rightColor = findColorAtAngle(currentData, rightAngle);
  if (rightColor) result.push(rightColor);

  centerColors.value = result;
};

// 根据角度查找颜色
const findColorAtAngle = (data, angle) => {
  const chartAngle = angle;

  for (const category of data) {
    const hStart = category.h[0] || 0;
    const hEnd = category.h[1] || 0;

    let inRange = false;
    if (hStart <= hEnd) {
      inRange = chartAngle >= hStart && chartAngle <= hEnd;
    } else {
      inRange = chartAngle >= hStart || chartAngle <= hEnd;
    }

    if (inRange) {
      const colorIndex = Math.min(
        Math.floor(category.colors.length / 2),
        category.colors.length - 1
      );
      const colorObj = category.colors[colorIndex];

      if (colorObj) {
        const rgb = labToRgb(colorObj.l, colorObj.a, colorObj.b);
        const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);

        return {
          name: category.name,
          label: category.label,
          hStart: category.h[0],
          hEnd: category.h[1],
          ...colorObj,
          hex: hexColor,
        };
      }
    }
  }
  return null;
};

// 选择颜色
const selectColor = (color) => {
  selectedColor.value = color;
};

// 手势处理
function handleTouchStart(event) {
  if (event.touches.length > 0) {
    // 检查是否点击中心区域
    const { clientX, clientY } = event.touches[0];
    const centerX = event.currentTarget.offsetWidth / 2;
    const centerY = event.currentTarget.offsetHeight / 2; // 使用容器中心点
    const distance = Math.sqrt(
      Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2)
    );

    // 如果触摸点在中心区域，则不处理手势
    if (distance < 30) {
      gestureState.value.isClick = false;
      return;
    }

    if (gestureState.value.inertiaTimer) {
      caf(gestureState.value.inertiaTimer);
      gestureState.value.inertiaTimer = null;
    }

    gestureState.value = {
      ...gestureState.value,
      isDragging: false,
      isClick: true,
      startX: clientX,
      startY: clientY,
      startAngle: currentAngle.value,
      lastTimestamp: Date.now(),
      velocity: 0,
      // 新增用于连续跟踪移动的属性
      lastX: clientX,
      positions: [{x: clientX, time: Date.now()}] // 用于计算速度的历史位置
    };
  }
}

function handleTouchMove(event) {
  if (!gestureState.value.isClick && !gestureState.value.isDragging) return;

  const moveThreshold = 5;
  const deltaX = Math.abs(event.touches[0].clientX - gestureState.value.startX);
  const deltaY = Math.abs(event.touches[0].clientY - gestureState.value.startY);

  if (deltaX > moveThreshold || deltaY > moveThreshold) {
    gestureState.value.isDragging = true;
    gestureState.value.isClick = false;
  }

  if (gestureState.value.isDragging && event.touches.length > 0) {
    event.preventDefault();

    const now = Date.now();
    const currentX = event.touches[0].clientX;
    
    // 更新历史位置记录，仅保留最近100毫秒内的记录用于速度计算
    const currentTime = Date.now();
    gestureState.value.positions = gestureState.value.positions.filter(
      pos => currentTime - pos.time < 100
    );
    gestureState.value.positions.push({x: currentX, time: currentTime});

    // 计算基于上一次移动的角度变化
    const deltaMoveX = currentX - gestureState.value.lastX;
    
    // 更新角度 - 使用更灵敏的系数
    currentAngle.value = currentAngle.value + deltaMoveX * 0.8;

    // 使用节流优化的绘制函数
    drawColorWheel();

    gestureState.value = {
      ...gestureState.value,
      lastX: currentX,
      lastTimestamp: now,
    };
  }
}

function handleTouchEnd() {
  if (!gestureState.value.isDragging) return;

  gestureState.value.isDragging = false;

  // 基于最近的触摸点计算更准确的速度
  const positions = gestureState.value.positions;
  if (positions.length > 1) {
    const latest = positions[positions.length - 1];
    const oldest = positions[0];
    const deltaTime = latest.time - oldest.time;
    
    if (deltaTime > 0) {
      const deltaX = latest.x - oldest.x;
      const velocity = deltaX / deltaTime; // 像素/毫秒
      
      // 只有当速度足够大时才启动惯性动画
      if (Math.abs(velocity) > 0.05) {
        let currentVelocity = velocity;
        let lastTime = Date.now();
        const deceleration = 0.95; // 更平滑的减速
        
        const animateInertia = () => {
          const now = Date.now();
          const deltaTimeMs = now - lastTime;
          lastTime = now;
          
          // 使用指数衰减计算新速度
          currentVelocity *= Math.pow(deceleration, deltaTimeMs/16);
          currentAngle.value += currentVelocity * deltaTimeMs * 0.8;

          // 使用节流优化的绘制函数
          drawColorWheel();

          // 当速度降到足够小时停止动画
          if (Math.abs(currentVelocity) > 0.001) {
            gestureState.value.inertiaTimer = raf(animateInertia);
          } else {
            gestureState.value.inertiaTimer = null;
            calculateCenterColors();
          }
        };

        gestureState.value.inertiaTimer = raf(animateInertia);
        return;
      }
    }
  }
  
  // 如果没有足够的数据或者速度太小，则直接计算中心颜色
  calculateCenterColors();
}

// 初始化Canvas
function initCanvas() {
  try {
    canvasContext = uni.createCanvasContext("colorWheel", instance);
    drawColorWheel();
    calculateCenterColors();
  } catch (error) {
    console.error("初始化Canvas失败:", error);
  }
}

// 监听角度变化，更新中心颜色
watch(currentAngle, () => {
  if (!gestureState.value.isDragging) {
    calculateCenterColors();
  }
});

// 监听色盘切换
watch(showLowChroma, () => {
  drawColorWheel();
});

onMounted(() => {
  initCanvas();
});

onBeforeUnmount(() => {
  if (gestureState.value.inertiaTimer) {
    caf(gestureState.value.inertiaTimer);
  }
  if (updateTimer) {
    clearTimeout(updateTimer);
  }
  // 清理节流定时器
  if (throttleTimer) {
    clearTimeout(throttleTimer);
  }
});

// 颜色数据
const gener = [
  {
    name: "R",
    label: "红色",
    h: [10, 31],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 71, a: 22, b: 9, c: 24, h: 22 },
      { l: 59, a: 18, b: 9, c: 20, h: 27 },
      { l: 40, a: 21, b: 10, c: 23, h: 26 },
      { l: 32, a: 24, b: 9, c: 26, h: 20 },
      { l: 29, a: 14, b: 3, c: 14, h: 14 },
      { l: 21, a: 23, b: 10, c: 26, h: 24 },

      { l: 52, a: 35, b: 13, c: 37, h: 21 },
      { l: 45, a: 31, b: 11, c: 33, h: 20 },
      { l: 37, a: 31, b: 12, c: 34, h: 22 },
      { l: 29, a: 37, b: 14, c: 39, h: 22 },
      { l: 25, a: 35, b: 19, c: 40, h: 28 },

      { l: 54, a: 48, b: 28, c: 56, h: 30 },
      { l: 47, a: 41, b: 23, c: 47, h: 30 },
      { l: 40, a: 39, b: 23, c: 45, h: 31 },
      { l: 30, a: 37, b: 20, c: 42, h: 28 },
    ],
  },
  {
    name: "oR",
    label: "偏橙的红色",
    h: [31, 40],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 51, a: 17, b: 11, c: 20, h: 33 },
      { l: 42, a: 27, b: 20, c: 33, h: 36 },
      { l: 41, a: 33, b: 24, c: 41, h: 36 },
      { l: 32, a: 21, b: 15, c: 26, h: 37 },

      { l: 62, a: 42, b: 36, c: 55, h: 40 },
      { l: 52, a: 55, b: 40, c: 68, h: 35 },
      { l: 49, a: 40, b: 30, c: 50, h: 37 },
      { l: 42, a: 44, b: 34, c: 55, h: 37 },
    ],
  },
  {
    name: "O",
    label: "橙色",
    h: [40, 65],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 58, a: 13, b: 23, c: 26, h: 60 },
      { l: 51, a: 14, b: 17, c: 21, h: 51 },
      { l: 37, a: 15, b: 15, c: 21, h: 45 },
      { l: 25, a: 12, b: 14, c: 18, h: 49 },

      { l: 69, a: 17, b: 31, c: 35, h: 61 },
      { l: 55, a: 25, b: 33, c: 41, h: 53 },
      { l: 47, a: 13, b: 28, c: 31, h: 64 },
      { l: 43, a: 23, b: 39, c: 45, h: 60 },
      { l: 37, a: 24, b: 24, c: 34, h: 45 },
      { l: 30, a: 18, b: 20, c: 27, h: 48 },

      { l: 64, a: 31, b: 41, c: 52, h: 53 },
      { l: 57, a: 34, b: 44, c: 56, h: 52 },
      { l: 54, a: 36, b: 52, c: 63, h: 56 },

      { l: 66, a: 49, b: 45, c: 67, h: 43 },
      { l: 62, a: 59, b: 71, c: 92, h: 50 },
      { l: 59, a: 53, b: 61, c: 81, h: 49 },
      { l: 52, a: 44, b: 55, c: 70, h: 51 },
    ],
  },
  {
    name: "oY",
    label: "偏橙的黄色",
    h: [65, 83],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 70, a: 7, b: 22, c: 23, h: 72 },
      { l: 59, a: 10, b: 23, c: 25, h: 67 },
      { l: 43, a: 5, b: 15, c: 16, h: 72 },
      { l: 33, a: 4, b: 14, c: 14, h: 74 },

      { l: 73, a: 11, b: 31, c: 33, h: 71 },
      { l: 69, a: 10, b: 40, c: 41, h: 77 },
      { l: 59, a: 12, b: 35, c: 37, h: 71 },
      { l: 49, a: 13, b: 28, c: 31, h: 66 },

      { l: 80, a: 12, b: 47, c: 48, h: 75 },
      { l: 67, a: 15, b: 44, c: 47, h: 71 },
      { l: 64, a: 17, b: 53, c: 56, h: 72 },
      { l: 56, a: 19, b: 40, c: 44, h: 65 },

      { l: 76, a: 25, b: 60, c: 65, h: 68 },
      { l: 69, a: 17, b: 65, c: 67, h: 75 },
      { l: 77, a: 13, b: 65, c: 67, h: 79 },
      { l: 71, a: 11, b: 68, c: 69, h: 81 },
      { l: 64, a: 20, b: 67, c: 70, h: 73 },
    ],
  },
  {
    name: "Y",
    label: "黄色",
    h: [83, 95],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 85, a: 5, b: 54, c: 54, h: 85 },
      { l: 79, a: -1, b: 45, c: 45, h: 91 },
      { l: 75, a: 4, b: 35, c: 35, h: 84 },

      { l: 83, a: 4, b: 75, c: 75, h: 87 },
      { l: 72, a: -1, b: 65, c: 65, h: 91 },
    ],
  },
  {
    name: "gY",
    label: "偏绿的黄色",
    h: [95, 110],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 85, a: -8, b: 37, c: 38, h: 103 },
      { l: 66, a: -6, b: 19, c: 20, h: 108 },
      { l: 49, a: -5, b: 15, c: 16, h: 109 },
      { l: 40, a: -2, b: 13, c: 13, h: 99 },
    ],
  },
  {
    name: "yG",
    label: "偏黄的绿色",
    h: [110, 150],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 69, a: -14, b: 9, c: 17, h: 148 },
      { l: 64, a: -8, b: 8, c: 11, h: 135 },
      { l: 57, a: -8, b: 8, c: 11, h: 135 },
      { l: 54, a: -14, b: 11, c: 17, h: 141 },
      { l: 47, a: -14, b: 9, c: 17, h: 147 },
      { l: 46, a: -11, b: 11, c: 15, h: 134 },
      { l: 36, a: -5, b: 10, c: 11, h: 117 },
      { l: 59, a: -17, b: 13, c: 21, h: 143 },
      { l: 49, a: -14, b: 14, c: 20, h: 136 },
      { l: 40, a: -23, b: 25, c: 34, h: 133 },
      { l: 36, a: -28, b: 20, c: 35, h: 144 },
      { l: 27, a: -11, b: 18, c: 21, h: 123 },
    ],
  },
  {
    name: "G",
    label: "绿色",
    h: [150, 170],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 78, a: -15, b: 5, c: 16, h: 161 },
      { l: 70, a: -19, b: 8, c: 21, h: 157 },
      { l: 61, a: -18, b: 8, c: 20, h: 156 },
      { l: 48, a: -22, b: 12, c: 25, h: 151 },
      { l: 39, a: -20, b: 11, c: 23, h: 152 },
      { l: 67, a: -25, b: 10, c: 27, h: 158 },
      { l: 62, a: -28, b: 11, c: 30, h: 159 },
      { l: 54, a: -29, b: 12, c: 32, h: 158 },
      { l: 47, a: -29, b: 8, c: 30, h: 164 },
      { l: 41, a: -29, b: 12, c: 31, h: 158 },

      { l: 69, a: -58, b: 18, c: 60, h: 163 },
      { l: 58, a: -55, b: 19, c: 58, h: 161 },
      { l: 52, a: -50, b: 21, c: 54, h: 157 },
    ],
  },
  {
    name: "bG",
    label: "偏蓝的绿色",
    h: [170, 220],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 54, a: -19, b: -12, c: 22, h: 213 },
      { l: 49, a: -12, b: -4, c: 13, h: 198 },
      { l: 40, a: -20, b: -7, c: 21, h: 199 },

      { l: 67, a: -34, b: -4, c: 35, h: 187 },
      { l: 52, a: -24, b: 2, c: 24, h: 176 },
      { l: 51, a: -42, b: -2, c: 42, h: 183 },
      { l: 41, a: -25, b: 4, c: 26, h: 171 },
      { l: 35, a: -30, b: -4, c: 30, h: 188 },
    ],
  },
  {
    name: "gB",
    label: "偏绿的蓝色",
    h: [220, 255],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 74, a: -4, b: -12, c: 13, h: 252 },
      { l: 46, a: -11, b: -14, c: 18, h: 231 },
      { l: 35, a: -12, b: -10, c: 16, h: 220 },

      { l: 47, a: -6, b: -20, c: 21, h: 254 },
      { l: 38, a: -10, b: -23, c: 25, h: 247 },
    ],
  },
  {
    name: "B",
    label: "蓝色",
    h: [255, 275],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 70, a: -3, b: -27, c: 27, h: 264 },
      { l: 61, a: -5, b: -22, c: 22, h: 257 },
      { l: 49, a: -6, b: -29, c: 29, h: 262 },
      { l: 39, a: -3, b: -24, c: 25, h: 263 },
      { l: 34, a: -4, b: -28, c: 28, h: 262 },

      { l: 55, a: 2, b: -42, c: 42, h: 272 },
      { l: 44, a: -9, b: -44, c: 45, h: 259 },
      { l: 40, a: -5, b: -37, c: 37, h: 263 },
      { l: 34, a: 3, b: -42, c: 42, h: 274 },

      { l: 53, a: -13, b: -40, c: 42, h: 252 },
      { l: 37, a: -2, b: -50, c: 51, h: 267 },
    ],
  },
  {
    name: "PB",
    label: "蓝紫色",
    h: [275, 290],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 34, a: 3, b: -27, c: 27, h: 276 },
      { l: 27, a: 7, b: -34, c: 35, h: 281 },

      { l: 50, a: 8, b: -41, c: 42, h: 281 },
      { l: 39, a: 16, b: -48, c: 51, h: 289 },
      { l: 34, a: 17, b: -58, c: 61, h: 286 },
      { l: 29, a: 15, b: -49, c: 51, h: 287 },
    ],
  },
  {
    name: "P",
    label: "紫色",
    h: [290, 300],
    c: [
      [14, 36],
      [36, 50],
      [50, 65],
      [65, 95],
    ],
    colors: [
      { l: 51, a: 8, b: -17, c: 19, h: 297 },
      { l: 34, a: 34, b: -64, c: 72, h: 298 },
      { l: 26, a: 15, b: -39, c: 42, h: 292 },
    ],
  },
];

//低艳色数据
const low = [
  {
    name: "Np",
    label: "紫色",
    h: [310, 330],
    c: [[0, 100]],
    colors: [{ l: 22, a: 10, b: -6, c: 12, h: 330 }],
  },
  {
    name: "Npb",
    label: "蓝紫色",
    h: [275, 310],
    c: [[0, 100]],
    colors: [{ l: 30, a: 2, b: -4, c: 5, h: 294 }],
  },
  {
    name: "Nb",
    label: "蓝色",
    h: [190, 275],
    c: [[0, 100]],
    colors: [{ l: 54, a: -7, b: -7, c: 10, h: 227 }],
  },
  {
    name: "Ng",
    label: "绿色",
    h: [127, 190],
    c: [[0, 100]],
    colors: [{ l: 94, a: 0, b: 0, c: 0, h: 182 }],
  },
  {
    name: "Ngy",
    label: "黄绿色",
    h: [91, 127],
    c: [[0, 100]],
    colors: [{ l: 92, a: -1, b: 4, c: 4, h: 102 }],
  },
  {
    name: "No",
    label: "橙色",
    h: [45, 91],
    c: [[0, 100]],
    colors: [{ l: 87, a: 2, b: 7, c: 7, h: 74 }],
  },
];
</script>

<style scoped>
.color-picker-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #f1e9d8;
}

.toggle-button-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.toggle-button {
  background-color: #c69c6d;
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  border-radius: 20px;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.toggle-button:active {
  background-color: #9f7735;
}

.center-colors-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
}

.center-color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.center-color-item.center-main {
  opacity: 1;
  transform: scale(1.1);
}

.center-color-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 5px;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.center-color-label {
  font-size: 12px;
  text-align: center;
}

.gesture-container {
  width: 100%;
  height: 200px;
  margin-top: auto;
  position: relative;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  overflow: hidden;
}

.chart-fixed-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); /* 只显示上半部分 */
}

.chart-rotate-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.chart-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}

.color-wheel-canvas {
  width: 100%;
  height: 100%;
}

.center-click-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.center-text {
  font-size: 12px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
</style>