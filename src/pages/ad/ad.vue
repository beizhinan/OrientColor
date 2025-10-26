<template>
  <view class="ad-container">
    <!-- 加载状态显示 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">精彩即将呈现...</text>
    </view>
    
    <!-- 广告图片 -->
    <image
      class="ad-poster"
      :src="adImageUrl"
      :style="imageStyle"
      mode="aspectFill"
      @click="goToHome"
      @load="onImageLoad"
      @error="onImageError"
    ></image>

    <view class="countdown" @click="goToHome">
      {{ countdown }}s 跳过
    </view>
  </view>
</template>

<script>
import { getAdPhoto } from '@/api/ad.js';

export default {
  data() {
    return {
      windowHeight: 0,
      countdown: 6,
      countdownTimer: null,
      adImageUrl: '/static/ad/ad-poster.jpg', // 默认图片
      loading: true, // 添加加载状态
      loadingStartTime: 0 // 记录加载开始时间
    };
  },
  computed: {
    imageStyle() {
      return {
        width: '100vw',
        height: `${this.windowHeight}px`
      };
    }
  },
  mounted() {
    // 获取窗口高度
    const res = uni.getSystemInfoSync();
    this.windowHeight = res.windowHeight;
    
    // 记录加载开始时间
    this.loadingStartTime = Date.now();
    
    // 获取广告图片
    this.fetchAdImage();
    
    // 开始倒计时
    this.startCountdown();
  },
  methods: {
    async fetchAdImage() {
      try {
        this.loading = true;
        const res = await getAdPhoto();
        if (res && res.status === 'success' && res.url) {
          this.adImageUrl = res.url;
        } else {
          console.warn('获取广告图片失败:', res.message || '未知错误');
        }
      } catch (error) {
        console.error('获取广告图片异常:', error);
      } finally {
        // 注意：这里不设置loading为false，而是等图片加载完成再设置
        // 如果图片加载失败，会在onImageError中处理
      }
    },
    
    // 图片加载完成事件
    onImageLoad() {
      // 确保加载状态至少显示1秒
      const elapsed = Date.now() - this.loadingStartTime;
      const minLoadingTime = 1000; // 最小加载时间1秒
      
      if (elapsed >= minLoadingTime) {
        // 如果已经超过了最小加载时间，直接隐藏加载状态
        this.loading = false;
      } else {
        // 如果还没到最小加载时间，延时隐藏加载状态
        const remainingTime = minLoadingTime - elapsed;
        setTimeout(() => {
          this.loading = false;
        }, remainingTime);
      }
    },
    
    // 图片加载失败事件
    onImageError() {
      // 确保加载状态至少显示1秒
      const elapsed = Date.now() - this.loadingStartTime;
      const minLoadingTime = 1000; // 最小加载时间1秒
      
      if (elapsed >= minLoadingTime) {
        // 如果已经超过了最小加载时间，直接隐藏加载状态
        this.loading = false;
      } else {
        // 如果还没到最小加载时间，延时隐藏加载状态
        const remainingTime = minLoadingTime - elapsed;
        setTimeout(() => {
          this.loading = false;
        }, remainingTime);
      }
      console.warn('广告图片加载失败，使用默认图片');
    },
    
    startCountdown() {
      this.countdownTimer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.goToHome();
        }
      }, 1000);
    },
    
    goToHome() {
      // 清除倒计时定时器
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
      
      uni.switchTab({
        url: "/pages/index/index"
      });
    }
  },
  
  beforeDestroy() {
    // 组件销毁前清除定时器
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }
};
</script>

<style scoped>
.ad-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
}

.ad-poster {
  display: block;
  z-index: 1;
}

.countdown {
  position: fixed;
  top: 60rpx;
  right: 40rpx;
  padding: 10rpx 15rpx;
  border-radius: 30rpx;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000;
  z-index: 1000;
}

.loading-spinner {
  width: 50rpx;
  height: 50rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 30rpx;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #fff;
  font-size: 28rpx;
}

.experience-btn {
  position: fixed;
  right: 50rpx;
  bottom: 120rpx;
  z-index: 10;
  width: 200rpx;
}

.experience-btn image {
  width: 100%;
  height: auto;
}
</style>