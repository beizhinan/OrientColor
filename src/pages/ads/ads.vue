<template>
  <view class="splash-container">
    <!-- 海报区域 -->
    <view class="poster-area">
      <image :src="splashImage" mode="aspectFill" class="poster-image"></image>
    </view>
    
    <!-- 文字区域 -->
    <view class="text-area">
      <text class="title">应用标题</text>
      <text class="subtitle">这里是应用描述文字</text>
      <view class="skip-btn" @click.stop="navigateToHome">
        跳过 {{ countdown }}s
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      splashImage: "/static/splash.jpg", // 广告图路径
      countdown: 5,
      timer: null,
    };
  },
  mounted() {
    this.startCountdown();
  },
  methods: {
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown <= 1) {
          this.navigateToHome();
        } else {
          this.countdown--;
        }
      }, 1000);
    },
    navigateToHome() {
      clearInterval(this.timer);
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.splash-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.poster-area {
  flex: 4; /* 占3份高度 */
  overflow: hidden;
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-area {
  flex: 1; /* 占2份高度 */
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.skip-btn {
  background: #1890ff;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
}
</style>