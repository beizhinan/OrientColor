<template>
  <view class="color-matrix-container">
    <!-- 顶部色系名称标题 -->
    <view class="color-system-title">
      <view class="color-prefixes">
        <view class="prefix">{{ name }}</view>
      </view>
    </view>

    <!-- 色相度数标题 -->
    <view class="title-row">
      <view class="hue-label">色相</view>
      <view class="hue-title-container">
        <view
          class="hue-title"
          v-for="(hue, index) in hueValues"
          :key="index"
          :style="{ left: `${index * (100 / (hueValues.length - 1))}%` }"
        >
          {{ hue }}°
        </view>
      </view>
    </view>

    <view class="matrix-content">
      <!-- 左侧彩度坐标轴 -->
      <view class="chroma-axis-wrapper">
        <view class="chroma-axis">
          <view
            class="chroma-value"
            v-for="(chroma, index) in chromaValues"
            :key="index"
          >
            {{ chroma }}
          </view>
        </view>
        <view class="chroma-label">彩度</view>
      </view>

      <!-- 色块矩阵 -->
      <view class="matrix-grid">
        <!-- 网格线 -->
        <view class="vertical-grid">
          <view
            v-for="(hue, index) in hueValues"
            :key="'v-' + index"
            class="vertical-line"
            :style="{ left: `${index * (100 / (hueValues.length - 1))}%` }"
          ></view>
        </view>
        <view class="horizontal-grid">
          <view
            v-for="(chroma, index) in chromaValues"
            :key="'h-' + index"
            class="horizontal-line"
            :style="{ top: `${index * (100 / (chromaValues.length - 1))}%` }"
          ></view>
        </view>

        <!-- 色块内容 -->
        <view class="color-cells">
          <view
            v-for="(chroma, chromaIndex) in chromaValues.slice(0, -1)"
            :key="'row-' + chromaIndex"
            class="color-row"
          >
            <view
              v-for="(hue, hueIndex) in hueValues.slice(0, -1)"
              :key="'cell-' + chromaIndex + '-' + hueIndex"
              class="color-cell"
              :style="{
                backgroundColor:
                  cellColors[chromaIndex] && cellColors[chromaIndex][hueIndex]
                    ? cellColors[chromaIndex][hueIndex]
                    : 'transparent',
              }"
              @click="handleColorClick(chromaIndex, hueIndex)"
            ></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
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

export default {
  data() {
    return {
      name: "黄色系",
      hueValues: [110, 95, 83, 65], // 色相刻度（倒序，实现左大右小）
      chromaValues: [95, 65, 50, 36, 14], // 彩度刻度（降序，实现上大下小）
      colorData: [
        {
          name: "oY",
          label: "偏橙的黄色",
          h: [65, 83],
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
          colors: [
            { l: 85, a: -8, b: 37, c: 38, h: 103 },
            { l: 66, a: -6, b: 19, c: 20, h: 108 },
            { l: 49, a: -5, b: 15, c: 16, h: 109 },
            { l: 40, a: -2, b: 13, c: 13, h: 99 },
          ],
        },
      ],
      showDebug: true, // 调试开关已关闭
      cellColors: [], // 存储每个单元格的颜色
    };
  },
  mounted() {
    this.initColorMatrix();
  },
  methods: {
    initColorMatrix() {
      // 确保正确初始化二维数组
      this.cellColors = Array(this.chromaValues.length - 1)
        .fill()
        .map(() => Array(this.hueValues.length - 1).fill("transparent"));

      // 收集并处理所有颜色数据
      this.colorData.forEach((group) => {
        group.colors.forEach((color) => {
          const targetCell = this.findTargetCell(color);
          if (targetCell) {
            const rgb = labToRgb(color.l, color.a, color.b);
            this.cellColors[targetCell.row][targetCell.col] = rgbToHex(
              rgb.r,
              rgb.g,
              rgb.b
            );
          }
        });
      });
    },

    handleColorClick(chromaIndex, hueIndex) {
      // 根据行列索引找到对应的颜色数据
      const hue = this.hueValues[hueIndex];
      const chroma = this.chromaValues[chromaIndex];

      // 创建一个模拟的颜色对象
      const color = {
        h: hue,
        c: chroma,
        // 可以添加更多颜色信息
      };

      // 发送事件通知父组件
      this.$emit("color-selected", color);
    },

    findTargetCell(color) {
      // 确保色相在范围内
      const hueRange = [
        Math.min(...this.hueValues),
        Math.max(...this.hueValues),
      ];
      if (color.h < hueRange[0] || color.h > hueRange[1]) return null;

      // 确定彩度行
      let chromaRow = -1;
      for (let i = 0; i < this.chromaValues.length - 1; i++) {
        const upper = Math.max(this.chromaValues[i], this.chromaValues[i + 1]);
        const lower = Math.min(this.chromaValues[i], this.chromaValues[i + 1]);
        if (color.c >= lower && color.c <= upper) {
          chromaRow = i;
          break;
        }
      }
      if (chromaRow === -1) return null;

      // 确定色相列
      let hueCol = -1;
      for (let j = 0; j < this.hueValues.length - 1; j++) {
        const start = this.hueValues[j];
        const end = this.hueValues[j + 1];
        const minH = Math.min(start, end);
        const maxH = Math.max(start, end);

        if (color.h >= minH && color.h <= maxH) {
          hueCol = j;
          break;
        }
      }
      if (hueCol === -1) return null;

      return { row: chromaRow, col: hueCol };
    },
  },
};
</script>

