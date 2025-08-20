<template>
	<view>
		<!-- 自定义 tabBar 容器 -->
		<view class="custom-tab-bar">
			<!-- 循环渲染 tab 项 -->
			<view 
				class="tab-item" 
				v-for="(item, index) in tabList" 
				:key="index"
				@click="switchTab(item)"
			>
				<!-- 图标 -->
				<image 
				class="tab-icon" 
				:src="currentPath === item.pagePath ? item.selectedIconPath : item.iconPath"
				></image>
				<!-- 文字 -->
				<text 
				class="tab-text" 
				:style="currentPath === item.pagePath ? {color: selectedColor} : {color: color}"
				>
				{{ item.text }}
				</text>
			</view>
		</view>
		<!-- 抵消底部导航栏的高度 -->
		<view class="tab"></view>
	</view>
</template>

<script>
	export default {
	  data() {
	    return {
	      // 当前页面路径（用于判断选中状态）
	      currentPath: '',
	      // tabBar 基础配置（可抽离到 index.js 中）
	      tabList: [
	        {
	          pagePath: '/pages/index/index',
	          text: '首页',
	          iconPath: '/static/tabs/home.png',
	          selectedIconPath: '/static/tabs/home-active.png'
	        },
	        {
	          pagePath: '/pages/showcase/showcase',
	          text: '展示',
	          iconPath: '/static/tabs/showcase.png',
	          selectedIconPath: '/static/tabs/showcase-active.png'
	        },
	        {
	          pagePath: '/pages/search/search',
	          text: '检索',
	          iconPath: '/static/tabs/search.png',
	          selectedIconPath: '/static/tabs/search-active.png'
	        },
	        {
	          pagePath: '/pages/user/user',
	          text: '我的',
	          iconPath: '/static/tabs/user.png',
	          selectedIconPath: '/static/tabs/user-active.png'
	        }
	      ],
	      // 颜色配置（与原生 tabBar 保持一致）
	      color: '#999',
	      selectedColor: '#007AFF'
	    }
	  },
	  onShow() {
	    // 获取当前页面路径，初始化选中状态
	    const pages = getCurrentPages()
	    this.currentPath = pages[pages.length - 1].route // 例如："pages/collection/collection"
	  },
	  methods: {
	    // 切换 tab 页面
	    switchTab(item) {
	      // 跳转到 tabBar 页面（使用 switchTab）
	      uni.switchTab({
	        url: item.pagePath
	      })
	    }
	  },
	}
</script>

<style>
	/* 底部 tabBar 容器 */
	.custom-tab-bar {
	  display: flex;
	  justify-content: space-around;
	  align-items: center;
	  width: 100%;
	  height: 50px; /* 与原生 tabBar 高度一致 */
	  background-color: #fff;
	  border-top: 1px solid #eee; /* 顶部边框分隔 */
	  position: fixed; /* 固定在底部 */
	  bottom: 0;
	  left: 0;
	  z-index: 999; /* 确保在页面内容上方 */
	}
	
	/* 单个 tab 项 */
	.tab-item {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  flex: 1; /* 平均分配宽度 */
	}
	
	/* 图标样式 */
	.tab-icon {
	  width: 24px;
	  height: 24px;
	  margin-bottom: 2px;
	}
	
	/* 文字样式 */
	.tab-text {
	  font-size: 12px;
	}
	.tab{
		height: 125rpx;
		width: 100%;
	}
</style>