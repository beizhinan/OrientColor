<!-- src/components/search/color-search/color-search.vue -->
<template>
  <view class="page-container">
    <!-- 色彩总谱说明弹窗 -->
    <color-spectrum-modal
      v-if="showSpectrumModal"
      @confirmed="handleSpectrumConfirmed"
    ></color-spectrum-modal>

    <!-- 引导弹窗 -->
    <guide-modal
      v-if="showGuideModal"
      :show="showFirstGuide"
      @next="handleFirstGuideNext"
      @learned="handleGuideLearned"
    ></guide-modal>

    <!-- 页面内容（只有在弹窗关闭后才显示） -->
    <view v-if="!showSpectrumModal">
      <view class="content">
        <view class="tip" v-if="colorStore.currentView === 'picker-list'">
          <image
            class="icon"
            src="/static/color-picker.png"
            mode="aspectFit"
          ></image>
          <text class="description">
            您可通过在取色器上选取颜色，获取相应的色彩和名称
          </text>
        </view>
      </view>

      <!-- 根据状态显示不同组件 -->
      <view
        class="list-wrapper"
        v-if="colorStore.currentView === 'picker-list'"
        :class="{ 'blur-background': showFirstGuide || showSecondGuide }"
      >
        <color-list @color-selected="handleColorSelect"></color-list>
      </view>

      <view
        class="detail-wrapper"
        v-else-if="colorStore.currentView === 'picker-detail'"
      >
        <color-detail></color-detail>
      </view>

      <!-- 只在需要显示色盘时才显示 -->
      <view
        class="picker-wrapper"
        v-if="colorStore.currentView === 'picker-list'"
        :class="{ 'blur-background': showSecondGuide }"
      >
        <color-picker @low-chroma-toggle="handleLowChromaToggle"></color-picker>
      </view>
    </view>
  </view>
</template>

<script>
import { useColorStore } from "@/stores/colorStore";
import ColorPicker from "@/components/search/color-search/picker-circle.vue";
import ColorList from "@/components/search/color-search/color-list.vue";
import ColorDetail from "@/components/search/color-search/color-detail.vue";
import ColorSpectrumModal from "@/components/search/color-search/color-spectrum-modal.vue";
import GuideModal from "@/components/search/color-search/guide-modal.vue";

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
    },

    handleLowChromaToggle(isLowChroma) {
      if (isLowChroma) {
        // 切换到低艳色时，显示detail组件，但仍保留色盘和列表
        this.colorStore.showPickerAndDetail();
      } else {
        // 切换回主色盘时，显示list组件和色盘
        this.colorStore.showPickerAndList();
      }
    },

    handleColorSelect(color) {
      // 点击颜色列表中的颜色时，只显示detail组件，隐藏色盘和列表
      this.colorStore.showPickerAndDetail(color);
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
  },
};
</script>

<style>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  padding: 0 20rpx 0 20rpx;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.list-wrapper,
.detail-wrapper {
  flex: 1;
  overflow-y: auto;
}

.picker-wrapper {
  padding: 20rpx;
  background-color: #fff;
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
  flex: 1;
}

/* 模糊背景效果 */
.blur-background {
  filter: blur(3px);
  pointer-events: none;
}
</style>