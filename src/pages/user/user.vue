<template>
  <view class="user-container">
    <!-- 用户信息区域 -->
    <view class="user-info" @click="handleUserClick">
      <image
        class="avatar"
        :src="authStore.isLogin ? authStore.avatarUrl : defaultAvatar"
        mode="aspectFill"
      ></image>
      <view class="info">
        <text class="nickname">{{
          authStore.isLogin ? authStore.nickName : "请点击登录"
        }}</text>
      </view>
    </view>

    <!-- 其他功能区域 -->
    <view class="menu-list">
      <view
        class="menu-item"
        v-for="item in menuList"
        :key="item.id"
        @click="navigateTo(item.path)"
      >
        <text class="title">{{ item.title }}</text>
        <!-- 使用本地图标替换uni-icons -->
        <image
          class="arrow-icon"
          src="/static/arrow-right.png"
          mode="aspectFit"
        ></image>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { onShow } from "@dcloudio/uni-app";

const authStore = useAuthStore();

// 默认头像
const defaultAvatar = "../../static/default-avatar.png";

const menuList = ref([
  { id: 1, title: "我的收藏", icon: "icon-order", path: "/pages/order/list" },
  {
    id: 2,
    title: "我的客服",
    icon: "icon-address",
    path: "/pages/address/list",
  },
]);

// 页面显示时检查登录状态
onShow(() => {
  authStore.checkLogin();
});

// 用户信息点击处理 - 跳转到登录页面
const handleUserClick = () => {
  if (!authStore.isLogin) {
    // 跳转到登录页面
    uni.navigateTo({ url: "/pages/login/login" });
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
          // 跳转到登录页面而不是直接登录
          uni.navigateTo({ url: "/pages/login/login" });
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

/* 新增本地图标样式 */
.arrow-icon {
  width: 32rpx;
  height: 32rpx;
}
</style>