<template>
  <view class="color-card" @click="handleCardClick">
    <view class="card-header">
      <image class="header-image" :src="headerImage" mode="widthFix" />
      <view class="header-tag" v-if="headerText">
        <text class="header-text">{{ headerText }}</text>
      </view>
    </view>
    <view class="card-content">
      <text class="content-title">{{ title }}</text>
      <text class="content-desc">{{ description }}</text>
    </view>
    <login-prompt ref="loginPrompt"></login-prompt>
  </view>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import loginPrompt from "@/components/auth/login-prompt.vue";

export default {
  components: {
    loginPrompt,
  },
  props: {
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
  methods: {
    async handleCardClick() {
      console.log("卡片点击事件触发");
      const authStore = useAuthStore();
      const isLoggedIn = await authStore.checkLogin();

      if (isLoggedIn) {
        this.performAction();
      } else {
        console.log("显示登录弹窗");
        this.$refs.loginPrompt.showPrompt();
      }
    },

    performAction() {
      console.log("执行色谱卡片点击后的操作");
      uni.showToast({
        title: "卡片点击成功",
        icon: "success",
      });
    },
  },
};
</script>

<style scoped>
/* 保持原有样式 */
</style>

<style scoped>
.color-card {
  width: 320rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
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
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.content-desc {
  display: block;
  font-size: 24rpx;
  color: #666;
}
</style>