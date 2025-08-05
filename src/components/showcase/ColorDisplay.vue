<template>
	<view class="card" @click="goToDetail">
		<view class="tag">{{ dimension }}</view>
		<!-- 切换按钮 -->
		<view v-if="button1 && button2" class="change-button">
			<view :class="['button', selectedButton === 'button1' ? 'selected' : '']"
				@click.stop="selectButton('button1')">
				{{ button1 }}
			</view>
			<view :class="['button', selectedButton === 'button2' ? 'selected' : '']"
				@click.stop="selectButton('button2')">
				{{ button2 }}
			</view>
		</view>

		<!-- 图表 -->
		<view class="chart-cube">
			<view class="chart" v-if="dimension == '3D'">
			</view>
			<view class="chart" v-if="dimension != '3D'">
				<l-echart ref="chartRef" @finished="init"></l-echart>
			</view>
		</view>
		<view class="text-content">
			<view v-if="currentDisplay" class="title">{{ currentDisplay.text }}</view>
			<view class="desc">点击查看模型细节</view>
		</view>
	</view>
	<!-- 交互提示 -->
	<interaction-tip :dimension="props.dimension" :button="selectedButton"></interaction-tip>

</template>

<script setup>
	import {
		computed,
		ref,
		watch,
		onMounted
	} from 'vue'
	import InteractionTip from '@/components/showcase/InteractionTip.vue'
	const echarts = require('../../uni_modules/lime-echart/static/echarts.min')
	import * as THREE from 'three';
	import {
		adapter
	} from '@minisheep/three-platform-adapter';
	import '@minisheep/mini-program-polyfill-core/wechat-polyfill';
	import {
		wechat
	} from '@minisheep/three-platform-adapter/wechat';

	// 接收 props
	const props = defineProps({
		dimension: String,
		filterData: [Object, Array]
	})
	const selectedButton = ref('button1')
	const chartRef = ref(null)

	// 触发事件
	const emit = defineEmits(['button-change'])

	const display = [{
			dimension: '3D',
			text: '三维模型——色立体'
		},
		{
			dimension: '2D',
			text: '二维模型——色彩坐标',
			button1: '直角坐标',
			button2: '极坐标'
		},
		{
			dimension: '1D',
			text: '一维模型——色彩坐标',
			button1: '带状',
			button2: '环状'
		}
	]

	// 图表配置字典
	const optionMap = {
		'2D-button1': {
			xAxis: {},
			yAxis: {},
			series: [{
				symbolSize: 10,
				type: 'scatter',
				data: [
					[10, 10],
					[20, 20],
					[30, 15],
					[40, 30]
				]
			}]
		},
		'2D-button2': {
			angleAxis: {},
			radiusAxis: {
				type: 'category',
				data: ['A', 'B', 'C', 'D']
			},
			polar: {},
			series: [{
				type: 'bar',
				data: [1, 2, 3, 4],
				coordinateSystem: 'polar'
			}]
		},
		'1D-button1': {
			xAxis: {
				type: 'category',
			},
			yAxis: {
				type: 'value'
			},
			series: [{
				data: [120],
				type: 'bar'
			}]
		},
		'1D-button2': {
			tooltip: {
				trigger: 'item'
			},
			legend: {
				top: '5%',
				left: 'center'
			},
			series: [{
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#fff',
					borderWidth: 2
				},
				label: {
					show: false,
					position: 'center'
				},
				data: [1, 2, 3]
			}]
		}
	}
	const option = ref({}) // 当前展示的图表配置

	// 文本显示
	const currentDisplay = computed(() =>
		display.find(item => item.dimension === props.dimension)
	)

	const button1 = computed(() => currentDisplay.value?.button1 || '')
	const button2 = computed(() => currentDisplay.value?.button2 || '')

	function selectButton(buttonKey) {
		selectedButton.value = buttonKey
		emit('button-change', {
			button: buttonKey === 'button1' ? button1.value : button2.value,
			key: buttonKey
		})

	}

	function goToDetail() {
		uni.navigateTo({
			url: `/pages/chart/chart?dimension=${props.dimension}`
			//url: `/pages/example/example?dimension=${props.dimension}`
		})
	}

	// 初始化并设置图表
	const init = async () => {
		if (!chartRef.value) return
		const myChart = await chartRef.value.init(echarts)
		myChart.setOption(option.value)
	}

	// 更新图表配置
	function updateChartOption() {
		if (props.dimension !== '3D') {
			const key = `${props.dimension}-${selectedButton.value}`;
			option.value = optionMap[key] || {};
			init();
		}
	}


	// 监听 dimension和button 变化
	watch(() => props.dimension, () => {
		selectedButton.value = 'button1'
		updateChartOption()
	})
	watch(selectedButton, () => {
		updateChartOption()
	})

	onMounted(() => {
		updateChartOption()
	})
</script>

<style scoped>
	.card {
		position: relative;
		border-radius: 32rpx;
		box-shadow: 4rpx 8rpx 32rpx rgba(0, 0, 0, 0.1);
	}

	.tag {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
		background: #ffffff;
		padding: 14rpx 30rpx;
		font-size: 22rpx;
		font-weight: bold;
		border-radius: 16rpx;
	}

	.change-button {
		position: absolute;
		top: 20rpx;
		left: 12rpx;
		display: flex;
		gap: 12rpx;
	}

	.button {
		padding: 20rpx 40rpx;
		border: 1px solid #d2d3dd;
		border-radius: 32rpx;
		color: #333;
		font-size: 32rpx;
	}

	.button.selected {
		background-color: #e2effb;
		color: #007aff;
		border-color: #e2effb;
	}

	.chart-cube {
		width: 100%;
		height: 588rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #f4f4f4;
		border-radius: 32rpx 32rpx 0 0;
	}

	.chart {
		margin-top: 80rpx;
		height: 80%;
		width: 100%;
		z-index: 0;
	}

	canvas {
		height: 100%;
		width: 100%;
	}

	.text-content {
		height: 140rpx;
		background: #ffffff;
		border-radius: 0 0 32rpx 32rpx;
		padding: 12rpx 0 0 24rpx;
	}

	.title {
		font-weight: bold;
		font-size: 34rpx;
		margin-bottom: 20rpx;
	}

	.desc {
		color: #4e4e4e;
		font-size: 24rpx;
	}
</style>