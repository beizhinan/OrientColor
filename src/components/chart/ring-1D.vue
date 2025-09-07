<template>
	<view :style="{width:'100%'}">
		<!--<view class="title">环状一维模型</view>-->
		<!-- 指向 -->
		<view class="box">
			<Rings class="ring" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
				:rotateDeg="rotateDeg" :colors="ringData" :size="750"></Rings>
			<view class="rotate-text">
				<view class="rotate-row">
					<view class="rotate">H</view>
					<view class="rotate angle">{{rotateH}}°</view>
				</view>
				<view class="trangle"></view>
			</view>
		</view>

		<!--  view class="content">
			<view class="color" :style="{backgroundColor: currentColor}"></view>
			<view class="introduce">
				<view class="name">{{currentColorName}}</view>
				<view class="hex">{{currentColor}}</view>
				<view class="download" @tap="saveSolidImage"></view>
				<canvas canvas-id="solidCanvas" style="width: 100px; height: 100px; position: absolute; left: -9999px;" />
			</view>
		</view -->

		<!-- 当前位置 -->
		<view class="now">
			<Rings :size="240" :maskFlag="true" class="small" :rotateDeg="rotateDeg" :colors="ringData"></Rings>
			<view class="words">当前位置</view>
		</view>
	</view>
</template>

<script>
	import Rings from "@/components/chart/ring.vue";
	export default {
		props: {
			colorPoints: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				rotateDeg: 0, // 圆环旋转角度
				startY: 0, // 记录触摸开始时的 Y 坐标
				isMoving: false, // 是否正在滑动
				rotateH: 0,
				rotate: 0, //用于判断颜色
				currentColor: '',
				currentColorName: '',
				originDeg: 0,
				ringData: [] // 转换后的圆环绘制数据
				/*data:[
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
				]*/
			};
		},
		created() {
			//this.initRingData();     //有空缺
			this.initOrderedRingData() //无空缺
		},
		methods: {
			// 初始化环形数据(按度数位置显示)
			initRingData() {
				if (!this.colorPoints.length) return;

				// 划分总块数（数据量 * 1.2）
				const totalBlocks = Math.ceil(this.colorPoints.length * 1.2);
				const step = 360 / totalBlocks;

				const ranges = [];
				for (let i = 0; i < totalBlocks; i++) {
					const start = i * step;
					const end = (i + 1) * step;

					// 找到这个块中心角度对应的 H 值
					const midH = (start + end) / 2;

					// 查找是否有接近的颜色点（允许 0.5*step 范围内算是该块的颜色）
					const match = this.colorPoints.find(c => {
						let d = Math.abs(c.H - midH);
						if (d > 180) d = 360 - d; // H 环状差值
						return d <= step / 2;
					});

					if (match) {
						ranges.push({
							name: match.name,
							color: match.code,
							start,
							end,
							H: Math.round(match.H),
							origin: match
						});
					} else {
						ranges.push({
							name: null,
							color: '#ccc',
							start,
							end,
							H: Math.round(midH) % 360,
							origin: null
						});
					}
				}

				this.ringData = ranges;

				// 初始指向第一个块的 H 值
				this.originDeg = this.ringData[0].H;
				this.rotateH = this.originDeg;
			},
			
			// 按 H 值顺序生成环形数据
			initOrderedRingData() {
				if (!this.colorPoints.length) return;
			
				// 按 H 值排序
				const sortedPoints = [...this.colorPoints].sort((a, b) => a.H - b.H);
			
				const total = sortedPoints.length;
				const step = 360 / total;
			
				const ranges = [];
				for (let i = 0; i < total; i++) {
					const start = i * step;
					const end = (i + 1) * step;
					const point = sortedPoints[i];
			
					ranges.push({
						name: point.name,
						color: point.code,
						start,
						end,
						H: Math.round(point.H),
						origin: point
					});
				}
			
				this.ringData = ranges;
			
				// 初始指向第一个色块
				this.originDeg = this.ringData[0].H;
				this.rotateH = this.originDeg;
				this.currentColor = this.ringData[0].origin.code;
				this.currentColorName = this.ringData[0].origin.name;
			},

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
					/*const tmp = (this.rotateDeg - diff * 0.1)
					this.rotateDeg = tmp % 360
					this.rotateH = (((this.rotateDeg >= 0 ? this.rotateDeg : 360 + this.rotateDeg) + this.originDeg) % 360)
						.toFixed(1)
					this.rotate = (this.originDeg - tmp + 360) % 360
					const currentRange = this.ringData.find(range => {
						// 检查角度是否在[start, end)范围内（前闭后开，适应区间衔接）
						return this.rotate >= range.start && this.rotate < range.end
					});*/
					
					this.rotateDeg = (this.rotateDeg - diff * 0.1) % 360;
					const pointerAngle = (360 - this.rotateDeg) % 360;
					// 找到对应块
					const currentRange = this.ringData.find(range =>
					    pointerAngle >= range.start && pointerAngle < range.end
					);
					if (currentRange.name) {
						this.rotateH = currentRange.origin.H;
						this.currentColor = currentRange.origin.code;
						this.currentColorName = currentRange.origin.name;
					} else {
						this.rotateH = currentRange.H;
					}
					this.selectColor()
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
			},
			// 将选中颜色传给父类
			selectColor() {
				const colorData = [this.currentColorName, this.currentColor];
				this.$emit('selectColor', colorData);
			},
		},
		components: {
			Rings
		}
	}
