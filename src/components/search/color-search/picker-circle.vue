<template>
  <view class="color-picker-wrapper">
    <!-- Main Color Wheel -->
    <view class="color-picker-container">
      <canvas
        class="color-picker-canvas"
        canvas-id="colorPickerCanvas"
        :style="{ width: size + 'px', height: size + 'px' }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      ></canvas>
      <view
        class="labels-container"
        :style="{ width: size + 'px', height: size + 'px' }"
      >
        <view
          v-for="(section, index) in gener"
          :key="index"
          class="color-label"
          :style="getLabelStyle(section, index)"
        >
          {{ section.name }}
        </view>
      </view>
    </view>
    <view class="chart-description">高彩度色彩</view>

    <!-- Low Chroma Pie Chart -->
    <view class="low-color-container">
      <canvas
        class="low-color-canvas"
        canvas-id="lowColorCanvas"
        :style="{ width: lowSize + 'px', height: lowSize + 'px' }"
        @touchstart="handleLowTouchStart"
        @touchmove="handleLowTouchMove"
        @touchend="handleLowTouchEnd"
      ></canvas>
      <view
        class="low-labels-container"
        :style="{ width: lowSize + 'px', height: lowSize + 'px' }"
      >
        <view
          v-for="(section, index) in low"
          :key="'low-' + index"
          class="low-color-label"
          :style="getLowLabelStyle(section, index)"
        >
          {{ section.name }}
        </view>
      </view>
    </view>
    <view class="chart-description">低彩度色彩</view>

    <view class="result-list" v-if="!selectedColor">
      <text class="main-title">结果列表</text>
      <image class="placeholder-image"></image>
      <text class="placeholder-text">请点击色盘选择颜色</text>
    </view>

    <view class="result-list" v-if="selectedColor">
      <view class="title">
        <text class="main-title">色彩列表</text>
        <text class="second-title">{{ selectedColorInfo }}</text>
      </view>

      <!-- 水平明度色序条 (分为两行) -->
      <view class="horizontal-lightness-scale-wrapper">
        <!-- 第一行 -->
        <view class="horizontal-lightness-scale-row">
          <view
            v-for="(range, index) in getFirstRowRanges()"
            :key="'scale-first-' + index"
            class="horizontal-scale-item"
          >
            <text class="horizontal-scale-label"
              >{{ range[0] }}-{{ range[1] }}</text
            >
            <view
              v-if="getScaleColor(index, true)"
              class="horizontal-scale-color"
              :style="{
                backgroundColor: getScaleColor(index, true),
              }"
            >
            </view>
            <view v-else class="horizontal-scale-color empty"></view>
          </view>
        </view>

        <!-- 第二行 -->
        <view class="horizontal-lightness-scale-row">
          <view
            v-for="(range, index) in getSecondRowRanges()"
            :key="'scale-second-' + index"
            class="horizontal-scale-item"
          >
            <text class="horizontal-scale-label"
              >{{ range[0] }}-{{ range[1] }}</text
            >
            <view
              v-if="getScaleColor(index, false)"
              class="horizontal-scale-color"
              :style="{
                backgroundColor: getScaleColor(index, false),
              }"
            >
            </view>
            <view v-else class="horizontal-scale-color empty"></view>
          </view>
        </view>
      </view>

      <!-- 右侧颜色表格 -->
      <view class="color-grid">
        <view
          v-for="(row, rowIndex) in isLowChroma ? lowColorGrid : colorGrid"
          :key="'row-' + rowIndex"
          class="grid-row"
        >
          <view
            v-for="(color, colIndex) in row"
            :key="'col-' + colIndex"
            class="grid-cell"
            :style="{ backgroundColor: color ? color.color : 'transparent' }"
          ></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ColorPickerCircle",
  props: {
    size: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      gener: [
        {
          name: "P",
          label: "紫色",
          h: [300, 290],
          c: [[14, 73]],
          colors: [{ l: 51, a: 8, b: -17, c: 19, h: 297 }],
        },
        {
          name: "PB",
          label: "蓝紫色",
          h: [290, 275],
          c: [
            [27, 36],
            [42, 65],
          ],
          colors: [
            { l: 34, a: 3, b: -27, c: 27, h: 276 },
            { l: 50, a: 8, b: -41, c: 42, h: 281 },
          ],
        },
        {
          name: "B",
          label: "蓝色",
          h: [275, 255],
          c: [
            [14, 36],
            [36, 42, 42, 65],
          ],
          colors: [
            { l: 70, a: -3, b: -27, c: 27, h: 264 },
            { l: 55, a: 2, b: -42, c: 42, h: 272 },
            { l: 53, a: -13, b: -40, c: 42, h: 252 },
          ],
        },
        {
          name: "gB",
          label: "偏绿的蓝色",
          h: [255, 220],
          c: [
            [14, 21],
            [21, 35],
          ],
          colors: [
            { l: 74, a: -4, b: -12, c: 13, h: 252 },
            { l: 47, a: -6, b: -20, c: 21, h: 254 },
          ],
        },
        {
          name: "bG",
          label: "偏蓝的绿色",
          h: [220, 170],
          c: [
            [14, 22],
            [24, 50],
          ],
          colors: [
            { l: 54, a: -19, b: -12, c: 22, h: 213 },
            { l: 67, a: -34, b: -4, c: 35, h: 187 },
          ],
        },
        {
          name: "G",
          label: "绿色",
          h: [170, 150],
          c: [
            [14, 27],
            [27, 34],
            [50, 65],
          ],
          colors: [
            { l: 78, a: -15, b: 5, c: 16, h: 161 },
            { l: 67, a: -25, b: 10, c: 27, h: 158 },
            { l: 69, a: -58, b: 18, c: 60, h: 163 },
            { l: 58, a: -55, b: 19, c: 58, h: 161 },
            { l: 52, a: -50, b: 21, c: 54, h: 157 },
          ],
        },
        {
          name: "yG",
          label: "偏黄的绿色",
          h: [150, 110],
          c: [
            [0, 19],
            [20, 40],
          ],
          colors: [
            { l: 69, a: -14, b: 9, c: 17, h: 148 },
            { l: 59, a: -17, b: 13, c: 21, h: 143 },
          ],
        },
        {
          name: "gY",
          label: "偏绿的黄色",
          h: [110, 95],
          c: [[35, 50]],
          colors: [{ l: 85, a: -8, b: 37, c: 38, h: 103 }],
        },
        {
          name: "Y",
          label: "黄色",
          h: [95, 83],
          c: [
            [35, 55],
            [65, 95],
          ],
          colors: [
            { l: 85, a: 5, b: 54, c: 54, h: 85 },
            { l: 83, a: 4, b: 75, c: 75, h: 87 },
          ],
        },
        {
          name: "oY",
          label: "偏橙的黄色",
          h: [83, 65],
          c: [
            [14, 26],
            [26, 42],
            [42, 65],
            [65, 95],
          ],
          colors: [
            { l: 70, a: 7, b: 22, c: 23, h: 72 },
            { l: 73, a: 11, b: 31, c: 33, h: 71 },
            { l: 80, a: 12, b: 47, c: 46, h: 75 },
            { l: 76, a: 25, b: 60, c: 65, h: 68 },
          ],
        },
        {
          name: "O",
          label: "橙色",
          h: [65, 40],
          c: [
            [14, 28],
            [28, 50],
            [50, 67],
            [67, 100],
          ],
          colors: [
            { l: 58, a: 13, b: 23, c: 26, h: 60 },
            { l: 69, a: 17, b: 31, c: 35, h: 61 },
            { l: 64, a: 31, b: 41, c: 52, h: 53 },
            { l: 66, a: 49, b: 45, c: 67, h: 43 },
          ],
        },
        {
          name: "oR",
          label: "偏橙的红色",
          h: [40, 31],
          c: [
            [20, 50],
            [50, 67],
          ],
          colors: [
            { l: 51, a: 17, b: 11, c: 20, h: 33 },
            { l: 62, a: 42, b: 36, c: 55, h: 40 },
          ],
        },
        {
          name: "R",
          label: "红色",
          h: [31, 10],
          c: [
            [14, 28],
            [28, 41],
            [42, 67],
          ],
          colors: [
            { l: 71, a: 22, b: 9, c: 24, h: 22 },
            { l: 52, a: 35, b: 13, c: 37, h: 21 },
            { l: 54, a: 48, b: 28, c: 56, h: 30 },
          ],
        },
      ],
      low: [
        {
          name: "Np",
          label: "紫色",
          h: [330, 310],
          colors: [{ l: 11, a: 7, b: -8, c: 11, h: 312 }],
        },
        {
          name: "Npb",
          label: "蓝紫色",
          h: [310, 275],
          colors: [{ l: 18, a: 1, b: -5, c: 5, h: 281 }],
        },
        {
          name: "Nb",
          label: "蓝色",
          h: [275, 190],
          colors: [{ l: 7, a: -4, b: -14, c: 15, h: 254 }],
        },
        {
          name: "Ng",
          label: "绿色",
          h: [190, 127],
          colors: [{ l: 9, a: -17, b: 11, c: 20, h: 147 }],
        },
        {
          name: "Ngy",
          label: "黄绿色",
          h: [127, 91],
          colors: [{ l: 23, a: -1, b: 3, c: 3, h: 108 }],
        },
        {
          name: "No",
          label: "橙色",
          h: [91, 45],
          colors: [{ l: 7, a: 0, b: 7, c: 7, h: 90 }],
        },
        {
          name: "",
          label: "无数据1",
          h: [45, 0],
          colors: [],
          empty: true,
        },
        {
          name: "",
          label: "无数据2",
          h: [0, 330],
          colors: [],
          empty: true,
        },
      ],
      allcolor: [
        [
          { l: 69, a: -58, b: 18, c: 60, h: 163 },
          { l: 58, a: -55, b: 19, c: 58, h: 161 },
          { l: 52, a: -50, b: 21, c: 54, h: 157 },
        ],
      ],
      maxCValue: 100,
      lowSize: 200,
      ctx: null,
      lowCtx: null,
      touchStartX: 0,
      touchStartY: 0,
      selectedColor: null, // 用于存储选中的颜色
      lightnessRanges: [
        [21, 25],
        [26, 30],
        [31, 35],
        [36, 40],
        [41, 45],
        [46, 50],
        [51, 55],
        [56, 60],
        [61, 65],
        [66, 70],
        [71, 75],
        [76, 80],
        [81, 85],
        [86, 90],
        [91, 95],
      ],
      // 低彩度色盘的明度范围（从0开始）
      lowLightnessRanges: [
        [0, 5],
        [6, 10],
        [11, 15],
        [16, 20],
        [21, 25],
        [26, 30],
        [31, 35],
        [36, 40],
        [41, 45],
        [46, 50],
        [51, 55],
        [56, 60],
        [61, 65],
        [66, 70],
        [71, 75],
        [76, 80],
        [81, 85],
        [86, 90],
        [91, 95],
      ],
      scaleItemHeight: 20,
      selectedColorInfo: "",
      matchedColors: [],
      matchedColorsByLightness: [],
      colorGrid: [],
      // 低彩度相关数据
      lowMatchedColors: [],
      lowMatchedColorsByLightness: [],
      lowColorGrid: [],
      isLowChroma: false,
    };
  },
  mounted() {
    this.initCanvas();
    this.initLowColorCanvas();
  },
  methods: {
    initCanvas() {
      this.ctx = uni.createCanvasContext("colorPickerCanvas", this);
      this.drawColorPicker();
      this.ctx.draw();
    },

    initLowColorCanvas() {
      this.lowCtx = uni.createCanvasContext("lowColorCanvas", this);
      this.drawLowColorPicker();
      this.lowCtx.draw();
    },

    drawColorPicker() {
      const center = this.size / 2;
      const radius = this.size / 2 - 10;

      this.ctx.clearRect(0, 0, this.size, this.size);

      // Draw white background
      this.ctx.beginPath();
      this.ctx.arc(center, center, radius, 0, 2 * Math.PI);
      this.ctx.setFillStyle("#FFFFFF");
      this.ctx.fill();

      // Draw gray background (no color area)
      this.drawSectorFill(
        center,
        center,
        0,
        radius,
        ((360 - 360) % 360) * (Math.PI / 180),
        ((360 - 300) % 360) * (Math.PI / 180),
        "#F5F5F5"
      );
      this.drawSectorFill(
        center,
        center,
        0,
        radius,
        ((360 - 10) % 360) * (Math.PI / 180),
        ((360 - 0) % 360) * (Math.PI / 180),
        "#F5F5F5"
      );

      // Draw all color sections
      this.drawAllFill(center, radius);

      // Draw center circle
      this.ctx.beginPath();
      this.ctx.arc(center, center, 10, 0, 2 * Math.PI);
      this.ctx.setFillStyle("#FFFFFF");
      this.ctx.fill();
      this.ctx.setStrokeStyle("#DDDDDD");
      this.ctx.setLineWidth(1);
      this.ctx.stroke();

      // Draw radial lines
      this.drawSubtleRadialLines(center, radius);
    },

    drawLowColorPicker() {
      const center = this.lowSize / 2;
      const radius = this.lowSize / 2 - 10;

      this.lowCtx.clearRect(0, 0, this.lowSize, this.lowSize);

      // Draw background
      this.lowCtx.beginPath();
      this.lowCtx.arc(center, center, radius, 0, 2 * Math.PI);
      this.lowCtx.setFillStyle("#F5F5F5");
      this.lowCtx.fill();

      // Draw each sector
      this.low.forEach((section, index) => {
        const [hStart, hEnd] = section.h;
        const startAngle = ((360 - hStart) % 360) * (Math.PI / 180);
        const endAngle = ((360 - hEnd) % 360) * (Math.PI / 180);

        if (section.empty) {
          // Empty data area
          this.drawLowSector(
            center,
            center,
            0,
            radius,
            startAngle,
            endAngle,
            "#EEEEEE",
            "rgba(0,0,0,0.1)"
          );
        } else {
          // Colored area
          const color =
            section.colors && section.colors[0]
              ? this.labToRgb(
                  section.colors[0].l,
                  section.colors[0].a,
                  section.colors[0].b
                )
              : "#CCCCCC";

          this.drawLowSector(
            center,
            center,
            0,
            radius,
            startAngle,
            endAngle,
            color,
            "rgba(0,0,0,0.1)"
          );
        }
      });

      // Draw center circle
      this.lowCtx.beginPath();
      this.lowCtx.arc(center, center, 5, 0, 2 * Math.PI);
      this.lowCtx.setFillStyle("#FFFFFF");
      this.lowCtx.fill();
      this.lowCtx.setStrokeStyle("#DDDDDD");
      this.lowCtx.setLineWidth(1);
      this.lowCtx.stroke();
    },

    drawLowSector(
      x,
      y,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fillColor,
      strokeColor
    ) {
      this.lowCtx.beginPath();
      this.lowCtx.arc(x, y, outerRadius, startAngle, endAngle, false);
      this.lowCtx.lineTo(
        x + Math.cos(endAngle) * innerRadius,
        y + Math.sin(endAngle) * innerRadius
      );
      this.lowCtx.arc(x, y, innerRadius, endAngle, startAngle, true);
      this.lowCtx.closePath();
      this.lowCtx.setFillStyle(fillColor || "transparent");
      this.lowCtx.fill();

      // Add border
      this.lowCtx.beginPath();
      this.lowCtx.arc(x, y, outerRadius, startAngle, endAngle, false);
      this.lowCtx.setStrokeStyle(strokeColor || "rgba(0,0,0,0.1)");
      this.lowCtx.setLineWidth(1);
      this.lowCtx.stroke();
    },

    drawAllFill(center, radius) {
      this.gener.forEach((section) => {
        const [hStart, hEnd] = section.h;
        const startAngle = ((360 - hStart) % 360) * (Math.PI / 180);
        const endAngle = ((360 - hEnd) % 360) * (Math.PI / 180);

        if (section.c) {
          section.c.forEach((cRange, rangeIndex) => {
            const ranges = this.parseCRange(cRange);
            ranges.forEach(([cMin, cMax]) => {
              // 使用该范围内第一个颜色数据作为背景色
              let fillColor = "#CCCCCC"; // 默认颜色

              // 查找该范围内的第一个颜色
              if (section.colors && section.colors.length > 0) {
                const colorInRange = section.colors.find(
                  (color) => color.c >= cMin && color.c <= cMax
                );

                if (colorInRange) {
                  fillColor = this.labToRgb(
                    colorInRange.l,
                    colorInRange.a,
                    colorInRange.b
                  );
                } else {
                  // 如果没找到匹配的颜色，则使用范围内的代表性颜色
                  fillColor = this.getDominantColorForRange(
                    section,
                    cMin,
                    cMax
                  );
                }
              } else {
                // 如果没有颜色数据，则使用范围内的代表性颜色
                fillColor = this.getDominantColorForRange(section, cMin, cMax);
              }

              this.drawSectorFill(
                center,
                center,
                (cMin / this.maxCValue) * radius,
                (cMax / this.maxCValue) * radius,
                startAngle,
                endAngle,
                fillColor
              );
            });
          });
        }
      });
    },

    drawSubtleRadialLines(center, radius) {
      this.ctx.setStrokeStyle("rgba(0,0,0,0.1)");
      this.ctx.setLineWidth(0.5);

      this.gener.forEach((section) => {
        const [hStart] = section.h;
        const angle = ((360 - hStart) % 360) * (Math.PI / 180);

        this.ctx.beginPath();
        this.ctx.moveTo(center, center);
        this.ctx.lineTo(
          center + radius * Math.cos(angle),
          center + radius * Math.sin(angle)
        );
        this.ctx.stroke();
      });
    },

    drawSectorFill(
      x,
      y,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fillColor
    ) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, outerRadius, startAngle, endAngle, false);
      this.ctx.lineTo(
        x + Math.cos(endAngle) * innerRadius,
        y + Math.sin(endAngle) * innerRadius
      );
      this.ctx.arc(x, y, innerRadius, endAngle, startAngle, true);
      this.ctx.closePath();
      this.ctx.setFillStyle(fillColor || "transparent");
      this.ctx.fill();

      // Add border
      this.ctx.beginPath();
      this.ctx.arc(x, y, outerRadius, startAngle, endAngle, false);
      this.ctx.setStrokeStyle("rgba(0,0,0,0.05)");
      this.ctx.setLineWidth(0.5);
      this.ctx.stroke();
    },

    getDominantColorForRange(section, cMin, cMax) {
      if (section.colors) {
        const matchedColor = section.colors.find(
          (color) => color.c >= cMin && color.c <= cMax
        );
        if (matchedColor) {
          return this.labToRgb(matchedColor.l, matchedColor.a, matchedColor.b);
        }
      }

      const midC = (cMin + cMax) / 2;
      return this.labToRgb(
        50,
        section.name.includes("B") ? -40 : section.name.includes("R") ? 40 : 0,
        section.name.includes("G") ? 40 : section.name.includes("Y") ? 60 : -40
      );
    },

    parseCRange(cRange) {
      if (cRange.length === 2) return [[cRange[0], cRange[1]]];
      if (cRange.length === 4)
        return [
          [cRange[0], cRange[1]],
          [cRange[2], cRange[3]],
        ];
      return [];
    },

    labToRgb(l, a, b) {
      // LAB to XYZ conversion
      let y = (l + 16) / 116;
      let x = a / 500 + y;
      let z = y - b / 200;

      x = 0.95047 * (x > 0.206893 ? x * x * x : (x - 16 / 116) / 7.787);
      y = 1.0 * (y > 0.206893 ? y * y * y : (y - 16 / 116) / 7.787);
      z = 1.08883 * (z > 0.206893 ? z * z * z : (z - 16 / 116) / 7.787);

      // XYZ to RGB conversion
      let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      let bValue = x * 0.0557 + y * -0.204 + z * 1.057;

      // Gamma correction
      r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
      g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
      bValue =
        bValue > 0.0031308
          ? 1.055 * Math.pow(bValue, 1 / 2.4) - 0.055
          : 12.92 * bValue;

      // Clamp and convert to HEX
      r = Math.max(0, Math.min(1, r));
      g = Math.max(0, Math.min(1, g));
      bValue = Math.max(0, Math.min(1, bValue));

      const toHex = (c) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };

      return `#${toHex(r)}${toHex(g)}${toHex(bValue)}`;
    },

    handleTouchStart(e) {
      this.touchStartX = e.touches[0].x;
      this.touchStartY = e.touches[0].y;
    },

    handleTouchMove(e) {
      // Touch move interaction can be added here
    },

    // 重置所有颜色相关数据
    resetColorData() {
      this.matchedColors = [];
      this.matchedColorsByLightness = Array(this.lightnessRanges.length)
        .fill()
        .map(() => []);
      this.colorGrid = [];

      this.lowMatchedColors = [];
      this.lowMatchedColorsByLightness = Array(this.lowLightnessRanges.length)
        .fill()
        .map(() => []);
      this.lowColorGrid = [];
    },

    handleTouchEnd(e) {
      const x = e.changedTouches[0].x;
      const y = e.changedTouches[0].y;
      const center = this.size / 2;
      const dx = x - center;
      const dy = y - center;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = this.size / 2 - 10;

      if (distance <= radius) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const normalizedAngle = (360 - angle) % 360;
        const cValue = (distance / radius) * this.maxCValue;

        const selectedColor = this.getColorFromGener(normalizedAngle, cValue);
        this.selectedColor = selectedColor;
        this.$emit("color-selected", selectedColor);

        // 重置数据并设置为高彩度模式
        this.isLowChroma = false;
        this.resetColorData();

        // 新增：查找匹配的颜色并更新显示
        this.findMatchedColors(normalizedAngle, cValue);
      }
    },

    // 修改 findMatchedColors 方法中的这部分代码
    findMatchedColors(h, c) {
      // 查找匹配的色系
      const matchedSection = this.gener.find((section) => {
        const [hStart, hEnd] = section.h;
        return h >= hEnd && h <= hStart;
      });

      if (!matchedSection) {
        this.matchedColors = [];
        this.selectedColorInfo = "未找到匹配色系";
        return;
      }

      // 查找匹配C范围的所有颜色
      const matchedCRanges = this.getMatchedCRanges(matchedSection.c, c);

      // 这里修改为只显示选中颜色所在的C范围
      const selectedCRangeText = matchedCRanges
        .map((range) => `${range[0]}-${range[1]}`)
        .join("; ");

      // 设置选中颜色信息，只显示选中的C范围
      this.selectedColorInfo = `${matchedSection.label} (${matchedSection.name}) H:${matchedSection.h[1]}-${matchedSection.h[0]}° C:${selectedCRangeText}`;

      this.matchedColors = matchedSection.colors.filter((color) => {
        return matchedCRanges.some(
          (range) => color.c >= range[0] && color.c <= range[1]
        );
      });

      // 转换为RGB格式并添加颜色信息
      this.matchedColors = this.matchedColors.map((color) => ({
        ...color,
        color: this.labToRgb(color.l, color.a, color.b),
        lightnessRange: this.getLightnessRange(color.l),
      }));

      // 按明度分组
      this.groupColorsByLightness();

      // 生成颜色网格
      this.generateColorGrid();
    },
    // 新增方法：获取C范围文本
    getCRangesText(cRanges) {
      if (!cRanges) return "";
      return cRanges
        .map((range) => {
          if (range.length === 2) return `${range[0]}-${range[1]}`;
          if (range.length === 4)
            return `${range[0]}-${range[1]},${range[2]}-${range[3]}`;
          return "";
        })
        .join("; ");
    },

    // 新增方法：获取匹配的C范围
    getMatchedCRanges(cRanges, cValue) {
      if (!cRanges) return [];
      const matched = [];

      cRanges.forEach((range) => {
        if (range.length === 2) {
          if (cValue >= range[0] && cValue <= range[1]) {
            matched.push([range[0], range[1]]);
          }
        } else if (range.length === 4) {
          if (cValue >= range[0] && cValue <= range[1]) {
            matched.push([range[0], range[1]]);
          }
          if (cValue >= range[2] && cValue <= range[3]) {
            matched.push([range[2], range[3]]);
          }
        }
      });

      return matched;
    },

    // 新增方法：获取明度范围
    getLightnessRange(l) {
      return this.lightnessRanges.find(
        (range) => l >= range[0] && l <= range[1]
      );
    },

    // 新增方法：按明度分组颜色
    groupColorsByLightness() {
      this.matchedColorsByLightness = this.lightnessRanges.map((range) => {
        return this.matchedColors.filter((color) => {
          return color.l >= range[0] && color.l <= range[1];
        });
      });
    },

    generateColorGrid() {
      this.colorGrid = [];
      const columns = 5;

      // 创建颜色副本
      const colors = [...this.matchedColors];

      // 生成行，确保每一行都有5个单元格
      for (let i = 0; i < 3; i++) {
        // 确保有3行
        const row = [];
        // 每行填充5个单元格
        for (let j = 0; j < columns; j++) {
          const index = i * columns + j;
          if (index < colors.length) {
            row.push(colors[index]);
          } else {
            row.push(null); // 用null填充空单元格
          }
        }
        this.colorGrid.push(row);
      }
    },

    handleLowTouchEnd(e) {
      const x = e.changedTouches[0].x;
      const y = e.changedTouches[0].y;
      const center = this.lowSize / 2;
      const dx = x - center;
      const dy = y - center;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = this.lowSize / 2 - 10;

      if (distance <= radius) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const normalizedAngle = (360 - angle) % 360;

        const matchedSection = this.low.find((section) => {
          const [hStart, hEnd] = section.h;
          return hEnd <= normalizedAngle && normalizedAngle <= hStart;
        });

        if (
          matchedSection &&
          matchedSection.colors &&
          matchedSection.colors[0]
        ) {
          const color = matchedSection.colors[0];
          const selectedColor = this.labToRgb(color.l, color.a, color.b);
          this.selectedColor = selectedColor;
          this.$emit("color-selected", selectedColor);

          // 重置数据并设置为低彩度模式
          this.isLowChroma = true;
          this.resetColorData();

          // 查找匹配的颜色并更新显示
          this.findLowMatchedColors(normalizedAngle);
        }
      }
    },

    // 修改 findLowMatchedColors 方法
    findLowMatchedColors(h) {
      // 查找匹配的色系
      const matchedSection = this.low.find((section) => {
        const [hStart, hEnd] = section.h;
        return hEnd <= h && h <= hStart;
      });

      if (!matchedSection || !matchedSection.colors) {
        this.selectedColorInfo = "未找到匹配色系";
        return;
      }

      // 设置选中颜色信息
      this.selectedColorInfo = `${matchedSection.label} (${matchedSection.name})`;

      // 获取所有颜色
      this.lowMatchedColors = matchedSection.colors.map((color) => ({
        ...color,
        color: this.labToRgb(color.l, color.a, color.b),
        lightnessRange: this.getLowLightnessRange(color.l),
      }));

      // 按明度分组
      this.groupLowColorsByLightness();

      // 生成颜色网格 (5列4行)
      this.generateLowColorGrid();
    },

    // 获取低彩度明度范围
    getLowLightnessRange(l) {
      return this.lowLightnessRanges.find(
        (range) => l >= range[0] && l <= range[1]
      );
    },

    // 按明度分组低彩度颜色
    groupLowColorsByLightness() {
      this.lowMatchedColorsByLightness = this.lowLightnessRanges.map(
        (range) => {
          return this.lowMatchedColors.filter((color) => {
            return color.l >= range[0] && color.l <= range[1];
          });
        }
      );
    },

    // 生成低彩度颜色网格 (5列4行)
    generateLowColorGrid() {
      this.lowColorGrid = [];
      const columns = 5;

      // 创建颜色副本
      const colors = [...this.lowMatchedColors];

      // 生成行，确保每一行都有5个单元格
      for (let i = 0; i < 4; i++) {
        // 确保有4行
        const row = [];
        // 每行填充5个单元格
        for (let j = 0; j < columns; j++) {
          const index = i * columns + j;
          if (index < colors.length) {
            row.push(colors[index]);
          } else {
            row.push(null); // 用null填充空单元格
          }
        }
        this.lowColorGrid.push(row);
      }
    },

    getColorFromGener(h, c) {
      const matchedSection = this.gener.find((section) => {
        const [hStart, hEnd] = section.h;
        return h >= hEnd && h <= hStart;
      });

      if (!matchedSection) return "#FFFFFF";

      if (matchedSection.colors) {
        const matchedColor = matchedSection.colors.find((color) => {
          return Math.abs(color.c - c) < 10;
        });
        if (matchedColor) {
          return this.labToRgb(matchedColor.l, matchedColor.a, matchedColor.b);
        }
      }

      if (matchedSection.c) {
        for (const cRange of matchedSection.c) {
          const ranges = this.parseCRange(cRange);
          for (const [cMin, cMax] of ranges) {
            if (c >= cMin && c <= cMax) {
              return this.getDominantColorForRange(matchedSection, cMin, cMax);
            }
          }
        }
      }

      return "#FFFFFF";
    },

    getLabelStyle(section, index) {
      const center = this.size / 2;
      const radius = this.size / 2 + 25;
      const [hStart, hEnd] = section.h;
      const middleAngle = ((360 - (hStart + hEnd) / 2) % 360) * (Math.PI / 180);
      const x = center + radius * Math.cos(middleAngle);
      const y = center + radius * Math.sin(middleAngle);

      return {
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      };
    },

    getLowLabelStyle(section, index) {
      const center = this.lowSize / 2;
      const radius = this.lowSize / 2 + 20;
      const [hStart, hEnd] = section.h;
      const middleAngle = ((360 - (hStart + hEnd) / 2) % 360) * (Math.PI / 180);
      const x = center + radius * Math.cos(middleAngle);
      const y = center + radius * Math.sin(middleAngle);

      return {
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        color: section.empty ? "#999" : "#333",
      };
    },

    getLabForColor(hexColor) {
      // 遍历 gener 和 low 数组查找匹配的颜色
      for (const section of this.gener) {
        for (const color of section.colors) {
          const rgb = this.labToRgb(color.l, color.a, color.b);
          if (rgb.toLowerCase() === hexColor.toLowerCase()) {
            return `L:${color.l} A:${color.a} B:${color.b}`;
          }
        }
      }

      for (const section of this.low) {
        if (section.colors) {
          for (const color of section.colors) {
            const rgb = this.labToRgb(color.l, color.a, color.b);
            if (rgb.toLowerCase() === hexColor.toLowerCase()) {
              return `L:${color.l} A:${color.a} B:${color.b}`;
            }
          }
        }
      }

      return "未找到LAB值";
    },

    // 获取第一行的明度范围（7个或9个）
    getFirstRowRanges() {
      const ranges = this.isLowChroma
        ? this.lowLightnessRanges
        : this.lightnessRanges;
      const count = this.isLowChroma ? 9 : 7;
      return ranges.slice(0, count);
    },

    // 获取第二行的明度范围（8个或10个）
    getSecondRowRanges() {
      const ranges = this.isLowChroma
        ? this.lowLightnessRanges
        : this.lightnessRanges;
      const start = this.isLowChroma ? 9 : 7;
      return ranges.slice(start);
    },

    // 获取指定位置的颜色
    getScaleColor(index, isFirstRow) {
      const dataArray = this.isLowChroma
        ? this.lowMatchedColorsByLightness
        : this.matchedColorsByLightness;
      let actualIndex;

      if (isFirstRow) {
        actualIndex = index;
      } else {
        actualIndex = (this.isLowChroma ? 9 : 7) + index;
      }

      if (dataArray[actualIndex] && dataArray[actualIndex].length > 0) {
        return this.isLowChroma
          ? dataArray[actualIndex][0].color
          : dataArray[actualIndex][0].color;
      }

      return null;
    },
  },
};
</script>

