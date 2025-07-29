<template>
  <view class="popup-mask" v-if="show" @tap="closePopup">
    <view class="popup-container" @tap.stop>
      <!-- 主要内容 -->
      <view class="popup-content">
        <image class="logo" src="../../static/logo.png" mode="aspectFit" />
        <view class="main-title">东方色彩</view>
        <view class="program-slogan">程序sLogan</view>

        <!-- 立即体验按钮 -->
        <button class="experience-btn" @tap="handleExperience">立即体验</button>
      </view>

      <!-- 关闭按钮 -->
      <view class="close-btn" @tap="closePopup">×</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    handleExperience() {
      this.$emit("experience");
    },
  },
};
</script>

<style scoped>
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-container {
  width: 400rpx;
  height: 800rpx;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  position: relative;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx; 
}

.logo {
  width: 300rpx;
  height: 300rpx;
  border-radius: 20rpx;
  margin-bottom: 60rpx;
}

.main-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx; 
  letter-spacing: 4rpx; 
}

.sub-title {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 30rpx;
}

.program-slogan {
  font-size: 28rpx;
  color: #888;
  margin-bottom: 60rpx;
  letter-spacing: 4rpx; 
}

.experience-btn {
  width: 244rpx; 
  height: 90rpx; 
  line-height: 90rpx;
  background: #3c3c43;
  color: white;
  border-radius: 40rpx;
  font-size: 30rpx; 
  margin: 30rpx 0;
}

.experience-btn::after {
  border: none;
}

.intro-section {
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-top: 30rpx;
}

.intro-item {
  text-align: center;
}

.intro-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.intro-desc {
  font-size: 24rpx;
  color: #666;
}

.close-btn {
  position: absolute;
  top: calc(100% + 20rpx);
  right: 50%;
  transform: translateX(50%);
  font-size: 50rpx;
  color: #999;
  width: 76rpx;
  height: 76rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
}

.close-btn:active {
  background-color: #f5f5f5;
}
</style>