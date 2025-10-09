<template>
	<view class="chart-1d">
		<!-- 标题 -->
		<view class="title">
			<text class="title-content">{{ getTitle(selectedDim1D) }}</text>
		</view>

		<!-- 图表 -->
		<view class="container">
			<!-- 左侧图表 -->
			<view class="chart">
				<l-echart v-if="colorPoints.length > 0 && chartChange==='rect'" class="chart-content" ref="chartRef" @finished="init"></l-echart>
				<ring1d 
					v-if="colorPoints.length > 0 && chartChange === 'polar'"
					:color-points="colorPoints"
					@selectColor="handleSelectColor">
				</ring1d>
			</view>

			<!-- 右侧详情面板 -->
			<view class="detail-panel" :class="chartChange">
				<detail-card 
					:color-name="currentColor.name" 
					:color-code="currentColor.code"
					:color-id="currentColor.id"
					:cardStyle="handleCardStyle" 
					v-if="showDetail">
				</detail-card>
			</view>
		</view>

		<!-- 选择框组件 -->
		<view class="center">
			<InteractionTip 
				:button="selectedButton" 
				:dimension="'1D'" 
				@select1D="handleSelect1D"
				@changeChart="handleChartChange">
			</InteractionTip>
		</view>

		<!-- 收藏组件-->
		<view class="c-container">
			<Collection :color="currentColor" :filterData="filterData"></Collection>
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
		onLoad, onUnload
	} from '@dcloudio/uni-app'
	const echarts = require('../../uni_modules/lime-echart/static/echarts.min')
	import detailCard from "@/components/chart/detailCard.vue"
	import InteractionTip from "@/components/chart/InteractionTip.vue"
	import Collection from "@/components/chart/collection.vue";
	import buttomTabVue from '@/components/buttomTab/buttomTab.vue'
	import ring1d from "@/components/chart/ring-1D.vue"
	import { getColorPoints } from '@/api/colorPoints.js'

	const chartRef = ref(null)
	const myChartRef = ref(null)
	const currentColor = ref({
		name: '',
		code: '',
		id: '',
	})
	const selectedButton = ref('')
	const selectedDim1D = ref('L')
	const colorPoints = ref([])
	const colorPointsStatic = ref([])
	const showDetail = ref(false)
	const selectedFilters = ref('一维色谱')
	const chartChange = ref('')
	const filterData = ref([])

	//从showcase接受值
	onLoad((options) => {
		selectedButton.value = options.selectedButton
		colorPointsStatic.value = JSON.parse(decodeURIComponent(options.colorPoints)) || []
		selectedFilters.value = options.selectedFilters === '三维色谱' ? '一维色谱' : options.selectedFilters
		uni.setNavigationBarTitle({
		    title: selectedFilters.value
		})
		filterData.value = JSON.parse(decodeURIComponent(options.filterData)) || []
		//页面加载时请求后端数据
		fetchColorPoints()
	})
	
	onUnload(() => {
		selectedFilters.value = '一维色谱'
	})

	//选择坐标
	const handleSelect1D = (dim) => {
		selectedDim1D.value = dim
	}
	const handleChartChange = (dim) => {
		chartChange.value = dim
	}
	
	// 标题映射
	const getTitle = (dim) => {
		if(chartChange.value == 'polar'){
			return '色相H'
		} else{
			switch (dim) {
				case 'L': return '明度L';
				case 'a': return '红绿轴';
				case 'b': return '黄蓝轴';
				case 'C': return '彩度C';
				case 'H': return '色相H';
				default: return '一维模型';
			}
		}
	}

	//判断色彩详情样式
	const handleCardStyle = computed(() => {
		if (chartChange.value === 'rect') {
			return '1dRect'
		} else if (chartChange.value === 'polar') {
			return '1dPolar'
		}
		return ''
	})
	
	// 获取后端色彩数据
	const fetchColorPoints = async () => {
	  try {
	    const params = {
	      system: filterData.value.system || '',
	      hue: filterData.value.hue || '',
	      theme: filterData.value.theme || '',
	      category: filterData.value.category || ''
	    }
	
	    const res = await getColorPoints(params)
	
	    if (res.status === 'success') {
	      colorPoints.value = res.data || []
	      console.log('色彩点数据获取成功:', colorPoints.value)
	    } else {
	      uni.showToast({
	        title: res.message || '获取数据失败',
	        icon: 'none'
	      })
	    }
	  } catch (err) {
	    console.error('Failed to fetch colorPoints:', err)
	    uni.showToast({
	      title: '网络错误',
	      icon: 'none'
	    })
	  }
	}
	
	// -------环状图组件相关处理-------
	const handleSelectColor = (colorArray) => {
		const matched = colorPoints.value.find(item => item.name === colorArray[0])
		currentColor.value = {
			name: colorArray[0],
			code: colorArray[1],
			id: matched ? matched.id : null,
		}
		showDetail.value = true
	}

	// -------带状图-------
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

		// 分段数
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
				code: point ? point.code : '#CCCCCC', // 没数据填灰色
				id: point ? point.id : ''
			})
		}

		return {
			tooltip: {show: false},
			grid: {
				left: 40,
				right: 40,
				top: 10,
				bottom: 10
			},
			xAxis: {
				show: false,
				min: 0,
				max: 1
			},
			dataZoom: [
				{
					type: 'inside',
					orient: 'vertical',
					yAxisIndex: 0,
					// 一开始显示多少范围（例如前 30%）
					start: 0,
					end: Math.min(100, (30 / stepCount) * 100)
				},
				{
					type: 'slider',
					orient: 'vertical',
					yAxisIndex: 0,
					right: 15,   // 滚动条在右边
					width: 5,
					start: 0,
					end: Math.min(100, (30 / stepCount) * 100),
					// 滚动条样式
					backgroundColor: 'rgba(220, 220, 220, 0.4)', // 背景
					fillerColor: '#deb67f',                      // 选中区域颜色
					borderColor: 'rgba(0,0,0,0)',
					handleSize: 10,
					handleStyle: {
						color: '#deb67f',
						borderColor: '#9f7735'
					}
			    }
			],
			yAxis: {
				type: 'value',
				min: minVal,
				max: maxVal,
				splitNumber: 10,
				axisLine: {
				    show: true,
				    lineStyle: { color: '#9f7735', width: 2 }
				},
				axisTick: { show: true, lineStyle: { color: '#9f7735' } },
				axisLabel: {
					show: true,
					lineStyle: { color: '#9f7735' }
				},
			},
			series: [{
				type: 'custom',
				renderItem: (params, api) => {
					const item = blocks[params.dataIndex]
					const gap = 15
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
					code: params.data.code,
					id: params.data.id,
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
		
		if (selectedButton.value === 'button1') {
		    chartChange.value = 'rect'
		} else if (selectedButton.value === 'button2') {
		    chartChange.value = 'polar'
		}
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
		width: 170px;
		height: 450px;
	}

	.detail-panel {
		position: absolute;
		right: 40rpx;
	}
	
	/* rect 时的样式 */
	.detail-panel.rect {
		top: 200rpx;
	}
	
	/* polar 时的样式 */
	.detail-panel.polar {
		top: 140rpx;
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