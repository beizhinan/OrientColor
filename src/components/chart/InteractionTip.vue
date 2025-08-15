<template>
	<!-- 二维模型选项 -->
	<view class="tip-box" v-if="dimension == '2D'">
		<view class="text-content">
			<image class="icon" src="/src/static/showcase/collection-info.png"></image>
			<text class="text">
				您可以选择LabCH色彩模型中任意2个维度生成二维平面图像散点图横轴及纵轴为维度组合，点击某一色块可查看细节
			</text>
		</view>
		<view class="button-group" v-if="button == 'button1'">
			<view 
			v-for="dim in dimPairs1" 
			:key="dim" 
			:class="['dim-button', selected2DB1 === dim ? 'active' : '']"
			@tap="select2DB1(dim)">
				{{ dim }}
			</view>
		</view>
		<view class="button-group" v-if="button == 'button2'">
			<view 
			v-for="dim in dimPairs2" 
			:key="dim" 
			:class="['dim-button', selected2DB2 === dim ? 'active' : '']"
			@tap="select2DB2(dim)">
				{{ dim }}
			</view>
		</view>
	</view>

	<!-- 一维模型选项 -->
	<view class="tip-box" v-if="dimension == '1D'">
		<view class="text-content">
			<image class="icon" src="/src/static/showcase/collection-info.png"></image>
			<text class="text" v-if="button == 'button1'">
				您可以选择LabC色彩模型中任意1个维度生成带状图像，点击具体色块查看详情
			</text>
			<text class="text" v-if="button == 'button2'">
				您可以选择H色彩模型中生成环状图像，滑动圆环查看详情
			</text>
		</view>
		<view class="button-group" v-if="button == 'button1'">
			<view 
			v-for="dim in dim1D" 
			:key="dim" 
			:class="['dim-button', selected1D === dim ? 'active' : '']"
			@tap="select1D(dim)">
				{{ dim }}
			</view>
		</view>
		<view class="button-group" v-if="button == 'button2'">
			<view
			v-for="dim in dim1DB2" 
			:key="dim" 
			:class="['dim-button', selected1DB2 === dim ? 'active' : '']">
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
				selected1DB2: 'H',
				selected2DB1: 'LC',
				selected2DB2: 'CH',
				dim1D: ['L', 'a', 'b', 'C'],
				dim1DB2: ['H'],
				dimPairs1: ['LC', 'ab', 'La', 'Lb'],
				dimPairs2: ['CH', 'LH']
			}
		},
		methods: {
			select1D(dim) {
				this.selected1D = dim;
				this.$emit('select1D', dim);
			},
			select2DB1(dim) {
				this.selected2DB1 = dim
				this.$emit('select2DRect', dim);
			},
			select2DB2(dim) {
				this.selected2DB2 = dim
				this.$emit('select2DPolar', dim);
			}
		}
	}
</script>

<style scoped>
	.tip-box {
		width: 666rpx;
		height: 192rpx;
		background-image: url(/static/showcase/interaction-background.png);
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		padding: 20rpx;
		margin-top: 20rpx;
		display: flex;           
		flex-direction: column;  
		align-items: center;      
		justify-content: center;  
		box-sizing: border-box;
	}

	.text-content{
		display: flex;
		flex-direction: row;
		align-items: center;  
		padding: 0 30rpx;
	}
	
	.icon{
		height: 20rpx;
		width: 20rpx;
		margin-right: 10rpx;
		flex-shrink: 0;  
	}

	.text {
		font-size: 20rpx;
		font-weight: 500;
		color: #333843;
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
		justify-content: center;  
		width: 100%;  
	}

	.dim-button {
		padding: 15rpx 40rpx;
		border-radius: 12rpx;
		font-size: 32rpx;
		background-color: #fff;
		color: #8e8e93;
		box-shadow: 0 0 8rpx rgba(129, 72, 72, 0.21);
	}

	.active {
		color: #ed6e00;
	}
</style>