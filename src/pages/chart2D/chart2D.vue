<template>
	<view class="container">
		<!-- 标题 -->
		<view class="title">
			<text v-if="selectedButton==='button1'" class="title-content">直角坐标二维模型</text>
			<text v-if="selectedButton==='button2'" class="title-content">极坐标二维模型</text>
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
			  @select2DPolar="handleSelect2DPolar">
			</InteractionTip>
		</view>
		
		<!-- 收藏组件-->
		<view class="center c-container">
			<Collection></Collection> 
		</view>
		
		<!-- 底部导航-->
		<buttomTabVue></buttomTabVue>
	</view>
</template>

<script setup>
	import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	const echarts = require('../../uni_modules/lime-echart/static/echarts.min')
	import detailCard from "@/components/chart/detailCard.vue"
	import InteractionTip from "@/components/chart/InteractionTip.vue"
	import Collection from "@/components/chart/collection.vue";
	import buttomTabVue from '@/components/buttomTab/buttomTab.vue'
	
	const selectedButton = ref('')
	const colorPoints = ref([])
	const chartRef = ref(null)
	const dimension = ref('LC')
	const selectedColor = ref({name: '', code: ''})
	const showDetail = ref(false)
	const selectedDim2DRect = ref('LC')
	const selectedDim2DPolar = ref('CH')
	const myChartRef = ref(null) // 存放 echarts 实例
	const selectedCellIndex = ref(null) // 极坐标当前选中格子的索引
	
	//从showcase接受值
	onLoad((options) => {
	  selectedButton.value = options.selectedButton
	  colorPoints.value = JSON.parse(decodeURIComponent(options.colorPoints)) || []
	})
	
	//选择坐标
	const handleSelect2DRect = (dim) => {
		selectedDim2DRect.value = dim
	}
	const handleSelect2DPolar = (dim) => {
		selectedDim2DPolar.value = dim
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
		const isCH = selectedDim2DPolar.value === 'CH'
		const radiusKey = isCH ? 'C' : 'L'
		const angleKey = 'H'
	
		// 数据映射
		const maxRadius = Math.max(...colorPoints.value.map(p => p[radiusKey])) || 1
		const maxL = Math.max(...colorPoints.value.map(p => p.L)) || 1
		const maxC = Math.max(...colorPoints.value.map(p => p.C)) || 1
	
		// 生成色块（固定分辨率）
		const radiusSteps = 10 // 半径分多少圈
		const angleSteps = 20 // 角度分多少块
		const angleTick = 30  // 定义角度刻度间隔
	
		let cells = []
		for (let rStep = 0; rStep < radiusSteps; rStep++) {
			for (let aStep = 0; aStep < angleSteps; aStep++) {
				const angle = (aStep / angleSteps) * 360
				// 找到数据中对应色块
				const cellData = colorPoints.value.find(p => {
					const pAngle = p[angleKey]
					const pRadius = isCH ? p.C : p.L
					const radiusBin = Math.floor((pRadius / (isCH ? maxC : maxL)) * radiusSteps)
					const angleBin = Math.floor((pAngle / 360) * angleSteps)
					return radiusBin === rStep && angleBin === aStep
				})
				cells.push({
					value: [rStep, angle],
					color: cellData ? cellData.code : '#fff',
					name: cellData ? cellData.name : '',
					code: cellData ? cellData.code : ''
				})
			}
		}
	
		return {
			polar: { radius: '68%', center: ['50%', '55%'] },
			angleAxis: {
				type: 'value',
				min: 0,
				max: 360,
				startAngle: 0,
				clockwise: true,
				interval: angleTick,      
				axisLine: { show: true },
				axisTick: { show: true, length: 8 },
				splitLine: { show: true, lineStyle: { color: '#d0d0d0'} },
				axisLabel: {
					show: true,
				    formatter: val => `${val}°`,  // 直接显示角度
				    margin: 10,                   // 离轴线的距离（留空隙）
				    rotate: 0,
				    align: 'center'
				}
			},
			radiusAxis: {
				type: 'value',
				min: 0,
				max: radiusSteps,
				splitLine: { show: true, lineStyle: { color: '#d0d0d0', type: 'dashed'} },
				name: isCH ? 'C' : 'L',
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
			//tooltip: { trigger: 'item' },
			series: [
				{
					type: 'custom',
					coordinateSystem: 'polar',
					renderItem: (params, api) => {
						const r = api.value(0)
						const angle = api.value(1)
						const color = api.value(2)
						const coords = api.coord([r, angle])
						const size = api.size([1, 360 / angleSteps])
						return {
							type: 'sector',
							shape: {
								cx: params.coordSys.cx,
								cy: params.coordSys.cy,
								r0: api.coord([r, angle])[2] - size[0] / 2,
								r: api.coord([r + 1, angle])[2] - size[0] / 2,
								startAngle: ((angle) * Math.PI) / 180,
								endAngle: ((angle + 360 / angleSteps) * Math.PI) / 180
							},
							style: {
								fill: color,
								stroke: '#d0d0d0',
								lineWidth: 0.2
							}
						}
					},
					data: cells.map(c => [c.value[0], c.value[1], c.color, c.name, c.code])
				},
				// 色系标签
				/*{
					type: 'scatter',
					coordinateSystem: 'polar',
					symbol: 'circle', // 基础符号，方便定位
					symbolSize: 1,
					label: {
						show: true,
						formatter: params => params.name,
						fontSize: 14,
						color: '#000',
						fontWeight: 'bold'
					},
					itemStyle: {
						color: 'transparent' // 圆点本身透明
					},
					data: [
						[ radiusSteps * 0.8, 45, null, '黄色系' ],
						[ radiusSteps * 0.8, 0, null, '红色系' ],
						[ radiusSteps * 0.8, 270, null, '蓝色系' ],
						[ radiusSteps * 0.8, 180, null, '绿色系' ]
					]
				}*/
			]
		}
	}

	//传递色彩详情参数
	const bindChartEvents = (chartInstance) => {
		chartInstance.off('click') // 防止重复绑定
		chartInstance.on('click', (params) => {
			if (params.data && params.data[3]) {
				selectedCellIndex.value = params.dataIndex
				selectedColor.value = {
					name: params.data[3],
					code: params.data[2]
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
				selectedButton.value === 'button1'
					? getScatterOption()
					: getPolarOption()
			chartInstance.setOption(option)
		bindChartEvents(chartInstance)
	}

	// 监听坐标变化，重新渲染
	watch([selectedDim2DRect, selectedDim2DPolar, selectedButton], () => {
		if (!chartRef.value) return
		// 容器可能被销毁，重新 init
		chartRef.value.init(echarts).then(chartInstance => {
			myChartRef.value = chartInstance
			const option =
				selectedButton.value === 'button1'
					? getScatterOption()
					: getPolarOption()
			chartInstance.setOption(option, true)
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
