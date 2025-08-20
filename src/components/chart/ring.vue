<template>
	<view class="frame" :style="{ width: `${size}rpx`, height: `${size}rpx`}">
		<view class="ring-container" :style="{ width: `${size}rpx`, height: `${size}rpx`, transform: `rotate(${rotateDeg}deg)` }">
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
			
		</view>
		<view class="fixed-mask" v-if="maskFlag" :style="{ width: `${size}rpx`, height: `${size}rpx`}"></view>
	</view>
</template>

<script>
export default {
  props: {
    // 接收外部传入的颜色数组（支持任意数量）
    colors: {
      type: Array,
      default: () => [
		{
			color:'#ff0000',
			start:20,
			end:50
		},
		 {
		 	color:'#ffa500',
		 	start:50,
		 	end:120
		 },
		 {
		 	color:'#ffff00',
		 	start:120,
		 	end:200
		 },
		{
			color:'#00ff00',
			start:200,
			end:230
		},
		{
			color:'#0000ff',
			start:230,
			end:250
		},
		{
			color:'#4b0082',
			start:250,
			end:300
		},
        {
			color:'#ee82ee',
			start:300,
			end:360
		}
      ]
    },
	size: {
	    type: Number,
	    default: 606
	},
	rotateDeg:{
		tyep:Number,
		default:0
	},
	maskFlag:{
		type:Boolean,
		default:false
	}
  },
  data() {
	return{
		currentColor:'',
	}
  },
  computed: {
	// 动态计算环宽（等比缩放）
	ringWidth() {
	    return (this.size * 100) / 606;  // 100/740 是原环宽比例
	},
	// 动态计算内环尺寸（等比缩放）
	innerSize() {
	    // return (this.size * 343) / 606;  // 540/740 是原内环比例
		return (this.size * 300) / 606;
	},
    // 生成圆锥渐变的颜色字符串，确保均匀分布
    gradientColors() {
      const colorCount = this.colors.length;
      return this.colors.map((item) => {
        // 计算每个颜色起始角度，让颜色区间均匀分布
        // const startAngle = (index / colorCount) * 360;
        // const endAngle = ((index + 1) / colorCount) * 360;
        return `${item.color} ${item.start}deg ${item.end}deg`;
      }).join(', ');
    },
	startOffset() {
		// 确保数组有数据
		if (this.colors.length === 0) return 0;
	      
		// 获取第一个颜色区间
		const firstColor = this.colors[0];
	      
		// 计算第一个区间的中心点角度
		const firstCenter = (firstColor.start + firstColor.end) / 2;
	      
		// 偏移量 = 目标位置(0°) - 实际中心点角度
		// 减90是因为大多数绘图系统中0°在右侧，但初始角度计算可能从顶部开始
		return 90-firstCenter;
	}
  }
};
</script>

<style scoped>
	.frame{
		position: relative;
		margin: 20rpx auto;
	}
	.ring-container {
		position: relative;
		/* width: 740rpx; */
		/* height: 740rpx; */	
		margin: 20rpx auto;
		z-index: 0;
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
			101% 36.6%, 101% -1%, -1% -1%, -1% 101%, /* 覆盖整个圆 101是为了删除最底部的蒙版未完全覆盖的问题*/
			101% 101%, /* 缺口起点（0度） */
			101% 63.4%, /* 缺口终点（30度） */
			50% 50% /* 闭合缺口 */
		);
	}
</style>