<template>
  <view class="container">
    <view>
      <image src="/static/logo.png" mode="" class="logo"></image>
    </view>
    <!-- 标题 -->
    <view class="title">东方色彩</view>

    <!-- 权限申请信息 -->
    <view class="permission-info">
      <view class="permission-title">申请获得以下权限</view>
      <view class="permission-desc">获得你的公开信息（昵称、头像等）</view>
    </view>

    <!-- 协议勾选 -->
    <view class="agreement">
      <view class="custom-checkbox" @tap="toggleAgreement">
        <view class="checkbox-icon" :class="{ checked: agreed }">
          <view class="checkmark" v-if="agreed"></view>
        </view>
        <text class="agreement-text">同意</text>
        <text class="protocol">《用户服务协议》</text>
        <text class="agreement-text">及</text>
        <text class="protocol">《隐私政策》</text>
      </view>
    </view>

    <!-- 按钮区域 -->
    <view class="button-group">
      <button
        class="auth-btn"
        :class="{ disabled: !agreed }"
        @click="handleAuthLogin"
      >
        授权登录
      </button>
      <button class="cancel-btn" @click="handleCancelAuth">取消授权</button>
      <view class="skip-login" @tap="handleSkipLogin">
        暂不登录 <image class="ques" src="/static/ques.png"></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      agreed: false,
    };
  },
  methods: {
    // 切换协议勾选状态
    toggleAgreement() {
      this.agreed = !this.agreed;
    },

    // 授权登录处理
    handleAuthLogin() {
      if (!this.agreed) {
        uni.showToast({
          title: "请先同意用户协议",
          icon: "none",
        });
        return;
      }
      // 授权登录逻辑
      uni.showToast({
        title: "授权登录成功",
        icon: "success",
      });
    },

    // 取消授权
    handleCancelAuth() {
      uni.navigateBack();
    },

    // 暂不登录
    handleSkipLogin() {
      uni.switchTab({
        url: "/pages/user/user",
      });
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 40rpx;
}

.logo {
  width: 250rpx;
  height: 250rpx;
  margin-top: 50rpx;
  border-radius: 50%;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-top: 20rpx;
  margin-bottom: 80rpx;
}

.permission-info {
  width: 100%;
  margin-bottom: 60rpx;
}

.permission-title {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.permission-desc {
  font-size: 26rpx;
  color: #ccc;
}

.agreement {
  width: 100%;
  display: flex;
  margin-top: 120rpx;
  margin-bottom: 30rpx;
}

.custom-checkbox {
  display: flex;
  align-items: center;
}

.checkbox-icon {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #ccc;
  border-radius: 4rpx;
  margin-right: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox-icon.checked {
  border-color: #07c160;
  background-color: #07c160;
}

.checkmark {
  width: 16rpx;
  height: 10rpx;
  border-left: 3rpx solid white;
  border-bottom: 3rpx solid white;
  transform: rotate(-45deg);
  margin-top: -4rpx;
}

.agreement-text {
  font-size: 24rpx;
  color: #666;
}

.protocol {
  font-size: 24rpx;
  font-weight: bold;
  color: #9f7735;
}

.button-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-btn {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  background-color: #fdf1e8;
  color: #9f7735;
  border-radius: 20rpx;
  font-size: 32rpx;
  margin-bottom: 30rpx;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
  position: relative;
}

.auth-btn::after {
  display: none !important;
}

.auth-btn.disabled {
  background-color: #cccccc;
  color: #999999;
}

.cancel-btn {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  background-color: white;
  color: #9f7735;
  border: 3rpx solid #e6e6e6;
  border-radius: 20rpx;
  font-size: 32rpx;
  margin-bottom: 30rpx;
}

.skip-login {
  font-size: 28rpx;
  color: #999;
  text-decoration: underline;
}

.ques {
  width: 24rpx;
  height: 24rpx;
  margin-left: 10rpx;
}
</style>