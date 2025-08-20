<template>
	<view :style="{width:'100%'}">
		<view class="title">环状一维模型</view>
		<!-- 指向 -->
		<view class="box">
			<Rings class="ring"
			@touchstart="handleTouchStart"
			@touchmove="handleTouchMove"
			@touchend="handleTouchEnd"
			:rotateDeg="rotateDeg"
			:colors="data"></Rings>
			<view class="rotate">H {{rotateH}}°</view>
			<view class="trangle"></view>
		</view>
		
		<view class="content">
			<view class="color" :style="{backgroundColor: currentColor}"></view>
			<view class="introduce">
				<view class="name">{{currentColorName}}</view>
				<view class="hex">{{currentColor}}</view>
				<view class="download" @tap="saveSolidImage"></view>
				<canvas canvas-id="solidCanvas" style="width: 100px; height: 100px; position: absolute; left: -9999px;" />
			</view>
		</view>
		
		<!-- 当前位置 -->
		<view class="now">
			<Rings :size="155" 
			:maskFlag="true" 
			class="small"
			:rotateDeg="rotateDeg"
			:colors="data"></Rings>
			<view class="words">当前位置</view>
		</view>
	</view>
</template>

<script>
	import Rings from "@/components/chart/ring.vue";
	export default{
		data(){
			return{
				rotateDeg: 0, // 圆环旋转角度
				startY: 0, // 记录触摸开始时的 Y 坐标
				isMoving: false ,// 是否正在滑动
				rotateH:0,
				rotate:0,//用于判断颜色
				currentColor:'#f9f4dc',
				currentColorName:'乳白',
				originDeg:0,
				data:[
					{
						name:'乳白',
						color:'#f9f4dc',
						start:0,
						end:20
					},
					{
						name:'红色',
						color:'#ff0000',
						start:20,
						end:50
					},
					 {
						name:'橙色',
					 	color:'#ffa500',
					 	start:50,
					 	end:120
					 },
					 {
						name:'浅黄色',
					 	color:'#ffff00',
					 	start:120,
					 	end:200
					 },
					{
						name:'青色',
						color:'#00ff00',
						start:200,
						end:230
					},
					{
						name:'宝蓝色',
						color:'#0000ff',
						start:230,
						end:250
					},
					{
						name:'紫色',
						color:'#4b0082',
						start:250,
						end:300
					},
					{
						name:'浅洋红色',
						color:'#ee82ee',
						start:300,
						end:360
					}
				]
			};
		},
		created(){
			this.originDeg = (this.data[0].end-this.data[0].start)/2
			this.rotateH=this.originDeg
			console.log(this.originDeg)
		},
		methods: {
			// 触摸开始：记录初始位置
			handleTouchStart(e) {
			    this.isMoving = true
			    // 获取触摸点的初始 Y 坐标（兼容多指，取第一个触摸点）
			    this.startY = e.touches[0].clientY
			},
			
			
			// 触摸滑动：计算滑动距离并改变数值
			handleTouchMove(e) {
			    if (!this.isMoving) return
			      
			    // 获取当前触摸点的 Y 坐标
			    const currentY = e.touches[0].clientY
			    // 计算滑动距离（向上滑动为负，向下滑动为正）
			    const diff = this.startY - currentY
			      
			    // 滑动距离超过 5px 才触发数值变化（防抖动）
			    if (Math.abs(diff) > 5) {
					// 向上滑动（diff 为正）增加数值，向下滑动（diff 为负）减少数值
					const tmp = (this.rotateDeg - diff * 0.1)
					this.rotateDeg = tmp % 360
					this.rotateH = (((this.rotateDeg>=0?this.rotateDeg:360+this.rotateDeg)+this.originDeg)%360).toFixed(1)
					this.rotate=(this.originDeg-tmp+360) % 360
					const currentRange = this.data.find(range => {
					  // 检查角度是否在[start, end)范围内（前闭后开，适应区间衔接）
					  return this.rotate >= range.start && this.rotate < range.end
					});
					this.currentColor=currentRange.color
					this.currentColorName=currentRange.name
					// 更新初始位置，确保滑动过程中持续变化
					this.startY = currentY
					
					//console.log(this.rotate,tmp,this.rotateDeg,this.originDeg)
			    }
			},
			    
			// 触摸结束：重置状态
			handleTouchEnd() {
				this.isMoving = false
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
			}
		},
		components:{
			Rings
		}
	}
</script>

<style>
	.title{
		width: 100%;
		font-size: 34rpx;
		font-weight: bold;
		margin: 16rpx auto;
		text-align: center;
		color:#9f7735;
	}
	.box{
		height: 700rpx;
		width: 100%;
	}
	.ring{
		position: absolute;
		top:100rpx;
		left:-360rpx;
	}
	.rotate{
		position: absolute;
		top:360rpx;
		left:275rpx;
		color: #5a3d2e;
		width: 125rpx;
		height: 25rpx;
		font-size: 25rpx;
		line-height: 25rpx;
		text-align: center;
		font-weight: bold;
	}
	.trangle{
		position: absolute;
		top:385rpx;
		left:300rpx;
		height: 75rpx;
		width: 55rpx;
		background-image: url(@/static/1Dchart/trangle.png);
	}
	
	.content{
		position: absolute;
		top: 150rpx;
		right: 45rpx;
		height:320rpx;
		width: 300rpx;
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
		top: 510rpx;
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