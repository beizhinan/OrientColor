<template>
	<view>
		<view class="title">环状一维模型</view>
		<!-- 指向 -->
		<view class="box">
			<Rings class="ring"></Rings>
			<view class="trangle"></view>
		</view>
		
		<view class="content">
			<view class="color" :style="{backgroundColor: '#f9f4dc'}"></view>
			<view class="introduce">
				<view class="name">乳白</view>
				<view class="hex">#f9f4dc</view>
				<view class="download"></view>
			</view>
		</view>
		
		<!-- 当前位置 -->
		<view class="now">
			<Rings :size="190" :maskFlag="true" class="small"></Rings>
			<view class="words">当前位置</view>
		</view>
	</view>
</template>

<script setup>
	import Rings from "@/components/chart/ring.vue";
</script>

<style>
	.title{
		font-size: 34rpx;
		font-weight: bold;
		margin: 20rpx 0;
	}
	.box{
		height: 860rpx;
		width: 100%;
	}
	.ring{
		position: absolute;
		top:120rpx;
		left:-440rpx;
	}
	.trangle{
		position: absolute;
		top:470rpx;
		left:320rpx;
		height: 70rpx;
		width: 55rpx;
		/*background-image: url(@/static/1Dchart/trangle.png);*/
	}
	
	.content{
		position: absolute;
		top: 256rpx;
		right: 45rpx;
		height:320rpx;
		width: 300rpx;
		border:2rpx solid grey;
	}
	.color{
		width: 300rpx;
		height:175rpx;
	}
	.introduce{
		width: 300rpx;
		height:145rpx;
		text-align: center;
		background-color: white;
	}
	.name{
		font-size: 25rpx;
		font-weight: bold;
	}
	.hex{
		margin-bottom: 30rpx;
		font-size: 20rpx;
		color:#606060;
	}
	.download{
		width: 34rpx;
		height: 34rpx;
		margin: 0 auto;
		background-image: url(@/static/showcase/collection-download.png);
		background-size: cover; /* 图片会被缩放以完全覆盖容器 */
		background-position: center; /* 图片居中显示 */
		background-repeat: no-repeat; /* 防止图片重复 */
	}
	
	.now{
		position: absolute;
		top: 620rpx;
		right: 45rpx;
		width: 300rpx;
		height: 260rpx;
		border-radius: 20rpx;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.small{
		margin: 22rpx auto 10rpx;
	}
	.words{
		font-size: 20rpx;
		text-align: center;
		line-height: 20rpx;
		color:white;
	}
</style>