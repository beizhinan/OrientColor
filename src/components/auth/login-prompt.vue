<template>
  <view class="login-prompt" v-if="show" @touchmove.stop.prevent>
    <view class="content">
      <!-- 关闭按钮优化 -->
      <view class="close-btn" @click.stop="handleReturn">
        <text class="close-icon">✕</text>
      </view>

      <view class="message-container">
        <image class="icon" :src="iconSrc" mode="widthFix"></image>
        <view class="message">
          <text class="title">您当前尚未登录！</text>
          <text class="description">登录后可收藏色卡、色谱</text>
        </view>
      </view>
      <view class="buttons">
        <button class="btn-return" @click.stop="handleReturn">返回</button>
        <button class="btn-login" @click="handleLogin">登录</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      iconSrc: "/static/icons/warning.png",
    };
  },
  methods: {
    showPrompt() {
      this.show = true;
    },
    hidePrompt() {
      this.show = false;
    },
    handleReturn() {
      console.log("隐藏登录弹窗前，show 的值为:", this.show);
      this.hidePrompt();
      console.log("隐藏登录弹窗后，show 的值为:", this.show);
      // 阻止事件冒泡
    },
    handleLogin() {
      this.hidePrompt();
      uni.navigateTo({
        url: "/pages/login/login",
      });
    },
  },
};
</script>

<style scoped>
.login-prompt {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.content {
  background-color: white;
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  width: 80%;
  max-width: 600rpx;
  position: relative;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.3s ease-out;
}

.close-btn {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.2s;
  background-color: #e0e0e0;
}

.close-btn:active {
  background-color: #f5f5f5;
}

.close-icon {
  font-size: 24rpx;
  color: #333;
  font-weight: lighter;
}

.message-container {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  margin-top: 20rpx;
}

.icon {
  width: 90rpx;
  height: 90rpx;
  margin-right: 24rpx;
}

.message {
  flex: 1;
}

.title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 4rpx;
  margin-bottom: 12rpx;
  color: #333;
}

.description {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.btn-return,
.btn-login {
  height: 70rpx;
  width: 180rpx;
  line-height: 70rpx;
  border-radius: 48rpx;
  font-size: 30rpx;
  transition: all 0.2s;
}

.btn-return {
  border: 1rpx solid #333;
  background-color: white;
  margin-right: 40rpx;
  color: #666;
}

.btn-return:active {
  background-color: #f7f7f7;
  transform: scale(0.98);
}

.btn-login {
  background-color: #3c3c43;
  color: white;
  border: none;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>