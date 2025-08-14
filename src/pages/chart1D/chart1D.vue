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
				
			</view>

			<!-- 右侧详情面板 -->
			<view class="detail-panel">
				<view class="arrow"></view>
				<detail-card
					:color-name="currentColor.name"
					:color-code="currentColor.code"
					:cardStyle="handleCardStyle">
				</detail-card>

				<!-- 右下定位环 -->
				<view class="mini-chart">
					
				</view>
			</view>
		</view>
		
		<!-- 选择框组件 -->
		<view class="center">
			<InteractionTip
			  :button="selectedButton"
			  :dimension="'1D'"
			  @select1D="handleSelect1D">
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
	import { ref, onMounted, computed } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	const echarts = require('../../uni_modules/lime-echart/static/echarts.min')
	import detailCard from "@/components/chart/detailCard.vue"
	import InteractionTip from "@/components/chart/InteractionTip.vue"
	import Collection from "@/components/chart/collection.vue";
	import buttomTabVue from '@/components/buttomTab/buttomTab.vue'

	const chartRef = ref(null)
	const miniChartRef = ref(null)
	const currentColor = ref({name: '',code: ''})
	const selectedButton = ref('')
	const colorPoints = ref([])
	const selectedDim1D = ref('L')
	
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
	
</script>

<style scoped>
	.chart-1d{
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
	
	.container {
		display: flex;
		flex-direction: row;
	}

	.chart {
		width: 200px;
		height: 200px;
	}

	.detail-panel {
		margin-left: 20px;
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
	
	.center{
		display: flex;
		justify-content: center;
	}
	
	.c-container{
		display: flex;
		justify-content: center;
		position: fixed;  
		bottom: 150rpx;    
		left: 0;
		width: 100%; 
	}
</style>