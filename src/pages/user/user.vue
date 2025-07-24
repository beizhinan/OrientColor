<template>
  <view class="user-container">
    <!-- 用户信息区域 -->
    <view class="user-info" @click="handleUserClick">
      <image
        class="avatar"
        :src="authStore.avatarUrl"
        mode="aspectFill"
      ></image>
      <view class="info">
        <text class="nickname">{{ authStore.nickName }}</text>
        <text class="login-status">{{
          authStore.isLogin ? "已登录" : "未登录"
        }}</text>
      </view>
    </view>

    <!-- 登录/退出按钮 -->
    <button
      v-if="!authStore.isLogin"
      class="login-btn"
      type="primary"
      @click="handleGetUserProfile"
      open-type="getUserProfile"
    >
      微信登录
    </button>
    <button v-else class="logout-btn" type="warn" @click="handleLogout">
      退出登录
    </button>

    <!-- 其他功能区域 -->
    <view class="menu-list">
      <view
        class="menu-item"
        v-for="item in menuList"
        :key="item.id"
        @click="navigateTo(item.path)"
      >
        <text class="iconfont" :class="item.icon"></text>
        <text class="title">{{ item.title }}</text>
        <text class="arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { onShow } from "@dcloudio/uni-app";

const authStore = useAuthStore();

const menuList = ref([
  { id: 1, title: "功能1", icon: "icon-order", path: "/pages/order/list" },
  { id: 2, title: "功能2", icon: "icon-address", path: "/pages/address/list" },
  { id: 3, title: "功能3", icon: "icon-about", path: "/pages/about/index" },
]);

// 页面显示时检查登录状态
onShow(() => {
  authStore.checkLogin();
});

// 登录处理
const handleLogin = async () => {
  try {
    uni.showLoading({ title: "登录中..." });
    // 只获取code，不获取用户信息
    const code = await authStore.wxLogin();
    uni.hideLoading();
    // 等待用户授权后继续登录流程
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: "获取登录凭证失败", icon: "none" });
    console.error("登录失败:", error);
  }
};

// 处理用户授权信息
const handleGetUserProfile = async () => {
  try {
    uni.showLoading({ title: "登录中..." });
    // 获取用户信息（必须由用户点击触发）
    const userInfoRes = await new Promise((resolve, reject) => {
      uni.getUserProfile({
        desc: "获取用户信息用于登录",
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });

    // 完成登录流程
    await authStore.completeLogin(userInfoRes);
    uni.hideLoading();
    uni.showToast({ title: "登录成功", icon: "success" });
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: "登录失败", icon: "none" });
    console.error("登录失败:", error);
  }
};

// 退出处理
const handleLogout = () => {
  uni.showModal({
    title: "提示",
    content: "确定要退出登录吗？",
    success: (res) => {
      if (res.confirm) {
        authStore.clearAuth();
        uni.showToast({ title: "已退出登录", icon: "success" });
      }
    },
  });
};

// 用户信息点击处理
const handleUserClick = () => {
  if (!authStore.isLogin) {
    handleLogin();
  }
};

// 导航到其他页面
const navigateTo = (path) => {
  if (!authStore.isLogin) {
    uni.showModal({
      title: "提示",
      content: "请先登录",
      success: (res) => {
        if (res.confirm) {
          handleLogin();
        }
      },
    });
    return;
  }
  uni.navigateTo({ url: path });
};
</script>

<style scoped>
.user-container {
  padding: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 30rpx;
}

.info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.login-status {
  font-size: 24rpx;
  color: #999;
}

.login-btn,
.logout-btn {
  margin: 30rpx 0;
}

.menu-list {
  background-color: #fff;
  border-radius: 16rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.iconfont {
  margin-right: 20rpx;
  color: #007aff;
  font-size: 36rpx;
}

.title {
  flex: 1;
  font-size: 32rpx;
}

.arrow {
  color: #999;
}
</style>