// src/stores/colorStore.js
import { defineStore } from 'pinia'

export const useColorStore = defineStore('color', {
  state: () => ({
    // 控制显示哪个视图: 'picker-list', 'picker-detail', 'picker-low-chroma'
    currentView: 'picker-list',
    // 当前选中的颜色
    selectedColor: null
  }),
  
  actions: {
    showPickerAndList() {
      this.currentView = 'picker-list'
      this.selectedColor = null
    },
    
    showPickerAndDetail(color) {
      this.currentView = 'picker-detail'
      if (color) {
        this.selectedColor = color
      }
    },
    
    showPickerAndLowChroma() {
      this.currentView = 'picker-low-chroma'
      this.selectedColor = null
    },
    
    selectColor(color) {
      this.selectedColor = color
    },

    // 重置到初始状态
    reset() {
      this.currentView = 'picker-list'
      this.selectedColor = null
    }
  }
})