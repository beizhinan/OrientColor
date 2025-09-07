<template>
  <view class="page">
    <!-- 维度选择 -->
    <dimension-tabs :active="activeDimension" @change="onDimensionChange" />

    <!-- 条件选择 -->
    <filter-bar :filters="filters" @filter-change="onFilterChange" />

    <!-- 色彩展示区域 -->
    <color-display :dimension="activeDimension" :filterData="selectedFilters" />

  </view>
</template>

<script>
import DimensionTabs from '@/components/showcase/DimensionTabs.vue'
import FilterBar from '@/components/showcase/FilterBar.vue'
import ColorDisplay from '@/components/showcase/ColorDisplay.vue'

export default {
  components: {
    DimensionTabs,
    FilterBar,
    ColorDisplay
  },
  data() {
    return {
      activeDimension: '3D',
	  activeButton: 'button1',
      selectedFilters: {
        all: '',
        system: '',
        hue: '',
        theme: '',
        category: ''
      },
      filters: [
        { key: 'all', label: '全部'},
        { key: 'system', label: '色系', icon: '/static/showcase/filter-sexi.png', iconActive: '/static/showcase/filter-sexi-active.png', 
		options: ['红', '橙', '黄','绿','紫','黑','白','灰','青'] , bottom:'82', left:'30'},
        { key: 'hue', label: '色调', icon: '/static/showcase/filter-sediao.png', iconActive: '/static/showcase/filter-sediao-active.png',
		options: ['淡', '浅','灰', '暗', '柔','浊','亮', '强', '深'] , bottom:'82', left:'60'},
		{ key: 'category', label: '类别', icon: '/static/showcase/filter-leibie.png', iconActive: '/static/showcase/filter-leibie-active.png',
		options: ['建筑', '陶瓷', '绘画', '丝绸','其他'] , bottom:'175', left:'0'},
		{ key: 'theme', label: '主题', icon: '/static/showcase/filter-zhuti.png', iconActive: '/static/showcase/filter-zhuti-active.png',
		options: ['开化寺色谱', '永乐宫色谱', '乾隆色谱', '《营造法式》彩画色谱'] , bottom:'175', left:'30'}
      ]
    }
  },
  methods: {
    onDimensionChange(newDimension) {
      this.activeDimension = newDimension
    },
    onFilterChange(selectedParentKeyArray) {
        const keyMap = {
			all: 'all',
            system: 'system',
            hue: 'hue',
            category: 'category',
			theme: 'theme'
        };
    
        // 判断 selectedParentKeyArray 中是否有 all 且其 value 有值
        const hasAll = selectedParentKeyArray.some(item => item.key === 'all' && item.value);
        
        if (hasAll) {
            // all 有值时，将 selectedFilters 全部清空
            Object.keys(this.selectedFilters).forEach(key => {
                this.selectedFilters[key] = '';
            });
        } else {
            // all 没有值时，按原逻辑赋值
            selectedParentKeyArray.forEach(item => {
                const field = keyMap[item.key];
                if (field) {
                    this.selectedFilters[field] = item.value;
                }
            });
        }
    
        console.log('筛选结果',this.selectedFilters);
    }
  }
}
</script>

<style scoped>
.page {
  padding: 22rpx 42rpx 30rpx 42rpx;
  background-color: #fffbf6;
}

</style>
