<template>
  <view class="premium-container">
    <view class="premium-card">
      <!-- 灰色椭圆背景 -->
      <view class="overlay-ellipse"></view>

      <!-- 卡片内容 -->
      <view class="card-content">
        <view class="premium-label">Premium</view>
        <view class="main-title">东方色彩</view>
        <view class="description" @tap="handleViewDetails">
          点击查看具体介绍→
        </view>
      </view>
      <button class="view-btn" @tap="handleViewDetails">查看介绍</button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    handleViewDetails() {
      this.$emit("viewDetails");
    },
  },
};
</script>

<style scoped>
.premium-container {
  position: relative;
  height: 250rpx; /* 确保容器有足够高度 */
  margin-bottom: 15rpx;
}

.premium-card {
  width: 600rpx;
  height: 250rpx;
  background: #ffffff;
  border-radius: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx;
  margin: 0 auto;
  position: relative;
  overflow: hidden; /* 隐藏椭圆溢出部分 */
  z-index: 1;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  border: 2rpx solid #f0f0f0;
}

.overlay-ellipse {
  position: absolute;
  width: 725rpx;
  height: 275rpx;
  background: #f5f5f5; /* 灰色背景 */
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0; /* 置于卡片内容下方 */
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2; /* 确保内容在椭圆上方 */
  position: relative;
}

.premium-label {
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 8rpx;
}

.main-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 12rpx;
}

.description {
  font-size: 24rpx;
  color: #666666;
  letter-spacing: 2rpx;
}

.description:active {
  color: #1e8fff;
}

.view-btn {
  width: 180rpx;
  height: 64rpx;
  line-height: 64rpx;
  background: #1e8fff;
  border-radius: 16rpx;
  color: #ffffff;
  font-size: 24rpx;
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 2; /* 确保按钮在椭圆上方 */
}

.view-btn::after {
  border: none;
}
</style>