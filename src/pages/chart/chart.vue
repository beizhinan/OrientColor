<template>
	<view class="container">
		<!-- 色立体 -->
		<view class="color-cube">
			<view class="chart" v-if="ready">
				<l-echart ref="chartRef" @finished="init"></l-echart>
			</view>
		</view>

		<text class="tips-title">① 交互规则</text>
		<text class="tips">
			双指滑动可对模型进行缩放，点击某一色块可查看具体介绍
		</text>

		<!-- 色谱名称与介绍 -->
		<view class="info">
			<view class="collect-num">23人收藏</view>
			<text class="title">色谱名字</text>
			<text class="desc">色谱介绍一大段介绍很多介绍色谱介绍一大段介绍很多介绍色谱介绍一大段介绍很多介绍色谱介绍一大段介绍很多介绍色谱介绍一大段介绍很多介绍色谱介绍一大段介绍很多介绍</text>
			<button class="collect-btn" @click="showPopup = true">收藏色谱</button>
		</view>

		<!-- 收藏弹窗 -->
		<view class="popup" v-if="showPopup">
			<view class="popup-overlay" @tap="closePopup"></view>
			<view class="popup-content">
				<text class="popup-title">添加到收藏夹</text>
				<view class="folder-list">
					<view class="folder" :class="{ active: selectedIndex === index }" v-for="(item, index) in folders"
						:key="index" @tap="selectFolder(index)">
						<image class="icon" :src="item.icon" />
						<text class="folder-name">{{ item.name }}</text>
						<text class="folder-num">{{ item.count }}项</text>
					</view>
				</view>
				<button class="save-btn" @click="saveToFolder">保存</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, nextTick, onMounted } from 'vue'
	const echarts = require('../../uni_modules/lime-echart/static/echarts.min')

	const showPopup = ref(false)
	const selectedIndex = ref(null)
	const folders = ref([{
			name: '收藏夹1',
			count: 20,
			icon: '/static/showcase/filter-icon.png'
		},
		{
			name: '收藏夹2',
			count: 20,
			icon: '/static/showcase/filter-icon.png'
		},
		{
			name: '收藏夹3',
			count: 20,
			icon: '/static/showcase/filter-icon.png'
		},
		{
			name: '收藏夹1',
			count: 20,
			icon: '/static/showcase/filter-icon.png'
		},
		{
			name: '收藏夹2',
			count: 20,
			icon: '/static/showcase/filter-icon.png'
		},
		{
			name: '收藏夹3',
			count: 20,
			icon: '/static/showcase/filter-icon.png'
		},
	])

	//echart部分
	const chartRef = ref(null)
	const option = ref({
		xAxis: {},
		yAxis: {},
		zAxis: {},
		series: [{
			symbolSize: 10,
			type: 'scatter',
			data: [
				[10, 10,10],
				[20, 20,20],
				[30, 15,13],
				[40, 30,5]
			]
		}]
	})

	const init = async () => {
		if (!chartRef.value) return
		const myChart = await chartRef.value.init(echarts)
		myChart.setOption(option.value)
	}

	function closePopup() {
		showPopup.value = false
	}

	function selectFolder(index) {
		selectedIndex.value = index
	}

	function saveToFolder() {
		if (selectedIndex.value !== null) {
			uni.showToast({
				title: '收藏成功',
				icon: 'success'
			})
			showPopup.value = false
		} else {
			uni.showToast({
				title: '请选择收藏夹',
				icon: 'none'
			})
		}
	}

	const ready = ref(false)
	
	onMounted(() => {
	  nextTick(() => {
	    setTimeout(() => {
	      ready.value = true
	    }, 500)
	  })
	})
</script>

<style>
	.container {
		padding: 70rpx 60rpx 10rpx 60rpx;
	}

	.color-cube {
		width: 100%;
		height: 802rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 24rpx;
		border-radius: 32rpx;
		box-shadow: 4rpx 4rpx 42rpx rgba(0, 0, 0, 0.25);
	}

	.chart {
		height: 100%;
		width: 100%;
	}

	.tips-title {
		font-weight: 500;
		font-size: 20rpx;
	}

	.tips {
		font-size: 17.4rpx;
		color: #666;
		display: block;
		margin-top: 10rpx;
	}

	.info {
		margin-top: 60rpx;
		position: relative;
	}

	.collect-num {
		position: absolute;
		top: 14rpx;
		right: 0rpx;
		font-size: 24rpx;
		font-weight: bold;
		color: #666;
	}

	.title {
		font-weight: bold;
		font-size: 32rpx;
	}

	.desc {
		display: block;
		color: #666;
		font-size: 24rpx;
		margin-top: 20rpx;
	}

	.collect-btn {
		width: 33%;
		background-color: #f5f5f5;
		padding: 6rpx 20rpx;
		font-size: 26rpx;
		margin-top: 40rpx;
	}

	.popup {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		top: 0;
		z-index: 1000;
	}

	.popup-overlay {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(239, 239, 239, 0.5);
	}

	.popup-content {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fdf1e8;
		padding: 30rpx;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}

	.popup-title {
		font-size: 32rpx;
		margin-top: 10rpx;
	}

	.folder-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 20rpx;
		margin-top: 20rpx;
	}

	.folder {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 24%;
		padding: 20rpx;
		text-align: center;
		border-radius: 20rpx;
		border-color: #ffffff;
		background-color: #ffffff;
		border: 2rpx solid #ddd;
	}

	.folder.active {
		border-color: #007aff;
		background-color: #e0f0ff;
	}

	.icon {
		width: 80rpx;
		height: 80rpx;
	}

	.folder-name {
		font-size: 26rpx;
		color: #151515;
	}

	.folder-num {
		font-size: 26rpx;
		color: #666;
	}

	.save-btn {
		margin-top: 30rpx;
		width: 144rpx;
		background-color: #3b3b3b;
		font-size: 30rpx;
		color: #fff;
		border-radius: 200rpx;
	}
</style>