<template>
	<!-- 三维模型提示 -->
	<view class="tip-box" v-if="dimension == '3D'">
		<text class="text">
			点击色立体图像查看三维模型，可以自动显示色带在三维空间中的分视图，用户可以自选透视点、拖合、滑动实现对模型的操作。
		</text>
		<text class="know">✔ 明白了</text>
	</view>

	<!-- 二维模型选项 -->
	<view class="tip-box" v-if="dimension == '2D'">
		<view class="text-content">
			<image class="icon" src="/src/static/showcase/collection-info.png"></image>
			<text class="text">
				您可以选择LabCH色彩模型中任意2个维度生成二维平面图像
			</text>
		</view>
		<view class="button-group" v-if="button == 'button1'">
			<view 
			v-for="pair in dimPairs1" 
			:key="pair" 
			:class="['dim-button', selected2DB1.includes(pair) ? 'active' : '']"
			@tap="select2DB1(pair)">
				{{ pair }}
			</view>
		</view>
		<view class="button-group" v-if="button == 'button2'">
			<view 
			v-for="pair in dimPairs2" 
			:key="pair" 
			:class="['dim-button', selected2DB2.includes(pair) ? 'active' : '']"
			@tap="select2DB2(pair)">
				{{ pair }}
			</view>
		</view>
	</view>

	<!-- 一维模型选项 -->
	<view class="tip-box" v-if="dimension == '1D'">
		<view class="text-content">
			<image class="icon" src="/src/static/showcase/collection-info.png"></image>
			<text class="text">
				您可以选择LabCH色彩模型中任意1个维度生成带状或环状图像
			</text>
		</view>
		<view class="button-group">
			<view v-for="dim in dim1D" :key="dim" :class="['dim-button', selected1D === dim ? 'active' : '']"
				@tap="select1D(dim)">
				{{ dim }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dimension: {
				type: String,
				required: true,
			},
			button: {
				type: String,
				required: true,
			},
		},
		name: "InteractionTip",
		data() {
			return {
				selected1D: 'L',
				selected2DB1: ['LC','La'],
				selected2DB2: ['CH', 'LH'],
				dim1D: ['L', 'a', 'b', 'C', 'H'],
				dimPairs1: ['LC', 'ab', 'La', 'Lb'],
				dimPairs2: ['CH', 'LH']
			}
		},
		methods: {
			select1D(dim) {
				this.selected1D = dim;
				this.$emit('select1D', dim);
			},
			select2DB1(pair) {
				const index = this.selected2DB1.indexOf(pair);

				if (index >= 0) {
					// 已选中，取消选中
					if (this.selected2DB1.length <= 2) {
					    uni.showToast({
					        title: '请至少选择两个维度',
					        icon: 'none'
					    });
					    return;
					} else {
								this.selected2DB1.splice(index, 1);
					        }
				} else {
					// 选中项未超过两个
					if (this.selected2DB1.length < 2) {
						this.selected2DB1.push(pair);
					} else {
						// 替换最早选中的
						this.selected2DB1.splice(0, 1);
						this.selected2DB1.push(pair);
					}
				}
				this.$emit('select2D', [...this.selected2DB1]);
			},
			select2DB2(pair) {
				const index = this.selected2DB2.indexOf(pair);
				if (this.selected2DB2.length <= 2) {
					uni.showToast({
					    title: '请至少选择两个维度',
					    icon: 'none'
					});
					return;
				} 
			}
		}
	}
</script>

<style scoped>
	.tip-box {
		background: #fff6f0;
		padding: 20rpx;
		margin-top: 20rpx;
	}

	.title {
		margin-bottom: 24rpx;
		font-size: 20rpx;
		font-weight: 500;
	}
	
	.text-content{
		display: flex;
		flex-direction: row;
		align-items: center;  
	}
	
	.icon{
		height: 20rpx;
		width: 20rpx;
		margin-right: 10rpx;
	}

	.text {
		font-size: 20rpx;
		font-weight: 500;
		color: #666;
		line-height: 24rpx;
	}

	.know {
		display: block;
		margin-top: 10rpx;
		color: #576bff;
		font-size: 18rpx;
		text-decoration: underline;
		font-weight: 500;
	}

	.button-group {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-top: 20rpx;
	}

	.dim-button {
		padding: 15rpx 40rpx;
		border: 2rpx solid #d5916d;
		border-radius: 12rpx;
		font-size: 32rpx;
		background-color: #fff;
		color: #d5916d;
	}

	.active {
		background-color: #d5916d;
		border-color: #d5916d;
		color: #fff;
	}
</style>