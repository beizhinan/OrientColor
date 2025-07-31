<template>
  <view class="page">
    <!-- 维度选择 -->
    <dimension-tabs :active="activeDimension" @change="onDimensionChange" />

    <!-- 条件选择 -->
    <filter-bar :filters="filters" @filter-change="onFilterChange" />

    <!-- 色彩展示区域 -->
    <color-display :dimension="activeDimension" :filterData="selectedFilters" />

    <!-- 交互提示 -->
    <interaction-tip />
  </view>
</template>

<script>
import DimensionTabs from '@/components/showcase/DimensionTabs.vue'
import FilterBar from '@/components/showcase/FilterBar.vue'
import ColorDisplay from '@/components/showcase/ColorDisplay.vue'
import InteractionTip from '@/components/showcase/InteractionTip.vue'

export default {
  components: {
    DimensionTabs,
    FilterBar,
    ColorDisplay,
    InteractionTip
  },
  data() {
    return {
      activeDimension: '3D',
      selectedFilters: {
        category: '全部',
        colorSeries: '',
        tone: '',
        era: '',
        type: '',
        theme: ''
      },
      filters: [
        { key: 'all', label: '全部', icon: '/static/showcase/filter-icon.png'},
        { key: 'system', label: '色系', icon: '/static/showcase/filter-icon.png', 
		options: ['红', '橙', '黄','绿','紫','黑','白','灰','青'] , bottom:'82', left:'30'},
        { key: 'hue', label: '色调', icon: '/static/showcase/filter-icon.png', 
		options: ['PCCS', '淡', '浅','灰', '暗', '柔','浊','亮', '强', '深'] , bottom:'82', left:'60'},
        { key: 'year', label: '年代', icon: '/static/showcase/filter-icon.png', 
		options: ['唐', '宋', '元', '明', '清', '近现代'] , bottom:'175', left:'0'},
		{ key: 'theme', label: '类别', icon: '/static/showcase/filter-icon.png', 
		options: ['建筑', '陶瓷', '绘画', '丝绸','其他'] , bottom:'175', left:'30'},
		{ key: 'category', label: '主题', icon: '/static/showcase/filter-icon.png', 
		options: ['开化寺色谱', '永乐宫色谱', '乾隆色谱', '《营造法式》彩画色谱'] , bottom:'175', left:'60'}
      ]
    }
  },
  methods: {
    onDimensionChange(newDimension) {
      this.activeDimension = newDimension
    },
    onFilterChange(key, value) {
      this.selectedFilters[key] = value
	  console.log(key)
	  console.log(value)
    }
  }
}
</script>

<style scoped>
.page {
  padding: 22rpx 42rpx 30rpx 42rpx;
}
</style>
