<template>
	<view class="container">
		<!-- 标题 -->
		<view class="title">
			<text v-if="chartChange=='rect'" class="title-content">{{ getTitle(selectedDim2DRect) }}</text>
			<text v-if="chartChange=='polar'" class="title-content">{{ getTitle(selectedDim2DPolar) }}</text>
		</view>
		
		<!-- 图表 -->
		<view class="chart">
			<l-echart class="chart-content" ref="chartRef" @finished="init"></l-echart>
		</view>
		
		<!-- 色彩详情组件 -->
		<view class="detail">
			<detail-card
			  :color-name="selectedColor.name"
			  :color-code="selectedColor.code"
			  :color-id="selectedColor.id"
			  :cardStyle="'2d'"
			  v-if="showDetail">
			</detail-card>
		</view>
		
		<!-- 选择框组件 -->
		<view class="center">
			<InteractionTip
			  :button="selectedButton"
			  :dimension="'2D'"
			  @select2DRect="handleSelect2DRect"
			  @select2DPolar="handleSelect2DPolar"
			  @changeChart="handleChartChange">
			</InteractionTip>
		</view>
		
		<!-- 收藏组件-->
		<view class="center c-container">
			<Collection :color="selectedColor" :filterData="filterData"></Collection> 
		</view>
		
		<!-- 底部导航-->
		<buttomTabVue></buttomTabVue>
	</view>
</template>

