import { defineStore } from 'pinia';

export const useColorStore = defineStore('color', {
  state: () => ({
    // 当前选中的颜色值
    currentColorHex: '#a45f44',
    rgbValues: {
      r: '164',
      g: '95',
      b: '68'
    },
    // 颜色模式
    selectedMode: 'RGB',
    colorModes: ['RGB', 'HSL', 'HSV'],
    // HSL值
    hue: 15,
    saturation: 59,
    lightness: 45,
    // 控制更新来源，避免循环更新
    updatingFrom: null, // 'hex', 'rgb', 'hsl', 'preset'
    // 颜色名称（如果需要的话）
    colorName: ''
  }),
  
  getters: {
    // 获取RGB数组格式
    rgbArray: (state) => [
      parseInt(state.rgbValues.r),
      parseInt(state.rgbValues.g),
      parseInt(state.rgbValues.b)
    ],
    
    // 获取HSL数组格式
    hslArray: (state) => [
      state.hue,
      state.saturation,
      state.lightness
    ]
  },
  
  actions: {
    /**
     * 更新当前颜色的HEX值
     * @param {string} hex - HEX颜色值
     * @param {string} source - 更新来源
     */
    updateColorHex(hex, source = null) {
      if (source) this.updatingFrom = source;
      this.currentColorHex = hex;
    },
    
    /**
     * 更新RGB值
     * @param {object} rgb - RGB对象 {r, g, b}
     * @param {string} source - 更新来源
     */
    updateRgbValues(rgb, source = null) {
      if (source) this.updatingFrom = source;
      this.rgbValues = { ...rgb };
    },
    
    /**
     * 更新HSL值
     * @param {object} hsl - HSL对象 {h, s, l}
     * @param {string} source - 更新来源
     */
    updateHslValues(hsl, source = null) {
      if (source) this.updatingFrom = source;
      this.hue = hsl.h;
      this.saturation = hsl.s;
      this.lightness = hsl.l;
    },
    
    /**
     * 更新颜色模式
     * @param {string} mode - 颜色模式
     */
    updateColorMode(mode) {
      this.selectedMode = mode;
    },
    
    /**
     * 批量更新颜色相关数据
     * @param {object} colorData - 包含所有颜色信息的对象
     * @param {string} source - 更新来源
     */
    updateColorData(colorData, source = null) {
      if (source) this.updatingFrom = source;
      
      const { hex, rgb, hsl, mode } = colorData;
      if (hex !== undefined) this.currentColorHex = hex;
      if (rgb !== undefined) this.rgbValues = { ...rgb };
      if (hsl !== undefined) {
        this.hue = hsl.h;
        this.saturation = hsl.s;
        this.lightness = hsl.l;
      }
      if (mode !== undefined) this.selectedMode = mode;
    },
    
    /**
     * 重置更新来源标记
     */
    resetUpdatingFrom() {
      this.updatingFrom = null;
    }
  }
});