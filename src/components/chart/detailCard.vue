<template>
	<!-- 色立体样式 -->
	<view class="detail-3d" v-if="cardStyle === '3d'">
		<view class="detail-flex">
			<view class="circle" :style="{ backgroundColor: colorCode }" @tap="goToColorblock"></view>
			<text class="detail-name">{{ colorName }}</text>
			<text class="detail-code">{{ colorCode }}</text>
		</view>
		<view class="detail-icon">
			<image class="download" src="/src/static/showcase/collection-download.png" @tap="saveSolidImage"></image>
			<!-- 隐藏的画布，用于绘图 -->
			<canvas canvas-id="solidCanvas" style="width: 100px; height: 100px; position: absolute; left: -9999px;" />
		</view>
	</view>
	<!-- 二维样式 -->
	<view class="detail-2d" v-if="cardStyle === '2d'">
		<view class="detail-flex">
			<view class="circle-2d" :style="{ backgroundColor: colorCode }" @tap="goToColorblock"></view>
			<text class="detail-name">{{ colorName }}</text>
			<text class="detail-code">{{ colorCode }}</text>
		</view>
		<view class="detail-icon">
			<image class="download" src="/src/static/showcase/collection-download.png" @tap="saveSolidImage"></image>
			<!-- 隐藏的画布，用于绘图 -->
			<canvas canvas-id="solidCanvas" style="width: 100px; height: 100px; position: absolute; left: -9999px;" />
		</view>
	</view>
	<!-- 一维带状样式 -->
	<view class="detail-1d" v-if="cardStyle === '1dRect'">
		<view class="detail-flex-1d">
			<view class="circle-1d" :style="{ backgroundColor: colorCode }" @tap="goToColorblock"></view>
			<text class="detail-name-1d">{{ colorName }}</text>
			<text class="detail-code">{{ colorCode }}</text>
		</view>
		<view class="detail-icon">
			<image class="download-1d" src="/src/static/showcase/collection-download.png" @tap="saveSolidImage"></image>
			<!-- 隐藏的画布，用于绘图 -->
			<canvas canvas-id="solidCanvas" style="width: 100px; height: 100px; position: absolute; left: -9999px;" />
		</view>
	</view>
	<!-- 一维环状样式 -->
	<view class="detail-1d polar" v-if="cardStyle === '1dPolar'">
		<view class="detail-flex-1d">
			<view class="circle-1d polar-c" :style="{ backgroundColor: colorCode }" @tap="goToColorblock"></view>
			<text class="detail-name-1d polar-n">{{ colorName }}</text>
			<text class="detail-code">{{ colorCode }}</text>
		</view>
		<view class="detail-icon">
			<image class="download-1d polar-d" src="/src/static/showcase/collection-download.png" @tap="saveSolidImage"></image>
			<!-- 隐藏的画布，用于绘图 -->
			<canvas canvas-id="solidCanvas" style="width: 100px; height: 100px; position: absolute; left: -9999px;" />
		</view>
	</view>

</template>

<script>
	export default {
		name: "detailCard",
		props: {
			colorName: {
				type: String,
				required: true,
			},
			colorCode: {
				type: String,
				required: true,
			},
			cardStyle: {
				type: String,
				required: true,
			}
		},
		data() {
			return {

			};
		},
		methods: {
			//保存图片到相册
			saveSolidImage() {
				// 创建 canvas 上下文
				const ctx = uni.createCanvasContext('solidCanvas', this);

				// 设置背景为纯色，比如白色或红色
				ctx.setFillStyle(this.colorCode);
				ctx.fillRect(0, 0, 1200, 2600); // 1200x2600 尺寸
				ctx.draw(false, () => {
					// 绘制完成后导出图片
					uni.canvasToTempFilePath({
						canvasId: 'solidCanvas',
						success: res => {
							const filePath = res.tempFilePath;
							// 保存图片到手机相册
							uni.saveImageToPhotosAlbum({
								filePath,
								success: () => {
									uni.showToast({
										title: '保存成功',
										icon: 'success'
									});
								},
								fail: err => {
									if (err.errMsg.includes('auth deny') || err.errMsg
										.includes('auth denied')) {
										uni.showModal({
											title: '提示',
											content: '需要授权保存图片到相册',
											success: modalRes => {
												if (modalRes.confirm) {
													uni
														.openSetting(); // 打开授权设置页
												}
											}
										});
									} else {
										uni.showToast({
											title: '保存失败',
											icon: 'none'
										});
									}
								}
							});
						},
						fail: err => {
							console.error('canvasToTempFilePath 失败', err);
						}
					}, this); // 注意 this 作用域
				});
			},
			goToColorblock() {
				this.$emit('hideChart', false)
				uni.navigateTo({
					url: `/pages/colorblock/colorblock`,
					//url: `/pages/colorblock/colorblock?name=${selectedColor.value.name}&code=${selectedColor.value.code}`
				})
			}
		}
	}
</script>

<style>
	.detail-3d {
		width: 100%;
		height: 96rpx;
		border-radius: 16rpx;
		box-shadow: 2rpx 4rpx 20rpx rgba(0, 0, 0, 0.1);
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.detail-2d{
		width: 610rpx;
		height: 194rpx;
		border-radius: 24rpx;
		border: 2rpx solid #dedede;
		background-color: #fff;
		padding: 12rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.detail-1d{
		width: 300rpx;
		height: 600rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 2rpx 4rpx 20rpx rgba(0, 0, 0, 0.1);
		background-color: #fff;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	
	.polar{
		height: 400rpx;
		width:calc(300rpx - 48rpx);
		border-radius: 24rpx 24rpx 0 0;
	}

	.detail-flex {
		display: flex;
		align-items: center;
		height: 100%;
	}
	
	.detail-flex-1d {
		display: flex;
		align-items: center;
		flex-direction: column;
		height: 100%;
	}

	.circle {
		width: 200rpx;
		height: 100%;
		margin-right: 20rpx;
	}
	
	.circle-2d{
		width: 190rpx;
		height: 190rpx;
		border-radius: 16rpx;
		margin-right: 20rpx;
	}
	
	.circle-1d{
		width: 300rpx;
		height: 280rpx;
		margin-bottom: 40rpx;
		border-radius: 20rpx;
	}
	
	.polar-c{
		width: 260rpx;
		height: 200rpx;
		margin-bottom: 10rpx;
	}

	.detail-name {
		font-size: 26rpx;
		font-weight: 600;
		margin-right: 20rpx;
		color: #5a3d2e;
	}
	
	.detail-name-1d {
		font-size: 26rpx;
		font-weight: 600;
		margin-bottom: 20rpx;
		color: #5a3d2e;
	}
	
	.polar-n{
		margin-top: 10rpx;
		margin-bottom: 4rpx;
	}

	.detail-code {
		font-size: 24rpx;
		font-weight: 300;
		color: #5a3d2e;
	}

	.download {
		display: block;
		height: 36rpx;
		width: 36rpx;
		margin-right: 20rpx;
	}
	
	.download-1d {
		display: block;
		height: 36rpx;
		width: 36rpx;
		margin-bottom: 100rpx;
	}
	
	.polar-d{
		margin-bottom: 20rpx;
	}

</style>