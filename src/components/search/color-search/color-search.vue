<!-- src/components/search/color-search/color-search.vue -->
<template>
  <view class="container">
    <!-- 色彩总谱说明弹窗 -->
    <color-spectrum-modal
      v-if="showSpectrumModal"
      @confirmed="handleSpectrumConfirmed"
    ></color-spectrum-modal>

    <!-- 页面内容（只有在弹窗关闭后才显示） -->
    <view v-if="!showSpectrumModal">
      <view class="content">
        <view
          class="tip"
          v-if="
            colorStore.currentView === 'picker-list' ||
            colorStore.currentView === 'picker-low-chroma'
          "
        >
        </view>
      </view>
      <!-- 根据状态显示不同组件 -->
      <view
        class="list-wrapper"
        v-if="colorStore.currentView === 'picker-list'"
        :class="{ 'blur-background': showFirstGuide || showSecondGuide }"
      >
        <color-list
          :is-low-chroma="false"
          :center-colors="centerColors"
          @color-selected="handleColorSelect"
        >
        </color-list>
      </view>

      <view
        class="detail-wrapper"
        v-if="
          colorStore.currentView === 'picker-detail' ||
          colorStore.currentView === 'picker-low-chroma'
        "
      >
        <color-detail
          :color-data="selectedColorDetails"
          :title="selectedColorTitle"
          @go-back="handleGoBack"
        >
        </color-detail>
      </view>

      <!-- 只在需要显示色盘时才显示 -->
      <view
        class="picker-wrapper"
        v-if="
          colorStore.currentView === 'picker-list' ||
          colorStore.currentView === 'picker-low-chroma'
        "
        :class="{ 'blur-background': showSecondGuide }"
      >
        <color-picker
          ref="colorPicker"
          @low-chroma-toggle="handleLowChromaToggle"
          @draw-finish="handleDrawFinish"
          @update:center-colors="handleCenterColorsUpdate"
          @low-chroma-center-selected="handleLowChromaCenterSelected"
          @angle-update="handleAngleUpdate"
        ></color-picker>
      </view>
    </view>
  </view>

  <!-- 引导弹窗移到组件外部，确保层级最高 -->
  <guide-modal
    v-if="showGuideModal && canvasDrawFinished"
    :show="showFirstGuide"
    :text="firstGuideText"
    :second-text="secondGuideText"
    @next="handleFirstGuideNext"
    @learned="handleGuideLearned"
  ></guide-modal>
</template>

<script>
import { useColorStore } from "@/stores/colorStore";
import ColorPicker from "@/components/search/color-search/picker-circle.vue";
import ColorList from "@/components/search/color-search/color-list.vue";
import ColorDetail from "@/components/search/color-search/color-detail.vue";
import ColorSpectrumModal from "@/components/search/color-search/color-spectrum-modal.vue";
import GuideModal from "@/components/search/color-search/guide-modal.vue";
import { getColorDetail, getLowChromaColorDetail } from "@/api/search/color-search.js";

