<template>
  <view v-if="visible" class="backtop-container" @click="scrollToTop">
    <view class="backtop-button">
      <image class="backtop-icon" src="/static/arrow-right.png" mode="aspectFit"></image>
    </view>
  </view>
</template>

<script>
export default {
  name: "Backtop",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    scrollToTop() {
      // 滚动到顶部
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  }
};
</script>

<style scoped>
.backtop-container {
  position: fixed;
  right: 30rpx;
  bottom: 120rpx;
  z-index: 999;
}

.backtop-button {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: rgba(159, 119, 53, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
  transform: rotate(-90deg);
}

.backtop-icon {
  width: 40rpx;
  height: 40rpx;
}
</style>