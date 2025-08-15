<!-- src/components/search/color-search/guide-modal.vue -->
<template>
  <view class="guide-modal-container" v-if="showModal">
    <view class="guide-modal-content">
      <view class="guide-text">
        <text>{{ text }}</text>
      </view>
      <view class="guide-button">
        <button class="next-button" @click="handleNext">下一步</button>
      </view>
    </view>
  </view>

  <!-- 第二个引导弹窗 -->
  <view class="guide-modal-container-2" v-if="showSecondModal">
    <view class="guide-modal-content-2">
      <view class="guide-text-2">
        <text>{{ secondText }}</text>
      </view>
      <view class="guide-button-2">
        <button class="learned-button" @click="handleLearned">学会了</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "GuideModal",
  props: {
    // 弹窗显示状态
    show: {
      type: Boolean,
      default: false,
    },
    // 显示的文本内容
    text: {
      type: String,
      default: "转动色彩圆盘或点击某个色系查看放大图像",
    },
    // 第二个弹窗的文本内容
    secondText: {
      type: String,
      default: "点击底部灰色小圆盘可查看低彩度色彩详情",
    },
  },
  data() {
    return {
      showModal: this.show,
      showSecondModal: false, // 控制第二个弹窗显示状态
    };
  },
  watch: {
    // 监听父组件传递的 show 属性变化
    show(newVal) {
      this.showModal = newVal;
    },
  },
  methods: {
    handleNext() {
      this.$emit("next");
      this.showModal = false;
      // 显示第二个引导弹窗
      this.showSecondModal = true;
    },

    handleLearned() {
      this.showSecondModal = false;
      this.$emit("learned"); // 发送事件通知父组件
    },
  },
};
</script>

<style scoped>
.guide-modal-container {
  position: fixed;
  bottom: 25%; /* 位于页面底部向上1/4的位置 */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 1000; /* 确保在其他元素之上 */
}

.guide-modal-content {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  width: 80%;
  max-width: 400rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  text-align: center;
}

.guide-text {
  margin-bottom: 30rpx;
  font-size: 28rpx;
  color: #333;
}

.guide-button {
  margin-top: 20rpx;
}

.next-button {
  background-color: #9f7735;
  color: #fff;
  border: none;
  padding: 12rpx 30rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
}

/* 第二个引导弹窗样式 */
.guide-modal-container-2 {
  position: fixed;
  bottom: 12.5%; /* 位于页面底部向上1/8的位置 */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 1001; /* 确保在第一个弹窗之上 */
}

.guide-modal-content-2 {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  width: 80%;
  max-width: 400rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  text-align: center;
}

.guide-text-2 {
  margin-bottom: 30rpx;
  font-size: 28rpx;
  color: #333;
}

.guide-button-2 {
  margin-top: 20rpx;
}

/* 学会了按钮样式 */
.learned-button {
  background-color: #5a4a32;
  color: #fff;
  border: none;
  padding: 12rpx 30rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
}
</style>