<template>
	<view class="chart-1d">
		<!-- 标题 -->
		<view class="title">
			<text v-if="selectedButton==='button1'" class="title-content">带状一维模型</text>
			<text v-if="selectedButton==='button2'" class="title-content">环状一维模型</text>
		</view>

		<!-- 图表 -->
		<view class="container">
			<!-- 左侧图表 -->
			<view class="chart">
				<l-echart class="chart-content" ref="chartRef" @finished="init"></l-echart>
				<ring1d v-if="selectedButton==='button2'"></ring1d>
			</view>

			<!-- 右侧详情面板 -->
			<view class="detail-panel">
				<view v-if="selectedButton==='button2'" class="arrow"></view>
				<detail-card :color-name="currentColor.name" :color-code="currentColor.code"
					:cardStyle="handleCardStyle" v-if="showDetail">
				</detail-card>

			</view>
		</view>

		<!-- 选择框组件 -->
		<view class="center">
			<InteractionTip :button="selectedButton" :dimension="'1D'" @select1D="handleSelect1D">
			</InteractionTip>
		</view>

		<!-- 收藏组件-->
		<view class="c-container">
			<Collection></Collection>
		</view>

		<!-- 底部导航-->
		<buttomTabVue></buttomTabVue>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		watch
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	const echarts = require('../../uni_modules/lime-echart/static/echarts.min')
	import detailCard from "@/components/chart/detailCard.vue"
	import InteractionTip from "@/components/chart/InteractionTip.vue"
	import Collection from "@/components/chart/collection.vue";
	import buttomTabVue from '@/components/buttomTab/buttomTab.vue'
	import ring1d from "@/components/chart/ring-1D.vue"

	const chartRef = ref(null)
	const myChartRef = ref(null)
	const currentColor = ref({
		name: '',
		code: ''
	})
	const selectedButton = ref('')
	const selectedDim1D = ref('L')
	const colorPoints = ref([])
	const showDetail = ref(false)

	//从showcase接受值
	onLoad((options) => {
		selectedButton.value = options.selectedButton
		colorPoints.value = JSON.parse(decodeURIComponent(options.colorPoints)) || []
	})

	//选择坐标
	const handleSelect1D = (dim) => {
		selectedDim1D.value = dim
	}

	//判断色彩详情样式
	const handleCardStyle = computed(() => {
		if (selectedButton.value === 'button1') {
			return '1dRect'
		} else if (selectedButton.value === 'button2') {
			return '1dPolar'
		}
		return ''
	})

	// 根据数据量决定分段数
	const getStepCount = (dataCount) => {
		// 至少和数据量一样多
		let stepCount = dataCount

		// 给一点冗余（避免两个值落到同一格）
		stepCount = Math.ceil(stepCount * 1.2)

		// 控制上限（比如最多 100 段）
		stepCount = Math.min(stepCount, 100)

		return stepCount
	}

	// 生成配置
	const get1DOption = () => {
		const dim = selectedDim1D.value
		const values = colorPoints.value.map(p => p[dim])
		const minVal = Math.min(...values)
		const maxVal = Math.max(...values)

		// 分段数（比如 10 段，可以根据数据多少自适应）
		const stepCount = getStepCount(colorPoints.value.length)
		const step = (maxVal - minVal) / stepCount

		// 按维度值分配区间
		const blocks = []
		for (let i = 0; i < stepCount; i++) {
			const start = minVal + i * step
			const end = minVal + (i + 1) * step
			// 找到落在区间内的点
			const point = colorPoints.value.find(p => p[dim] >= start && p[dim] < end)
			blocks.push({
				start,
				end,
				name: point ? point.name : '',
				code: point ? point.code : '#CCCCCC' // 没数据填灰色
			})
		}

		return {
			tooltip: {show: false},
			grid: {
				left: 40,
				right: 10,
				top: 10,
				bottom: 10
			},
			xAxis: {
				show: false,
				min: 0,
				max: 1
			},
			yAxis: {
				type: 'value',
				min: minVal,
				max: maxVal,
				splitNumber: 10,
				axisLine: {
					show: true,
					lineStyle: {
						color: '#9f7735',
						width: 2
					}
				},
				axisTick: {
					show: true,
					lineStyle: {
						color: '#9f7735'
					}
				},
				axisLabel: {
					show: true,
					lineStyle: {
						color: '#9f7735'
					}
				},
			},
			series: [{
				type: 'custom',
				renderItem: (params, api) => {
					const item = blocks[params.dataIndex]
					const gap = 24
					const x0 = api.coord([0, 0])[0] + gap
					const x1 = api.coord([1, 0])[0] + gap

					const y0 = api.coord([0, item.start])[1]
					const y1 = api.coord([0, item.end])[1]

					return {
						type: 'rect',
						shape: {
							x: Math.min(x0, x1),
							y: Math.min(y0, y1),
							width: api.size([1, 0])[0],
							height: Math.abs(y1 - y0)
						},
						style: {
							fill: item.code
						}
					}
				},
				data: blocks
			}]
		}
	}

	//传递色彩详情参数
	const bindChartEvents = (chartInstance) => {
		chartInstance.off('click') // 防止重复绑定
		chartInstance.on('click', (params) => {
			if (params.data.name) {
				currentColor.value = {
					name: params.data.name,
					code: params.data.code
				}
				showDetail.value = true
			}
		})
	}

	//图标初始化
	const init = async () => {
		if (!chartRef.value) return
		const chartInstance = await chartRef.value.init(echarts)
		myChartRef.value = chartInstance // 保存实例
		chartInstance.setOption(get1DOption())
		bindChartEvents(chartInstance)
	}

	// 监听坐标变化，重新渲染
	watch([selectedDim1D, selectedButton], () => {
		if (!chartRef.value) return
		// 容器可能被销毁，重新 init
		chartRef.value.init(echarts).then(chartInstance => {
			myChartRef.value = chartInstance
			chartInstance.setOption(get1DOption(), true)
			bindChartEvents(chartInstance)
		})
	})

	onMounted(() => {
		setTimeout(() => {
			init()
		}, 300)
	})
</script>

<style scoped>
	.chart-1d {
		background-color: #fffbf6;
		padding: 20rpx;
		height: 100vh;
		box-sizing: border-box;
	}

	.title {
		text-align: center;
		padding: 20rpx;
	}

	.title-content {
		color: #9f7735;
		font-size: 34rpx;
		font-weight: 900;
	}

	.container {
		display: flex;
		flex-direction: row;
	}

	.chart {
		width: 160px;
		height: 450px;
	}

	.detail-panel {
		margin-left: 40rpx;
		margin-top: 80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.arrow {
		width: 0;
		height: 0;
		border-left: 10px solid #dcbf9a;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
	}

	.color-box {
		width: 80px;
		height: 80px;
		margin-top: 10px;
	}

	.color-info {
		margin-top: 5px;
		text-align: center;
	}

	.mini-chart {
		width: 80px;
		height: 80px;
		margin-top: 10px;
	}

	.center {
		display: flex;
		justify-content: center;
	}

	.c-container {
		display: flex;
		justify-content: center;
		position: fixed;
		bottom: 150rpx;
		left: 0;
		width: 100%;
	}
</style>