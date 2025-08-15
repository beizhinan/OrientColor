<template>
  <view class="ring-container" :style="{ width: `${size}rpx`, height: `${size}rpx` }">
    <!-- 渐变环主体 -->
    <view 
      class="gradient-ring"
      :style="{
        background: `conic-gradient(from ${startOffset}deg, ${gradientColors})`,
		padding: `${ringWidth}rpx`
      }"
    ></view>
    
    <!-- 中心遮挡圆 -->
    <view class="inner-circle" :style="{ width: `${innerSize}rpx`, height: `${innerSize}rpx` }"></view>
	<view class="fixed-mask" v-if="maskFlag" :style="{ width: `${size}rpx`, height: `${size}rpx` }"></view>
  </view>
</template>

<script>
export default {
  props: {
    // 接收外部传入的颜色数组（支持任意数量）
    colors: {
      type: Array,
      default: () => [
        '#ff0000', '#ffa500', '#ffff00', 
        '#00ff00', '#0000ff', '#4b0082', '#ee82ee'
      ]
    },
	size: {
	    type: Number,
	    default: 740
	},
	maskFlag:{
		type:Boolean,
		default:false
	}
  },
  computed: {
	// 动态计算环宽（等比缩放）
	ringWidth() {
	    return (this.size * 100) / 740;  // 100/740 是原环宽比例
	},
	// 动态计算内环尺寸（等比缩放）
	innerSize() {
	    return (this.size * 540) / 740;  // 540/740 是原内环比例
	},
    // 生成圆锥渐变的颜色字符串，确保均匀分布
    gradientColors() {
      const colorCount = this.colors.length;
      return this.colors.map((color, index) => {
        // 计算每个颜色起始角度，让颜色区间均匀分布
        const startAngle = (index / colorCount) * 360;
        const endAngle = ((index + 1) / colorCount) * 360;
        return `${color} ${startAngle}deg ${endAngle}deg`;
      }).join(', ');
    },
	startOffset() {
	    const colorCount = this.colors.length;
	    const segmentAngle = 360 / colorCount;
	    return 90 - (segmentAngle / 2); // 确保第一个颜色中心对齐最右端
	}
  }
};
</script>

<style scoped>
	.ring-container {
		position: relative;
		/* width: 740rpx; */
		/* height: 740rpx; */	
		margin: 20rpx auto;
	}

	/* 渐变环样式 */
	.gradient-ring {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		/* 关键：通过内边距和背景裁剪实现环形 */
		padding: 100rpx; /* 环宽 = 100rpx，与原尺寸一致 */
		background-clip: content-box; /* 背景只显示在内容区域（裁剪掉内边距） */
		box-sizing: border-box;
	}

	/* 中心遮挡圆（保持原尺寸） */
	.inner-circle {
		position: absolute;
		top: 50%;
		left: 50%;
		/* width: 540rpx; */ /* 740 - 2*100 = 540 */
		/* height: 540rpx; */
		background-color: white;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}
	.fixed-mask {
		border-radius: 50%;
		position: absolute;
		top:0;
		left: 0;
		z-index: 2;
		background-color: rgba(0, 0, 0, 0.5); /* 半透明蒙版 */
		clip-path: polygon(
			50% 50%, /* 中心 */
			100% 36.6%, 100% 0%, 0% 0%, 0% 101%, /* 覆盖整个圆 101是为了删除最底部的蒙版未完全覆盖的问题*/
			100% 101%, /* 缺口起点（0度） */
			100% 63.4%, /* 缺口终点（30度） */
			50% 50% /* 闭合缺口 */
		  );
	}
</style>