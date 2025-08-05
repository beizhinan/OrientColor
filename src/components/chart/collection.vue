<template>
	<!-- 交互规则 -->
	<view class="rule" v-if="!showDetail">
		<image class="tips-icon" src="/src/static/showcase/collection-info.png"></image>
		<text class="tips-title">交互规则</text>
		<text class="tips">双指滑动可对模型进行缩放，点击某一色块可查看细节</text>
	</view>
	<!-- 色彩详情 -->
	<view class="detail" v-if="showDetail">
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

	<!-- 色谱名称与介绍 -->
	<view class="info">
		<view class="collect-num">23人收藏</view>
		<text class="title">色谱名字</text>
		<text class="desc">色谱介绍一大段介绍很多介绍色谱介绍一大段介绍很多介绍色谱介绍一大段介绍很多介绍色谱介绍一大段介绍很多介绍色谱介绍一大段介绍很多介绍色谱介绍一大段介绍很多介绍</text>
		<view class="buttons">
			<button class="collect-btn" @click="startCollect">收藏色谱</button>
			<button class="back-btn" @click="backShowcase">重新筛选</button>
		</view>
		
	</view>

	<!-- 收藏弹窗 -->
	<view class="popup" v-if="showPopup">
		<view class="popup-overlay" @tap="closePopup"></view>
		<view class="popup-content">
			<text class="popup-title">添加到收藏夹</text>
			<view class="folder-list">
				<view class="folder" :class="{ active: selectedIndex === index }" v-for="(item, index) in folders"
					:key="index" @tap="selectFolder(index)">
					<image class="icon" :src="item.icon" />
					<text class="folder-name">{{ item.name }}</text>
					<text class="folder-num">{{ item.count }}项</text>
				</view>
				<view class="folder-add" @tap="addFolder" v-if="folders.length < 3">
					<image class="icon" src="/static/showcase/collection-add.png" />
					<view class="space"></view>
					<text class="folder-name">添加收藏夹</text>
				</view>
			</view>
			<button class="save-btn" @click="saveToFolder">保存</button>
		</view>
	</view>

	<!-- 添加收藏弹窗 -->
	<view class="popup" v-if="showCreatePopup">
		<view class="popup-content">
			<text class="popup-back" @tap="closeCreatePopup">{{'<'}}返回</text>
			<text class="popup-title add-title">新建收藏夹</text>
			<text class="popup-tip">收藏夹名称</text>
			<input class="folder-input" type="text" v-model="newFolderName" maxlength="10"
				placeholder="输入收藏夹名称，不多于10个字" />
			<button class="save-btn add-btn" @click="createFolder">完成</button>
		</view>
	</view>
</template>

<script>
	export default {
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
				showPopup: false,
				selectedIndex: null,
				showCreatePopup: false,
				newFolderName: '',
				folders: [{
						name: '收藏夹1',
						count: 20,
						icon: '/static/showcase/filter-icon.png'
					},
					{
						name: '收藏夹2',
						count: 20,
						icon: '/static/showcase/filter-icon.png'
					}
				]
			}
		},
		methods: {
			startCollect() {
				this.showPopup = true
				this.$emit("received", false)
			},
			closePopup() {
				this.showPopup = false
				this.$emit("received", true);
			},
			selectFolder(index) {
				this.selectedIndex = index;
			},
			closeCreatePopup() {
				this.showCreatePopup = false
			},
			saveToFolder() {
				if (this.selectedIndex !== null) {
					uni.showToast({
						title: '收藏成功',
						icon: 'success'
					});
					this.showPopup = false;
				} else {
					uni.showToast({
						title: '请选择收藏夹',
						icon: 'none'
					});
				}
			},
			addFolder() {
				this.newFolderName = '';
				this.showCreatePopup = true;
			},
			createFolder() {
				const name = this.newFolderName.trim();
				if (!name) {
					uni.showToast({
						title: '名称不能为空',
						icon: 'none'
					});
					return;
				}
				if (name.length > 10) {
					uni.showToast({
						title: '最多10个字',
						icon: 'none'
					});
					return;
				}
				this.folders.push({
					name,
					count: 0,
					icon: '/static/showcase/filter-icon.png'
				});
				this.showCreatePopup = false;
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
			},
			goToColorblock(){
				uni.navigateTo({
					url: `/pages/colorblock/colorblock`
				})
			}
		}
	}
