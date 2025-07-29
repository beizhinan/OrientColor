<template>
  <view class="container">
    <!-- 标题 -->
    <view class="logo">
      <view class="logo-bg">
        <image src="/static/logo.png" class="logo-img"></image>
      </view>
    </view>
    <view class="title">东方色彩</view>

    <!-- 登录表单 -->
    <view class="login-form">
      <!-- 微信登录按钮 -->
      <button class="wechat-login-btn" @click="handleWechatLogin">
        一键登录
      </button>

      <!--手机号码登录/注册按钮-->
      <button class="phone-login-btn" @click="handlePhoneLogin">
        手机号登录/注册
      </button>

      <!-- 暂不登录链接 -->
      <view class="skip-login" @tap="handleSkipLogin">
        暂不登录
        <image src="/static/ques.png" class="question-icon"></image>
      </view>

      <!-- 协议勾选 -->
      <view class="agreement">
        <view class="custom-checkbox" @tap="toggleAgreement">
          <view class="checkbox-icon" :class="{ checked: agreed }">
            <view class="checkmark" v-if="agreed"></view>
          </view>
          <text class="agreement-text">我已阅读并同意</text>
        </view>
        <text class="protocol" @tap="handleViewProtocol">《用户协议》</text>
        <text>和</text>
        <text class="protocol" @tap="handleViewPrivacy">《用户隐私协议》</text>
      </view>
    </view>
  </view>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

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

    // 微信登录处理
    async handleWechatLogin() {
      // 检查用户是否同意协议
      if (!this.agreed) {
        uni.showToast({
          title: "请先同意用户协议",
          icon: "none",
        });
        return;
      }

      try {
        // 使用 auth store 完成登录
        const authStore = useAuthStore();
        const res = await authStore.completeLogin();

        if (res.code === 200) {
          uni.showToast({
            title: "登录成功",
            icon: "success",
          });

          // 跳转回上一级页面
          setTimeout(() => {
            uni.navigateBack({
              delta: 1,
            });
          }, 1000);
        } else {
          uni.showToast({
            title: "登录失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("登录失败:", error);
        if (error.errMsg && error.errMsg.includes("cancel")) {
          uni.showToast({
            title: "授权已取消",
            icon: "none",
          });
        } else {
          uni.showToast({
            title: "登录失败，请重试",
            icon: "none",
          });
        }
      }
    },

    // 手机号登录
    handlePhoneLogin() {
      // 实现手机号登录逻辑
    },

    // 暂不登录
    handleSkipLogin() {
      uni.switchTab({
        url: "/pages/user/user",
      });
    },

    // 查看用户协议
    handleViewProtocol() {
      // 实现查看用户协议逻辑
    },

    // 查看隐私协议
    handleViewPrivacy() {
      // 实现查看隐私协议逻辑
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
  margin-top: 60rpx;
  margin-bottom: 20rpx;
}

.logo-bg {
  width: 320rpx;
  height: 320rpx;
  border-radius: 50%;
  background-color: rgb(230, 230, 230);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.logo-img {
  width: 140rpx;
  height: 140rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 100rpx;
  letter-spacing: 4rpx;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120rpx;
}

.wechat-login-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #dedefa;
  color: #6155f5;
  border-radius: 20rpx;
  font-size: 26rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wechat-login-btn::after {
  border: none;
}

.phone-login-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: white;
  color: #6155f5;
  border-radius: 20rpx;
  font-size: 26rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.phone-login-btn::after {
  border: none;
}

.skip-login {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: underline;
}

.question-icon {
  width: 28rpx;
  height: 28rpx;
  margin-left: 10rpx;
}

.agreement {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 22rpx;
  color: #666;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  margin-right: 8rpx;
}

.checkbox-icon {
  width: 20rpx;
  height: 20rpx;
  border: 2rpx solid #ccc;
  border-radius: 50%;
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
  width: 8rpx;
  height: 6rpx;
  border-left: 3rpx solid white;
  border-bottom: 3rpx solid white;
  transform: rotate(-45deg);
  margin-top: -4rpx;
}

.protocol {
  color: #6155f5;
  font-weight: bold;
}
</style>