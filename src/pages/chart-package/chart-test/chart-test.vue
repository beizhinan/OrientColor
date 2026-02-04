<template>
  <view class="container">
    <view class="header">
      <text class="title">ECharts 图表测试</text>
    </view>
    
    <view class="chart-section">
      <view class="section-title">基础柱状图</view>
      <view class="chart-wrapper">
        <l-echart 
          v-if="showChart" 
          ref="chartRef" 
          :custom-style="chartStyle"
          @finished="initChart">
        </l-echart>
        <view v-else class="chart-placeholder">
          <text>图表加载中...</text>
        </view>
      </view>
    </view>
    
    <view class="info-section">
      <view class="info-item">
        <text class="info-label">图表状态:</text>
        <text class="info-value" :class="{ success: isChartReady }">
          {{ isChartReady ? '已加载' : '加载中' }}
        </text>
      </view>
      
      <view class="info-item">
        <text class="info-label">分包状态:</text>
        <text class="info-value" :class="{ success: isSubPackageLoaded }">
          {{ isSubPackageLoaded ? '已加载' : '加载中' }}
        </text>
      </view>
    </view>
    
    <view class="actions">
      <button class="action-btn" @click="updateChartData">更新数据</button>
      <button class="action-btn" @click="reloadChart">重新加载</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 图表相关引用
const chartRef = ref(null)
const showChart = ref(false)
const isChartReady = ref(false)
const isSubPackageLoaded = ref(false)
const chartStyle = "width: 100%; height: 300px;"

let chartInstance = null

// 图表示例数据
const chartData = ref({
  xAxis: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
  series: [5, 20, 36, 10, 10, 20]
})

onMounted(() => {
  // 模拟分包加载完成
  setTimeout(() => {
    isSubPackageLoaded.value = true
    showChart.value = true
  }, 200)
})

// 初始化图表
const initChart = async () => {
  try {
    console.log('开始初始化图表...')
    
    if (!chartRef.value || !chartRef.value.init) {
      console.error('图表组件未正确初始化')
      return
    }
    
    // 初始化图表实例
    chartInstance = await chartRef.value.init()
    isChartReady.value = true
    
    // 设置图表配置项
    const option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: chartData.value.xAxis
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: chartData.value.series
      }]
    }
    
    // 渲染图表
    chartInstance.setOption(option)
    console.log('图表初始化成功')
  } catch (error) {
    console.error('图表初始化失败:', error)
  }
}

// 更新图表数据
const updateChartData = () => {
  if (!chartInstance) return
  
  // 生成随机数据
  const newData = chartData.value.series.map(() => 
    Math.floor(Math.random() * 50) + 5
  )
  
  chartData.value.series = newData
  
  // 更新图表
  chartInstance.setOption({
    xAxis: {
      data: chartData.value.xAxis
    },
    series: [{
      data: chartData.value.series
    }]
  })
}

// 重新加载图表
const reloadChart = () => {
  isChartReady.value = false
  showChart.value = false
  
  setTimeout(() => {
    showChart.value = true
  }, 100)
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
  padding: 20rpx 0;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.chart-section {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #666;
}

.chart-wrapper {
  width: 100%;
  height: 300px;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-placeholder {
  text-align: center;
  color: #999;
}

.info-section {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 28rpx;
  color: #666;
}

.info-value {
  font-size: 28rpx;
  color: #ff6b6b;
}

.info-value.success {
  color: #52c41a;
}

.actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  background-color: #9f7735;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  text-align: center;
}

.action-btn:active {
  background-color: #c69c6d;
}
</style>
</script>
</file>