</script>

<style>
	.title {
		width: 100%;
		font-size: 34rpx;
		font-weight: bold;
		margin: 16rpx auto;
		text-align: center;
		color: #9f7735;
	}

	.box {
		height: 800rpx;
		width: 100%;
	}

	.ring {
		position: absolute;
		top: 130rpx;
		left: -450rpx;
	}
	
	.rotate-text{
		position: absolute;
		top: 420rpx;
		left: 310rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.rotate-row {
		display: flex;
		flex-direction: row;  
		align-items: center;
		gap: 5rpx;            
	}

	.rotate {
		color: #5a3d2e;
		font-size: 34rpx;
		line-height: 25rpx;
		text-align: center;
		font-weight: bold;
	}
	
	.angle{
		font-size: 24rpx;
	}

	.trangle {
		width: 0;
		height: 0;
		border-top: 40rpx solid transparent;  
		border-bottom: 40rpx solid transparent; 
		border-right: 80rpx solid #5a3d2e;
	}

	.content {
		position: absolute;
		top: 150rpx;
		right: 45rpx;
		height: 320rpx;
		width: 300rpx;
	}

	.color {
		width: 300rpx;
		height: 175rpx;
	}

	.introduce {
		width: 300rpx;
		height: 145rpx;
		text-align: center;
		background-color: white;
	}

	.name {
		font-size: 25rpx;
		font-weight: bold;
	}

	.hex {
		margin-bottom: 30rpx;
		font-size: 20rpx;
		color: #606060;
	}

	.download {
		width: 34rpx;
		height: 34rpx;
		margin: 0 auto;
		background-image: url(@/static/showcase/collection-download.png);
		background-size: cover;
		/* 图片会被缩放以完全覆盖容器 */
		background-position: center;
		/* 图片居中显示 */
		background-repeat: no-repeat;
		/* 防止图片重复 */
	}

	.now {
		position: absolute;
		top: 560rpx;
		right: 40rpx;
		width: 300rpx;
		height: 350rpx;
		border-radius: 0 0 24rpx 24rpx;
		background-color: rgba(0, 0, 0, 0.5);
		padding-top: 40rpx;
	}

	.small {
		margin: 22rpx auto 10rpx;
	}

	.words {
		font-size: 20rpx;
		text-align: center;
		line-height: 20rpx;
		color: white;
	}
</style>