<style scoped>
.color-matrix-container {
  display: flex;
  flex-direction: column;
  padding: 0 30rpx 0 30rpx;
  height: 700rpx;
  position: relative;
}

.color-system-title {
  margin-bottom: 10rpx;
  text-align: center;
}

.color-prefixes .prefix {
  font-size: 28rpx;
  padding: 8rpx 20rpx;
  color: #9f7735;
  font-weight: bold;
  display: inline-block;
}

.title-row {
  display: flex;
  margin-bottom: 10rpx;
  position: relative;
  color: #c69c6d;
  background-color: white;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  border-radius: 24rpx;
  padding: 10rpx 20rpx;
}

.hue-label {
  width: 100rpx;
  font-size: 24rpx;
}

.hue-title-container {
  flex: 1;
  position: relative;
  height: 40rpx;
}

.hue-title {
  position: absolute;
  font-size: 24rpx;
  transform: translateX(-50%);
  white-space: nowrap;
}

.matrix-content {
  display: flex;
  flex: 1;
  position: relative;
  margin-top: 20rpx;
}

.chroma-axis-wrapper {
  width: 60rpx;
  position: relative;
  height: calc(100% - 40rpx);
  margin-bottom: 40rpx;
  color: #c69c6d;
  background-color: white;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  border-radius: 24rpx;
  padding: 0 10rpx 0 10rpx;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: space-between; /* 确保内容均匀分布 */
}

.chroma-axis {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 10rpx;
  box-sizing: border-box;
}

.chroma-value {
  font-size: 24rpx;
  position: relative;
  transform: none;
}

.chroma-label {
  font-size: 24rpx;
  text-align: center; /* 改为居中对齐 */
  padding: 10rpx 0; /* 调整上下padding */
  writing-mode: horizontal-tb;
  margin: 0 auto; /* 水平居中 */
}

.matrix-grid {
  flex: 1;
  position: relative;
  margin-left: 10rpx;
  height: calc(100% - 40rpx);
  margin-bottom: 40rpx;
}

.vertical-grid,
.horizontal-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 调整网格线位置以匹配新的内边距 */
.vertical-line {
  position: absolute;
  top: 16rpx;
  bottom: 16rpx;
  width: 1px;
  background-color: #f0f0f0;
  transform: translateX(-50%);
}

.horizontal-line {
  position: absolute;
  left: 16rpx;
  right: 16rpx;
  height: 1px;
  background-color: #f0f0f0;
  transform: translateY(-50%);
}

.color-cells {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  /* 移除容器padding，改用margin控制间距 */
}

.color-row {
  flex: 1;
  display: flex;
  /* 为所有行添加上下边距 */
  margin: 8rpx 0;
  /* 为第一行添加额外的上边距 */
}

.color-row:first-child {
  margin-top: 16rpx;
}
/* 为最后一行添加额外的下边距 */
.color-row:last-child {
  margin-bottom: 16rpx;
}

.color-cell {
  flex: 1;
  /* 为所有单元格添加左右边距 */
  margin: 0 8rpx;
  /* 为第一个单元格添加额外的左边距 */
}
.color-cell:first-child {
  margin-left: 16rpx;
}
/* 为最后一个单元格添加额外的右边距 */
.color-cell:last-child {
  margin-right: 16rpx;
}
</style>