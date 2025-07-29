<template>
  <view class="color-picker">
    <!-- 左侧区域 -->
    <view class="left">
      <!-- 颜色展示区 -->
      <view
        class="color-show"
        :style="{ backgroundColor: currentColorHex }"
      ></view>

      <!-- 数值区 -->
      <view class="number-area">
        <view class="hex">
          <text>十六进制</text>
          <input class="input" v-model="currentColorHex" placeholder="请输入" />
        </view>
        <view class="num">
          <view class="rgb-selector">
            <picker
              mode="selector"
              :range="colorModes"
              @change="onColorModeChange"
            >
              {{ selectedMode }}
            </picker>
          </view>
          <view class="rgb-inputs">
            <input class="rgb-input" v-model="rgbValues.r" placeholder="" />
            <input class="rgb-input" v-model="rgbValues.g" placeholder="" />
            <input class="rgb-input" v-model="rgbValues.b" placeholder="" />
          </view>
        </view>
      </view>

      <!-- 预设色彩区 -->
      <view class="preset-color">
        <text>基本颜色</text>
        <view class="dots">
          <view v-for="(row, rowIndex) in 2" :key="rowIndex" class="dot-row">
            <view
              v-for="(col, colIndex) in 10"
              :key="colIndex"
              class="dot"
              :style="{ backgroundColor: getPresetColor(rowIndex, colIndex) }"
              @click="selectPresetColor(rowIndex, colIndex)"
            ></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 右侧区域 -->
    <view class="right">
      <!-- 色盘 -->
      <view
        class="color-plate"
        @touchstart="handlePlateTouchStart"
        @touchmove="handlePlateTouchMove"
        @touchend="handlePlateTouchEnd"
      >
        <view
          class="color-plate-gradient"
          :style="{ '--hue': hue + 'deg' }"
        ></view>
        <view
          class="color-plate-thumb"
          :style="{ left: plateThumbX + 'px', top: plateThumbY + 'px' }"
        ></view>
      </view>

      <!-- 色相滑块 - 放在右侧，垂直方向 -->
      <view
        class="hue-slider"
        @touchstart="handleHueSliderTouchStart"
        @touchmove="handleHueSliderTouchMove"
      >
        <view class="hue-slider-track">
          <view class="hue-slider-gradient"></view>
        </view>
        <view
          class="hue-slider-thumb"
          :style="{ top: hueSliderThumbY + 'px' }"
        ></view>
      </view>
    </view>
  </view>
</template>

<!-- picker.vue -->
<script>
import { useColorStore } from '@/stores/color-search.js';

