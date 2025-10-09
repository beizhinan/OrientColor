<template>
  <view class="color-card" @click="handleCardClick">
    <view class="card-header">
      <!-- 添加加载状态 -->
      <view v-if="!imageLoaded" class="image-placeholder">
        <view class="loading-spinner"></view>
      </view>
      <image 
        class="header-image" 
        :src="headerImage" 
        mode="widthFix" 
        @load="onImageLoad"
        @error="onImageError"
        :class="{ 'image-loaded': imageLoaded }"
      />
      <view class="header-tag" v-if="headerText">
        <text class="header-text">{{ headerText }}</text>
      </view>
    </view>
    <view class="card-content">
      <text class="content-title">{{ title }}</text>
      <text class="content-desc">{{ description }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: null,
    },
    headerText: {
      type: String,
      default: null,
    },
    headerImage: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "开化寺",
    },
    description: {
      type: String,
      default: "介绍",
    },
  },
  data() {
    return {
      imageLoaded: false
    }
  },
  methods: {
    handleCardClick() {
      console.log("卡片点击事件触发");
      this.performAction();
    },

    performAction() {
      console.log("执行色谱卡片点击后的操作");
      console.log("当前ID：", this.id);
      console.log("当前标题：", this.title);
      // 跳转到色谱详情页，携带ID和标题
      uni.navigateTo({
        url: `/pages/display-package/chromatogarphy/chromatogarphy?id=${
          this.id
        }&title=${encodeURIComponent(this.title)}`,
      });
    },
    
    onImageLoad() {
      this.imageLoaded = true;
    },
    
    onImageError(e) {
      console.error("图片加载失败:", e);
      // 加载失败时也标记为已加载，避免一直显示加载状态
      this.imageLoaded = true;
    }
  },
};
</script>

<style scoped>
.color-card {
  width: 320rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  position: relative;
}

.card-header {
  position: relative;
  width: 100%;
}

.header-tag {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 75rpx;
  padding: 10rpx 20rpx;
  width: 50rpx;
  text-align: center;
  z-index: 1; /* 确保标签在图片上方 */
}

.header-image {
  width: 100%;
  height: auto;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.header-image.image-loaded {
  opacity: 1;
}

.image-placeholder {
  width: 100%;
  height: 240rpx; /* 设置一个默认高度 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 3rpx solid #ccc;
  border-radius: 50%;
  border-top-color: #999;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.header-text {
  color: white;
  font-size: 24rpx;
}

.card-content {
  padding: 20rpx;
  background-color: white;
}

.content-title {
  display: block;
  font-size: 24rpx;
  margin-top: 10rpx;
  margin-bottom: 10rpx;
}

.content-desc {
  display: block;
  font-size: 18rpx;
  color: #666;
}
</style>