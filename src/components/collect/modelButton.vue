<template>
	<view class="model">
		<slot></slot>
	</view>
</template>

<script>
</script>

<style>
	.model{
		height: 80rpx;
		width: 142rpx;
		border-radius: 40rpx;
		border:1rpx solid #c69c6d;
		line-height: 80rpx;
		text-align: center;
		color:#c69c6d;
	}
	.model:hover{
		background-color: #c69c6d;
		color:white;
		cursor: pointer;
	}
</style>