<template>
	<!-- 背景 -->
  <view class="back"></view>
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
			<!-- 功能图标 -->
			<image
			class="arrow-icon"
			:src="item.iconfont"
			:style="{'margin-right':'30rpx'}"
			mode="aspectFit"
			></image>
			<text class="title">{{ item.title }}</text>
			<!-- 使用本地图标替换uni-icons -->
			<image
			class="arrow-icon"
			src="/static/user/arrow-right.png"
			mode="aspectFit"
			></image>
		</view>
    </view>
  </view>
	<!-- 底部文字 -->
	<view class="words">
		<!-- 使用图片替代文字 -->
		<image
		:style="{width:'215rpx',height:'50rpx'}"
		src="/static/user/buttomWords1.png"
		mode="aspectFit"
		></image>
		<image
		:style="{width:'135rpx',height:'30rpx'}"
		src="/static/user/buttomWords2.png"
		mode="aspectFit"
		></image>
	</view>
</template>

<script setup>
import { ref,watch } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { useCollectedStore } from "@/stores/collectionStore";
import { onShow } from "@dcloudio/uni-app";

const authStore = useAuthStore();
const collectionStore = useCollectedStore();

// 默认头像
const defaultAvatar = "../../static/default-avatar.png";

const menuList = ref([
  { 
	id: 1, 
	title: "我的收藏", 
	icon: "icon-order", 
	path: `/pages/collection/collection?user_id=${authStore.user_id}` ,
	iconfont:"/static/user/collections.png"
  },
  {
    id: 2,
    title: "我的客服",
    icon: "icon-address",
    path: "/pages/address/list",
	iconfont:"/static/user/service.png"
  },
]);

// 页面显示时检查登录状态
onShow(() => {
	//console.log('准备传递的user_id：', authStore.user_id)
	//console.log(authStore);
	//authStore.checkLogin();
	if(authStore.isLogin){
		collectionStore.user_id = authStore.user_id
	}
	//authStore.completeLogin()
});

watch(
  () => authStore.user_id,
  (newUserId) => {
    menuList.value[0].path = `/pages/collection/collection?user_id=${newUserId || ''}`
  }
)

// 用户信息点击处理 - 跳转到登录页面
const handleUserClick = () => {
  if (!authStore.isLogin) {
    // 跳转到登录页面
    uni.navigateTo({ url: "/pages/login/login" });
  }
};

// 导航到其他页面
const navigateTo = (path) => {
	console.log('最终跳转URL：', path)
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
.back{
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	background-color: #f1e9d8;
	z-index: -1;
}

.user-container {
  padding: 20rpx;
  background-color: #f1e9d8;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #f1e9d8;
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
  color:#5a3d2e;
}

.menu-list {
  background-color: #f1e9d8;
  border-radius: 16rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
 /* border-bottom: 4rpx solid #f5f5f5; */
  border-bottom: 4rpx solid #ebe4d6;
}

/* .menu-item:last-child {
  border-bottom: none;
} */

.iconfont {
  margin-right: 20rpx;
  color: #007aff;
  font-size: 36rpx;
}

.title {
  flex: 1;
  font-size: 32rpx;
  color:#5a3d2e;
}

/* 新增本地图标样式 */
.arrow-icon {
  width: 32rpx;
  height: 32rpx;
}

.words{
	position: fixed;
	bottom: 100rpx;
	left:50%;
	transform: translateX(-50%);
	width:215rpx;
	height:70rpx;
	text-align: center;
}
</style>