<script setup>
	import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
	import { onLoad, onUnload } from '@dcloudio/uni-app'
	const echarts = require('../../uni_modules/lime-echart/static/echarts.min')
	import detailCard from "@/components/chart/detailCard.vue"
	import InteractionTip from "@/components/chart/InteractionTip.vue"
	import Collection from "@/components/chart/collection.vue";
	import buttomTabVue from '@/components/buttomTab/buttomTab.vue'
	import { getColorPoints } from '@/api/colorPoints.js'
	
	const selectedButton = ref('')
	const chartChange = ref('')
	const colorPoints = ref([])
	const colorPointsStatic = ref([])
	const chartRef = ref(null)
	const dimension = ref('LC')
	const selectedColor = ref({name: '', code: '', id: ''})
	const showDetail = ref(false)
	const selectedDim2DRect = ref('LC')
	const selectedDim2DPolar = ref('LH')
	const myChartRef = ref(null) // 存放 echarts 实例
	const selectedCellIndex = ref(null) // 极坐标当前选中格子的索引
	const selectedFilters = ref('二维色谱')
	const filterData = ref([])
	
	
	//从showcase接受值
	onLoad((options) => {
		selectedButton.value = options.selectedButton
		colorPointsStatic.value = JSON.parse(decodeURIComponent(options.colorPoints)) || []
		selectedFilters.value = options.selectedFilters === 'all' ? '二维色谱' : options.selectedFilters
		uni.setNavigationBarTitle({
			title: selectedFilters.value
		})
		console.log(selectedFilters.value)
	  
		filterData.value = JSON.parse(decodeURIComponent(options.filterData)) || []
		//页面加载时请求后端数据
		fetchColorPoints()
	})
	
	onUnload(() => {
		selectedFilters.value = '二维色谱'
	})
	
	//选择坐标
	const handleSelect2DRect = (dim) => {
		selectedDim2DRect.value = dim
	}
	const handleSelect2DPolar = (dim) => {
		selectedDim2DPolar.value = dim
	}
	const handleChartChange = (dim) => {
		chartChange.value = dim
	}
	
	// 标题映射
	const getTitle = (dim) => {
	  switch (dim) {
	    case 'LC': return '明度L-彩度C';
	    case 'La': return '明度L-红绿轴a';
	    case 'Lb': return '明度L-黄蓝轴b';
	    case 'LH': return '明度L-色相H';
	    case 'CH(ab)': return '彩度C-色相H';
	    default: return '二维模型';
	  }
	}
	
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

	// ------- 直角坐标图 -------
	function getScatterOption() {
		const yKey = selectedDim2DRect.value[0] // 纵坐标
		const xKey = selectedDim2DRect.value[1] // 横坐标
		const data = colorPoints.value.map(p => [p[xKey], p[yKey], p.code, p.name])

		return {
			/*grid: {
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				containLabel: false
			},*/
			xAxis: {
				name: xKey,
				scale: true
			},
			yAxis: {
				name: yKey,
				scale: true
			},
			dataZoom: [
				{ type: 'inside', xAxisIndex: 0 },
				{ type: 'inside', yAxisIndex: 0 }
			],
			series: [
				{
					type: 'scatter',
					symbol: 'rect',
					symbolSize: 15, // 固定大小
					itemStyle: {
						opacity: 1,
						color: function (param) {
							return param.data[2] // 取颜色
						}
					},
					data: data
				}
			]
		}
	}
	
	// ------- 极坐标图 -------
	function getPolarOption() {
		const isCH = selectedDim2DPolar.value === 'CH(ab)'
		const radiusKey = isCH ? 'C' : 'L'
		const angleKey = 'H'
	
		// 数据映射
		const minRadiusVal = Math.min(...colorPoints.value.map(p => p[radiusKey])) || 0
		const maxRadiusVal = Math.max(...colorPoints.value.map(p => p[radiusKey])) || 1
		
		// 生成色块（固定分辨率）
		const radiusSteps = 5 // 半径分多少圈
		const stepSize = (maxRadiusVal - minRadiusVal) / radiusSteps
		const angleSteps = 360 // 角度分多少块
	
		let cells = []
		for (let rStep = 0; rStep < radiusSteps; rStep++) {
			for (let aStep = 0; aStep < angleSteps; aStep++) {
				const angle = (aStep / angleSteps) * 360
				// 找到数据中对应色块
				const cellData = colorPoints.value.find(p => {
					const pAngle = p[angleKey]
					const pRadius = p[radiusKey]
					const radiusBin = Math.floor(((pRadius - minRadiusVal) / (maxRadiusVal - minRadiusVal)) * radiusSteps)
					const angleBin = Math.floor((pAngle / 360) * angleSteps)
					return radiusBin === rStep && angleBin === aStep
				})
				if (cellData) {
						cells.push({
							value: [cellData[radiusKey], cellData[angleKey]],
							color: cellData.code,
							name: cellData.name,
							code: cellData.code
						})
				}
			}
		}
	
		return {
			polar: { radius: '72%'},
			angleAxis: {
				type: 'value',
				startAngle: 0, 
				min: 0,
				max: 360,
				interval: 30,   
				axisLine: { show: true },
				axisTick: { show: true, length: 8 },
				splitLine: { show: true, lineStyle: { color: '#d0d0d0'} },
				axisLabel: {
					show: true,
				    formatter: val => `${val}°`,
				    margin: 10,                  
				    rotate: 0,
				    align: 'center'
				}
			},
			radiusAxis: {
				type: 'value',
				min: minRadiusVal,
				max: maxRadiusVal,
				splitNumber: radiusSteps,   // 分 10 段
				interval: stepSize,         // 每段间隔
				axisLine: { show: true },
				axisTick: { show: true },
				axisLabel: {
				    show: true,
				    formatter: val => val.toFixed(0) // 保留整数显示
				},
				splitLine: { show: true, lineStyle: { color: '#d0d0d0', type: 'dashed'} },
				name: radiusKey,
				nameLocation: 'end',
				nameTextStyle: {
				    fontWeight: 'bold',   
				    fontSize: 14,          
				    color: '#6f6f6f'
				},
				nameGap: 30           
			},
			dataZoom: [
			    {
			      type: 'inside',
			      radiusAxisIndex: 0,
			      filterMode: 'none'  
			    },
			    {
			      type: 'inside',
			      angleAxisIndex: 0,
			      filterMode: 'none'
			    }
			],
			series: [
				{
				    type: 'scatter',
				    coordinateSystem: 'polar',
				    symbol: 'circle',
				    symbolSize: 15, // 固定像素大小，不随缩放变化
				    
				    data: cells.map(c => ({
				      value: [c.value[0], c.value[1]], // r, angle
				      itemStyle: { color: c.color, opacity: 1 },
				      name: c.name,
				      code: c.code
				    }))
				}
			]
		}
	}

	//传递色彩详情参数
	const bindChartEvents = (chartInstance) => {
		chartInstance.off('click') // 防止重复绑定
		chartInstance.on('click', (params) => {
			if (params.data) {
				selectedCellIndex.value = params.dataIndex
				if (chartChange.value === 'rect') {
					const matched = colorPoints.value.find(item => item.name === params.data[3])
				    selectedColor.value = {
						name: params.data[3], 
						code: params.data[2],
						id: matched ? matched.id : null
				    }
				} else {
					const matchedp = colorPoints.value.find(item => item.name === params.data.name)
				    selectedColor.value = {
						name: params.data.name, 
						code: params.data.code,
						id: matchedp ? matchedp.id : null
				    }
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
		const option =
				chartChange.value === 'rect' 
					? getScatterOption()
					: getPolarOption()
			chartInstance.setOption(option)
		bindChartEvents(chartInstance)
	}

	// 监听坐标变化，重新渲染
	watch([selectedDim2DRect, selectedDim2DPolar, selectedButton, chartChange], () => {
		if (!chartRef.value) return
		// 容器可能被销毁，重新 init
		chartRef.value.init(echarts).then(chartInstance => {
			myChartRef.value = chartInstance
			const option =
				chartChange.value == 'rect'
					? getScatterOption()
					: getPolarOption()
			chartInstance.setOption(option, true)
			bindChartEvents(chartInstance)
			console.log(chartChange.value)
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
	.container{
		background-color: #fffbf6;
		padding: 20rpx;
		height: 100vh;
		box-sizing: border-box;
	}
	
	.title{
		text-align: center;
		padding: 20rpx;
	}
	
	.title-content{
		color: #9f7735;
		font-size: 34rpx;
		font-weight: 900;
	}
	
	.chart {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 600rpx;
	}
	
	.chart-content{
		background-color: #fff;
		width: 90%;
	}
	
	.detail{
		display: flex;
		justify-content: center;
	}
	
	.center{
		display: flex;
		justify-content: center;
		position: fixed;  
		bottom: 260rpx;    
		left: 0;
		width: 100%;  
	}
	
	.c-container{
		bottom: 150rpx;
	}
</style>
