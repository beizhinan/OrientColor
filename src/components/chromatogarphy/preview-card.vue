<template>
  <view class="color-card" @click="$emit('click')">
    <view class="color-preview" :style="{ backgroundColor: colorCode }"></view>
    <view class="color-info">
      <text class="color-name">{{ colorName }}</text>
      <view class="code-row">
        <text class="color-code">{{ colorCode }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    colorName: {
      type: String,
      required: true,
    },
    colorCode: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.color-card {
  width: 200rpx;
  height: 280rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  background-color: #fff;
  cursor: pointer; /* 添加鼠标指针样式 */
}

.color-preview {
  height: 180rpx;
  width: 100%;
}

.color-info {
  padding: 16rpx;
  display: flex;
  flex-direction: column;
}

.color-name {
  font-size: 24rpx;
  font-weight: bold;
  color: #3c2a1d;
  margin-bottom: 6rpx;
}

.code-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-code {
  font-size: 18rpx;
  color: #3c2a1d;
}

.favorite-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 10rpx;
}
</style>