export default {
  setup() {
    const colorStore = useColorStore();
    return {
      colorStore
    };
  },
  data() {
    return {
      colorModes: ["RGB", "HSL", "HSV"],
      // 颜色参数
      plateThumbX: 0,
      plateThumbY: 0,
      plateWidth: 300,
      plateHeight: 300,
      // 色相滑块相关
      hueSliderThumbY: 0,
      hueSliderHeight: 300,
      isPlateTouching: false,
      isHueSliderTouching: false,
      // 预设颜色数组
      presetColors: [
        [
          "#FF0000",
          "#FF4000",
          "#FF8000",
          "#FFBF00",
          "#FFFF00",
          "#80FF00",
          "#00FF00",
          "#00FF80",
          "#00FFFF",
          "#0080FF",
        ],
        [
          "#0000FF",
          "#4000FF",
          "#8000FF",
          "#BF00FF",
          "#FF00FF",
          "#FF0080",
          "#C0C0C0",
          "#808080",
          "#000000",
          "#FFFFFF",
        ],
      ],
    };
  },
  computed: {
    selectedMode() {
      return this.colorStore.selectedMode;
    },
    rgbValues() {
      return this.colorStore.rgbValues;
    },
    currentColorHex() {
      return this.colorStore.currentColorHex;
    },
    hue() {
      return this.colorStore.hue;
    },
    saturation() {
      return this.colorStore.saturation;
    },
    lightness() {
      return this.colorStore.lightness;
    }
  },
  mounted() {
    this.getComponentSizes();
    this.initColorPosition();
  },
  methods: {
    onColorModeChange(e) {
      this.colorStore.updateColorMode(this.colorModes[e.detail.value]);
    },
    getPresetColor(rowIndex, colIndex) {
      return this.presetColors[rowIndex][colIndex];
    },
    selectPresetColor(rowIndex, colIndex) {
      const hex = this.presetColors[rowIndex][colIndex];
      const rgb = this.hexToRgb(hex.substring(1));
      const hsl = this.rgbToHsl(rgb[0], rgb[1], rgb[2]);
      
      // 使用store更新所有颜色数据
      this.colorStore.updateColorData({
        hex: hex,
        rgb: { r: rgb[0], g: rgb[1], b: rgb[2] },
        hsl: { h: hsl[0], s: hsl[1], l: hsl[2] }
      }, 'preset');
      
      this.updateThumbPositions();
      this.$nextTick(() => {
        this.colorStore.resetUpdatingFrom();
      });
    },
    getComponentSizes() {
      const query = uni.createSelectorQuery().in(this);

      query
        .select(".color-plate")
        .boundingClientRect((data) => {
          this.plateWidth = data.width;
          this.plateHeight = data.height;
          this.updateThumbPositions();
        })
        .exec();

      query
        .select(".hue-slider")
        .boundingClientRect((data) => {
          this.hueSliderHeight = data.height;
          this.updateThumbPositions();
        })
        .exec();
    },
    initColorPosition() {
      const hsl = this.rgbToHsl(
        parseInt(this.rgbValues.r),
        parseInt(this.rgbValues.g),
        parseInt(this.rgbValues.b)
      );
      this.colorStore.updateHslValues({ 
        h: hsl[0], 
        s: hsl[1], 
        l: hsl[2] 
      }, 'init');
      
      this.$nextTick(() => {
        this.updateThumbPositions();
        this.colorStore.resetUpdatingFrom();
      });
    },
    updateThumbPositions() {
      // 更新色盘滑块位置
      if (this.plateWidth > 0 && this.plateHeight > 0) {
        this.plateThumbX = (this.saturation / 100) * this.plateWidth;
        this.plateThumbY = ((100 - this.lightness) / 100) * this.plateHeight;
      }

      // 更新色相滑块位置
      if (this.hueSliderHeight > 0) {
        this.hueSliderThumbY = (this.hue / 360) * this.hueSliderHeight;
      }
    },
    // 色盘触摸事件处理
    handlePlateTouchStart(e) {
      this.isPlateTouching = true;
      this.updatePlateThumbPosition(e.touches[0]);
    },
    handlePlateTouchMove(e) {
      if (!this.isPlateTouching) return;
      this.updatePlateThumbPosition(e.touches[0]);
    },
    handlePlateTouchEnd() {
      this.isPlateTouching = false;
      this.colorStore.resetUpdatingFrom();
    },
    updatePlateThumbPosition(touch) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".color-plate")
        .boundingClientRect((data) => {
          let x = touch.clientX - data.left;
          let y = touch.clientY - data.top;

          // 边界检查
          x = Math.max(0, Math.min(x, data.width));
          y = Math.max(0, Math.min(y, data.height));

          this.plateThumbX = x;
          this.plateThumbY = y;

          // 计算饱和度和亮度
          const saturation = Math.round((x / data.width) * 100);
          const lightness = Math.round(100 - (y / data.height) * 100);

          const rgb = this.hslToRgb(this.hue, saturation, lightness);
          const hex = this.rgbToHex(rgb);
          
          // 更新store中的颜色数据
          this.colorStore.updateColorData({
            hex: `#${hex}`,
            rgb: { r: rgb[0], g: rgb[1], b: rgb[2] },
            hsl: { h: this.hue, s: saturation, l: lightness }
          }, 'plate');
        })
        .exec();
    },
    // 色相滑块触摸事件处理
    handleHueSliderTouchStart(e) {
      this.isHueSliderTouching = true;
      this.updateHueSliderThumbPosition(e.touches[0]);
    },
    handleHueSliderTouchMove(e) {
      if (!this.isHueSliderTouching) return;
      this.updateHueSliderThumbPosition(e.touches[0]);
    },
    updateHueSliderThumbPosition(touch) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".hue-slider")
        .boundingClientRect((data) => {
          let y = touch.clientY - data.top;
          y = Math.max(0, Math.min(y, data.height));

          this.hueSliderThumbY = y;
          const hue = Math.round((y / data.height) * 360);

          const rgb = this.hslToRgb(hue, this.saturation, this.lightness);
          const hex = this.rgbToHex(rgb);
          
          // 更新store中的颜色数据
          this.colorStore.updateColorData({
            hex: `#${hex}`,
            rgb: { r: rgb[0], g: rgb[1], b: rgb[2] },
            hsl: { h: hue, s: this.saturation, l: this.lightness }
          }, 'hue');
        })
        .exec();
    },
    // 颜色转换方法
    rgbToHsl(r, g, b) {
      (r /= 255), (g /= 255), (b /= 255);
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
        l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    },
    hslToRgb(h, s, l) {
      h /= 360;
      s /= 100;
      l /= 100;

      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    },
    rgbToHex(rgb) {
      return rgb
        .map((v) => {
          const hex = v.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("");
    },
    hexToRgb(hex) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return [r, g, b];
    },
  },
  watch: {
    currentColorHex: {
      handler(newVal) {
        // 如果更新来源于自身，则跳过处理
        if (this.colorStore.updatingFrom === 'hex') {
          return;
        }
        
        if (newVal && newVal.length === 7) {
          const hex = newVal.substring(1);
          const rgb = this.hexToRgb(hex);
          const hsl = this.rgbToHsl(rgb[0], rgb[1], rgb[2]);
          
          this.colorStore.updateColorData({
            hex: newVal,
            rgb: { r: rgb[0], g: rgb[1], b: rgb[2] },
            hsl: { h: hsl[0], s: hsl[1], l: hsl[2] }
          }, 'hex');
          
          this.updateThumbPositions();
          this.$nextTick(() => {
            this.colorStore.resetUpdatingFrom();
          });
        }
      }
    },
    rgbValues: {
      deep: true,
      handler(newVal) {
        // 如果更新来源于自身，则跳过处理
        if (this.colorStore.updatingFrom === 'rgb') {
          return;
        }
        
        if (newVal.r && newVal.g && newVal.b) {
          const rgb = [
            parseInt(newVal.r),
            parseInt(newVal.g),
            parseInt(newVal.b),
          ];
          const hex = this.rgbToHex(rgb);
          const hsl = this.rgbToHsl(rgb[0], rgb[1], rgb[2]);
          
          this.colorStore.updateColorData({
            hex: `#${hex}`,
            rgb: { r: rgb[0], g: rgb[1], b: rgb[2] },
            hsl: { h: hsl[0], s: hsl[1], l: hsl[2] }
          }, 'rgb');
          
          this.updateThumbPositions();
          this.$nextTick(() => {
            this.colorStore.resetUpdatingFrom();
          });
        }
      },
    },
  },
};
</script>