<style scoped>
.color-picker-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.color-picker-container,
.low-color-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 16rpx;
}

.color-picker-canvas,
.low-color-canvas {
  border-radius: 50%;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.05);
  touch-action: none;
}

.labels-container,
.low-labels-container {
  position: absolute;
  pointer-events: none;
}

.color-label,
.low-color-label {
  position: absolute;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.7);
}

.low-color-label {
  font-size: 10px;
}

.chart-description {
  font-size: 14px;
  color: #666;
  margin-top: 30px;
  margin-bottom: 30px;
}

.result-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.placeholder-image {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}

.placeholder-text {
  font-size: 14px;
  color: #999;
}

.selected-color-info {
  font-size: 16px;
  color: #333;
}

.content {
  display: flex;
  width: 100%;
  margin-top: 15px;
}

.lightness-scale {
  width: 60px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
  padding-right: 10px;
}

.scale-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.scale-label {
  font-size: 12px;
  color: #666;
}

.scale-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #eee;
}

/* 水平明度色序条样式 */
.horizontal-lightness-scale-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px 0;
  width: 100%;
}

.horizontal-lightness-scale-row {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.horizontal-scale-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30px;
}

.horizontal-scale-label {
  font-size: 8px;
  color: #666;
  text-align: center;
  margin-bottom: 3px;
}

.horizontal-scale-color {
  width: 24px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid #eee;
}

.horizontal-scale-color.empty {
  background-color: #f0f0f0;
}

.color-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  width: 100%;
}

.grid-row {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}

.grid-cell {
  width: 40px;
  height: 30px;
  margin: 0 2px;
  border-radius: 4px;
  border: 1px solid #eee;
  flex: none;
}

.grid-cell:last-child {
  margin-right: 2px;
}

.grid-cell {
  width: 40px;
  height: 30px;
  margin-right: 5px;
  border-radius: 4px;
  border: 1px solid #eee;
  flex: none; /* 禁止弹性伸缩 */
}

.grid-cell:last-child {
  margin-right: 0;
}

.title {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.main-title {
  font-weight: bold; /* 主标题加粗 */
  margin-right: 10px; /* 与副标题保持间距 */
  flex-shrink: 0; /* 防止主标题被压缩 */
}

.second-title {
  font-size: 14px;
  color: #666;
  flex: 1; /* 占据剩余空间 */
  text-align: left; /* 改为左对齐 */
  white-space: nowrap; /* 防止换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
</style>