export default {
  components: {
    ColorPicker,
    ColorList,
    ColorDetail,
    ColorSpectrumModal,
    GuideModal,
  },
  setup() {
    const colorStore = useColorStore();
    return { colorStore };
  },
  data() {
    return {
      showSpectrumModal: false, // 初始设为false，通过检查决定是否显示
      showGuideModal: false, // 控制引导弹窗显示
      showFirstGuide: false, // 控制第一个引导步骤
      showSecondGuide: false, // 控制第二个引导步骤
      firstGuideText: "转动色彩圆盘或点击某个色系查看放大图像",
      secondGuideText: "点击上方切换按钮可查看低彩度色彩详情",
      canvasDrawFinished: false, // Canvas绘制完成状态
      centerColors: [], // 存储色盘中心颜色
      selectedColorDetails: [], // 存储选中颜色的详细信息
      selectedColorTitle: "颜色详情", // 选中颜色的标题
      previousView: 'picker-list', // 保存进入详情页前的视图状态
      previousHighChromaAngle: 0, // 保存进入详情页前高艳色模式的角度
      previousLowChromaAngle: 0  // 保存进入详情页前低艳色模式的角度
    };
  },
  created() {
    // 组件创建时检查是否需要显示弹窗
    this.checkAndShowSpectrumModal();
    // 重置到初始状态
    this.resetToInitialState();
  },
  activated() {
    // 如果使用了 keep-alive，组件激活时重置到初始状态
    this.resetToInitialState();
  },
  methods: {
    resetToInitialState() {
      // 重置到初始状态
      this.colorStore.reset();
      this.canvasDrawFinished = false;
    },

    handleLowChromaCenterSelected(centerColor) {
      // 保存当前视图状态和色盘角度
      this.previousView = this.colorStore.currentView;
      
      // 保存不同模式的角度
      if (this.$refs.colorPicker) {
        const currentAngle = this.$refs.colorPicker.getAngle();
        if (this.colorStore.currentView === 'picker-low-chroma') {
          this.previousLowChromaAngle = currentAngle;
        } else {
          this.previousHighChromaAngle = currentAngle;
        }
      }
      
      // 处理低艳色中心颜色选择事件
      this.fetchLowChromaColorDetail(centerColor);
    },

    async fetchLowChromaColorDetail(centerColor) {
      try {
        const res = await getLowChromaColorDetail(true, centerColor);
        if (res.status === "success") {
          this.selectedColorDetails = res.data;
          this.selectedColorTitle = centerColor.label 
            ? `${centerColor.label}色系` 
            : "颜色详情";
          this.colorStore.showPickerAndLowChroma();
        } else {
          console.error("获取低艳色详细信息失败:", res.message);
          uni.showToast({
            title: "获取颜色信息失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取低艳色详细信息异常:", error);
        uni.showToast({
          title: "请求失败",
          icon: "none",
        });
      }
    },

    handleLowChromaToggle(isLowChroma) {
      if (isLowChroma) {
        // 切换到低艳色时，显示色盘和详情组件
        this.colorStore.showPickerAndLowChroma();
        // 获取低艳色数据
        this.handleLowChromaCenterSelected(this.centerColors[1] || this.centerColors[0]);
      } else {
        // 切换回主色盘时，显示list组件和色盘
        this.colorStore.showPickerAndList();
      }
    },

    async handleColorSelect(color) {
      try {
        // 保存当前视图状态和色盘角度
        this.previousView = this.colorStore.currentView;
        
        // 保存不同模式的角度
        if (this.$refs.colorPicker) {
          const currentAngle = this.$refs.colorPicker.getAngle();
          if (this.colorStore.currentView === 'picker-low-chroma') {
            this.previousLowChromaAngle = currentAngle;
          } else {
            this.previousHighChromaAngle = currentAngle;
          }
        }
        
        // 点击颜色列表中的颜色时，获取详细信息并显示detail组件
        console.log("点击了颜色:", color);
        const res = await getColorDetail(color);
        if (res.status === "success") {
          this.selectedColorDetails = res.data;
          this.selectedColorTitle = color.label
            ? `${color.label}色系`
            : "颜色详情";
          this.colorStore.showPickerAndDetail(color);
        } else {
          console.error("获取颜色详细信息失败:", res.message);
          uni.showToast({
            title: "获取颜色信息失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取颜色详细信息异常:", error);
        uni.showToast({
          title: "请求失败",
          icon: "none",
        });
      }
    },

    // 处理返回事件
    handleGoBack() {
      // 恢复进入详情页前的视图状态
      if (this.previousView === 'picker-low-chroma') {
        this.colorStore.showPickerAndLowChroma();
      } else {
        // 默认返回到主色盘和列表视图
        this.colorStore.showPickerAndList();
      }
      
      // 恢复进入详情页前的色盘角度
      this.$nextTick(() => {
        // 通过 refs 调用子组件方法设置角度
        if (this.$refs.colorPicker) {
          if (this.previousView === 'picker-low-chroma') {
            this.$refs.colorPicker.setAngle(this.previousLowChromaAngle);
          } else {
            this.$refs.colorPicker.setAngle(this.previousHighChromaAngle);
          }
        }
      });
    },

    // 处理弹窗确认事件
    handleSpectrumConfirmed() {
      this.showSpectrumModal = false;
      // 保存当前日期到本地存储
      uni.setStorageSync("lastSpectrumModalDate", new Date().toDateString());
      // 检查并显示引导弹窗
      this.checkAndShowGuideModal();
    },

    // 检查并决定是否显示弹窗
    checkAndShowSpectrumModal() {
      const lastShownDate = uni.getStorageSync("lastSpectrumModalDate");
      const today = new Date().toDateString();

      // 如果今天没有显示过弹窗，则显示
      if (lastShownDate !== today) {
        this.showSpectrumModal = true;
      } else {
        this.showSpectrumModal = false;
        // 如果不需要显示总谱说明弹窗，则检查是否需要显示引导弹窗
        this.checkAndShowGuideModal();
      }
    },

    // 检查并决定是否显示引导弹窗
    checkAndShowGuideModal() {
      const lastGuideDate = uni.getStorageSync("lastGuideModalDate");
      const today = new Date().toDateString();

      // 如果今天没有显示过引导弹窗，则显示
      if (lastGuideDate !== today) {
        this.showGuideModal = true;
        this.showFirstGuide = true;
        this.showSecondGuide = false; // 确保第二步引导初始为false
        this.canvasDrawFinished = false; // 重置Canvas绘制状态
      }
    },

    // 处理第一个引导弹窗的下一步
    handleFirstGuideNext() {
      this.showFirstGuide = false;
      this.showSecondGuide = true;
    },

    // 处理引导完成事件
    handleGuideLearned() {
      this.showGuideModal = false;
      this.showFirstGuide = false;
      this.showSecondGuide = false;
      // 保存引导弹窗显示日期到本地存储
      uni.setStorageSync("lastGuideModalDate", new Date().toDateString());
    },

    // 处理Canvas绘制完成事件
    handleDrawFinish() {
      this.canvasDrawFinished = true;
    },

    // 处理中心颜色更新
    handleCenterColorsUpdate(colors) {
      this.centerColors = colors;
    },
    
    // 处理色盘角度更新
    handleAngleUpdate(angle) {
      // 不再需要这个方法来保存角度，因为picker内部已经分别保存了两种模式的角度
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f1e9d8;
}

.content {
  padding: 0 20rpx 0 20rpx;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.list-wrapper,
.detail-wrapper {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.picker-wrapper {
  flex-shrink: 0;
}

.tip {
  display: flex;
  align-items: center;
  justify-items: center;
  flex-direction: row;
  height: 60rpx;
  width: 75%;
}

.icon {
  width: 30rpx;
  height: 30rpx;
  margin-right: 20rpx;
}

.description {
  font-size: 18rpx;
  color: #5a4a32;
}

/* 模糊背景效果 */
.blur-background {
  filter: blur(3px);
  pointer-events: none;
}
</style>