<style scoped>
.color-picker {
  padding: 20rpx;
  display: flex;
  height: 30vh;
  box-sizing: border-box;
}

.left {
  width: 45%;
  display: flex;
  flex-direction: column;
}

.color-show {
  background-color: #a45f44;
  height: 100rpx;
  border-radius: 18rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.number-area {
  margin-top: 10rpx;
}

.hex {
  display: flex;
  font-size: 20rpx;
  align-items: center;
  margin-bottom: 10rpx;
}

.hex text {
  color: #666;
  width: 120rpx;
}

.input {
  flex: 1;
  height: 40rpx;
  border-radius: 8rpx;
  border: 1rpx solid #e0e0e0;
  padding: 0 20rpx;
  font-size: 20rpx;
  background-color: #fff;
}

.num {
  display: flex;
  align-items: center;
}

.rgb-selector {
  width: 120rpx;
  height: 40rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  margin-right: 10rpx;
  background-color: #fff;
}

.rgb-inputs {
  display: flex;
  flex: 1;
}

.rgb-input {
  flex: 1;
  height: 40rpx;
  border: 1rpx solid #e0e0e0;
  text-align: center;
  font-size: 20rpx;
  background-color: #fff;
}

.rgb-input:first-child {
  border-radius: 8rpx 0 0 8rpx;
  margin-right: -1rpx;
}

.rgb-input:nth-child(2) {
  margin-right: -1rpx;
}

.rgb-input:last-child {
  border-radius: 0 8rpx 8rpx 0;
}

.preset-color {
  margin-top: 10rpx;
  font-size: 20rpx;
}

.preset-color text {
  color: #666;
}

.dots {
  margin-top: 10rpx;
}

.dot-row {
  display: flex;
  margin-bottom: 5rpx;
}

.dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.dot:last-child {
  margin-right: 0;
}

.right {
  flex: 1;
  margin-left: 30rpx;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.color-plate {
  width: 300rpx;
  height: 300rpx;
  border-radius: 16rpx;
  position: relative;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  margin-right: 20rpx; /* 添加右边距 */
}

.color-plate-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, #000 100%),
    linear-gradient(to right, #fff 0%, hsl(var(--hue), 100%, 50%) 100%);
  position: relative;
}

.color-plate-thumb {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 3rpx solid #fff;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 10;
}

.hue-slider {
  height: 300rpx;
  width: 20rpx;
  border-radius: 30rpx;
  background-color: #f0f0f0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.hue-slider-track {
  width: 100%;
  height: 100%;
  position: relative;
}

.hue-slider-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    #ff0000,
    #ffff00,
    #00ff00,
    #00ffff,
    #0000ff,
    #ff00ff,
    #ff0000
  );
}

.hue-slider-thumb {
  position: absolute;
  width: 60rpx;
  height: 12rpx;
  background-color: #fff;
  border-radius: 6rpx;
  left: 0;
  transform: translateY(-50%);
  box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 10;
}
</style>