</script>

<style>
	.tips-icon {
		height: 20rpx;
		width: 20rpx;
	}

	.tips-title {
		font-weight: 500;
		font-size: 20rpx;
	}

	.tips {
		font-size: 17.4rpx;
		color: #666;
		display: block;
		margin-top: 10rpx;
	}

	.detail {
		width: 100%;
		height: 96rpx;
		border-radius: 16rpx;
		box-shadow: 2rpx 4rpx 20rpx rgba(0, 0, 0, 0.1);
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.detail-flex {
		display: flex;
		align-items: center;
		height: 100%;
	}

	.circle {
		width: 200rpx;
		height: 100%;
		margin-right: 20rpx;
	}

	.detail-name {
		font-size: 26rpx;
		font-weight: 600;
		margin-right: 20rpx;
	}

	.detail-code {
		font-size: 24rpx;
		font-weight: 300;
	}

	.download {
		display: block;
		height: 36rpx;
		width: 36rpx;
		margin-right: 20rpx;
	}

	.info {
		margin-top: 60rpx;
		position: relative;
	}

	.collect-num {
		position: absolute;
		top: 14rpx;
		right: 0rpx;
		font-size: 24rpx;
		font-weight: bold;
		color: #666;
	}

	.title {
		font-weight: bold;
		font-size: 32rpx;
	}

	.desc {
		display: block;
		color: #666;
		font-size: 24rpx;
		margin-top: 20rpx;
	}
	
	.buttons{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40rpx;
		gap: 30rpx;
	}

	.collect-btn {
		padding: 5rpx 50rpx;
		font-size: 26rpx;
		border-radius: 38rpx;
		background-color: #deb67f;
		color: #fff;
		border: none;
	}
	
	.back-btn{
		padding: 5rpx 50rpx;
		font-size: 26rpx;
		border-radius: 38rpx;
		background-color: #ffffff;
		color: #deb67f;
		border: 2rpx solid #deb67f;
	}

	.popup {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		top: 0;
		z-index: 1000;
	}

	.popup-overlay {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(239, 239, 239, 0.5);
	}

	.popup-content {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fdf1e8;
		padding: 30rpx;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}

	.popup-title {
		font-size: 32rpx;
		font-weight: 600;
		margin-top: 20rpx;
	}

	.folder-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 20rpx;
		margin-top: 20rpx;
		margin-bottom: 150rpx;
	}

	.folder {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 24%;
		padding: 20rpx;
		text-align: center;
		border-radius: 20rpx;
		border-color: #ffffff;
		background-color: #ffffff;
		border: 2rpx solid #ddd;
	}

	.folder.active {
		border-color: #c69c6d;
	}

	.icon {
		width: 80rpx;
		height: 80rpx;
	}

	.space {
		margin-top: 20rpx;
	}

	.folder-name {
		font-size: 26rpx;
		color: #151515;
	}

	.folder-num {
		font-size: 26rpx;
		color: #666;
	}

	.folder-add {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 24%;
		padding: 20rpx;
		text-align: center;
		border-radius: 20rpx;
		border: 2rpx solid #c69c6d;
	}

	.save-btn {
		margin-top: 30rpx;
		width: 144rpx;
		background-color: #c69c6d;
		font-size: 30rpx;
		color: #fff;
		border-radius: 200rpx;
	}

	.add-btn {
		background-color: #3c3c43;
	}

	.add-popup-content {
		position: relative;
		width: 80%;
		height: 30%;
		padding: 40rpx;
		z-index: 1001;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.popup-back {
		position: absolute;
		top: 40rpx;
		left: 40rpx;
		font-size: 26rpx;
		font-weight: 500;
	}

	.add-title {
		display: flex;
		justify-content: center;
	}

	.popup-tip {
		display: block;
		font-size: 30rpx;
		font-weight: 600;
		margin-top: 60rpx;
	}

	.folder-input {
		padding: 20rpx;
		font-size: 24rpx;
		border: 1px solid #e7e7e7;
		border-radius: 20rpx;
		background-color: #e7e7e7;
		margin-top: 30rpx;
		margin-bottom: 120rpx;
	}
</style>