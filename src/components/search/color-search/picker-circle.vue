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
import { getColorWheelData, getLowChromaColorDetail } from '@/api/search/color-search.js'

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

// 添加两个独立的角度存储变量
const highChromaAngle = ref(0);
const lowChromaAngle = ref(0);

// 颜色数据
const gener = ref([]); // 高艳色数据
const low = ref([]);  // 低艳色数据

const centerColors = ref([]);

const emit = defineEmits(["low-chroma-toggle", "draw-finish", "update:center-colors", "low-chroma-center-selected", "angle-update"]);

// 添加defineExpose来暴露方法给父组件调用
defineExpose({
  setAngle,
  getAngle
});

// 添加防抖控制
let angleUpdateTimer = null;

// 角度设置方法，供父组件调用
function setAngle(angle) {
  currentAngle.value = angle;
  if (showLowChroma.value) {
    lowChromaAngle.value = angle;
  } else {
    highChromaAngle.value = angle;
  }
  drawColorWheel();
  calculateCenterColors();
}

// 获取当前角度的方法
function getAngle() {
  return currentAngle.value;
}

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

        const currentData = showLowChroma.value ? low.value : gener.value;
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
          const hStartOriginal = ((360 - (category.h[1] || 0)) * Math.PI) / 180;
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
              const outerRadius = maxRadius * (0.1 + (actualCEnd / maxC) * 0.9);

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
  
  // 切换模式时恢复对应的角度
  if (showLowChroma.value) {
    currentAngle.value = lowChromaAngle.value;
  } else {
    currentAngle.value = highChromaAngle.value;
  }
  
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

  const currentData = showLowChroma.value ? low.value : gener.value;
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
    // 修复：确保 gestureState 已定义且正在拖拽时不选择颜色
    if (typeof gestureState !== 'undefined' && gestureState.value && !gestureState.value.isDragging) {
      selectedColor.value = centerColor;
    } else if (typeof gestureState === 'undefined' || !gestureState.value) {
      // 如果 gestureState 还未定义，则直接选择颜色
      selectedColor.value = centerColor;
    }
  }

  // 右侧颜色 (中心角度+15度)
  const rightAngle = (chartCenterAngle + 15) % 360;
  const rightColor = findColorAtAngle(currentData, rightAngle);
  if (rightColor) result.push(rightColor);

  centerColors.value = result;
  
  // 发送中心颜色更新事件
  emit("update:center-colors", result);
  
  // 如果是低艳色模式，发送中心颜色给父组件以获取详情数据
  if (showLowChroma.value && centerColor) {
    emit("low-chroma-center-selected", centerColor);
  }
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
      positions: [{ x: clientX, time: Date.now() }], // 用于计算速度的历史位置
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
      (pos) => currentTime - pos.time < 100
    );
    gestureState.value.positions.push({ x: currentX, time: currentTime });

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
          currentVelocity *= Math.pow(deceleration, deltaTimeMs / 16);
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
    fetchColorData();
  } catch (error) {
    console.error("初始化Canvas失败:", error);
  }
}

// 从API获取颜色数据
async function fetchColorData() {
  try {
    // 获取高艳色数据
    const highChromaRes = await getColorWheelData(false);
    if (highChromaRes.status === "success") {
      gener.value = highChromaRes.data.colorCategories;
    }

    // 获取低艳色数据
    const lowChromaRes = await getColorWheelData(true);
    if (lowChromaRes.status === "success") {
      low.value = lowChromaRes.data.colorCategories;
    }

    drawColorWheel();
    calculateCenterColors();
  } catch (error) {
    console.error("获取颜色数据失败:", error);
  }
}

// 监听角度变化，更新中心颜色
watch(currentAngle, () => {
  // 修复：确保 gestureState 已定义
  if (typeof gestureState !== 'undefined' && gestureState.value && !gestureState.value.isDragging) {
    calculateCenterColors();
  } else if (typeof gestureState === 'undefined' || !gestureState.value) {
    // 如果 gestureState 还未定义，则直接计算中心颜色
    calculateCenterColors();
  }
  
  // 更新对应模式的角度存储
  if (showLowChroma.value) {
    lowChromaAngle.value = currentAngle.value;
  } else {
    highChromaAngle.value = currentAngle.value;
  }
  
  // 防抖发送角度更新事件
  if (angleUpdateTimer) {
    clearTimeout(angleUpdateTimer);
  }
  angleUpdateTimer = setTimeout(() => {
    emit("angle-update", currentAngle.value);
  }, 100);
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

// 颜色数据已在fetchColorData函数中从API获取
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
  padding: 5px;
}

.toggle-button {
  background-color: #c69c6d;
  border: none;
  color: white;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
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