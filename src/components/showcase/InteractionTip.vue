<template>
	<view class="tip-box">
		<text class="title">① 交互规则</text>
		<text class="text">
			点击色立体图像查看三维模型，可以自动显示色带在三维空间中的分视图，用户可以自选透视点、拖合、滑动实现对模型的操作。
		</text>
		<text class="know">✔ 明白了</text>
	</view>
</template>

<script>
	export default {
		name: "InteractionTip",
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

	.text {
		display: block;
		font-size: 18rpx;
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
</style>