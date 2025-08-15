<template>
	<view>
		<view class="title">带状一维模型</view>
		<view class="box">
			<view class="band">
				<view class="axis"></view>
				<view class="block" v-for="(item,index) in color"
				:key=index
				:style="{backgroundColor:item, top: `calc(0px + ${index * 86}rpx)` }"
				@click="changeColor(index)">
				</view>
			</view>
			<view class="content">
				<view class="color" :style="{backgroundColor: currentColor}"></view>
				<view class="introduce">
					<view class="name">乳白</view>
					<view class="hex">{{currentColor}}c</view>
					<view class="download" @tap="saveSolidImage"></view>
					<!-- 隐藏的画布，用于绘图 -->
					<canvas canvas-id="solidCanvas" style="width: 100px; height: 100px; position: absolute; left: -9999px;" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props: {
			colorName: {
				type: String,
				required: true,
			},
			colorCode: {
				type: String,
				required: true,
			},
			showDetail: {
				type: Boolean,
				required: true,
			}
		},
		data() {
			return {
				color:['#fb721d','#fb9724','#f5c132','#cdd03a','#63bf46','#1da672','#0e8ab7','#1170c2','#4854b8','#af38a1'],
				currentColor:'#f9f4dc',
			}
		},
		methods:{
			changeColor(index){
				this.currentColor = this.color[index]
			},
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
			backShowcase() {
			    // 返回上一级页面
			    uni.navigateBack({
			    delta: 1
			    });
			}
		}
	}
</script>

<style>
	.title{
		font-size: 34rpx;
		font-weight: bold;
		margin: 20rpx 0;
	}
	.box{
		position: relative;
		height: 860rpx;
		width: 100%;
		background-color: aliceblue;
	}
	.band{
		position: relative;
	}
	.axis{
		height: 860rpx;
		width: 108rpx;
		background-image: url(@/static/1Dchart/H-zhou.png);
	}
	.block{
		position: absolute;
		left:108rpx;
		top:0;
		height:86rpx;
		width: 180rpx;
	}
	.content{
		position: absolute;
		top:0;
		right: 0rpx;
		height:600rpx;
		width: 300rpx;
	}
	.color{
		width: 100%;
		height:275rpx;
	}
	.introduce{
		width: 100%;
		height:325rpx;
		padding-top: 40rpx;
		text-align: center;
		background-color: white;
	}
	.name{
		font-size: 25rpx;
		margin-bottom: 16rpx;
		font-weight: bold;
	}
	.hex{
		margin-bottom: 70rpx;
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
</style>