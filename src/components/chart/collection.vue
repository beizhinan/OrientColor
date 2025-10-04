<template>
	<view class="container">
		<!-- 收藏按钮 -->
		<view class="buttons">
				<button class="collect-btn" @click="startCollect">收藏色谱</button>
				<button class="back-btn" @click="backShowcase">重新筛选</button>
		</view>

		<!-- 收藏弹窗 -->
		<view class="popup" v-if="showPopup">
			<view class="popup-overlay" @tap="closePopup"></view>
			<view class="popup-content">
				<text class="popup-title">添加到收藏夹</text>
				<view class="folder-list">
					<view class="folder" :class="{ active: selectedIndex === index }" v-for="(item, index) in folders"
						:key="index" @tap="selectFolder(index)">
						<view class="header"></view>
						<text class="folder-name">{{ item.name }}</text>
						<text class="folder-num">{{ item.colorCard.length }}项</text>
					</view>
					<view class="folder-add" @tap="addFolder">
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
	</view>
</template>

<script>
	import { useCollectedStore } from '../../stores/collectionStore'
	
	const collectionStore = useCollectedStore()
	
	export default {
		data() {
			return {
				showPopup: false,
				selectedIndex: null,
				showCreatePopup: false,
				newFolderName: '',
				folders: [],
				foldersLength:0,
			}
		},
		props: {
		    // 声明接收 color 对象
			//需要使用属性
			//color: 例如：[this.color.code, "#f1f1f1", "#e6e6e6", "#d9d9d9"],
			//name: 颜色中文名
		    color: {
				type: Object,
				required: false,
		    },
			// 声明接收 filterData 对象
			//需要使用属性
			//system: "红色系",
			//hue: "淡调",
			//category: "建筑",
			//theme: "开化寺色谱"
			filterData:{
				type:Object,
				required:false,
			}
		},
		async mounted() {
			await collectionStore.initList()
			this.folders = [...collectionStore.collection]
			this.foldersLength = this.folders.length
		},
		methods: {
			startCollect() {
				//console.log(this.color)
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
					console.log('当前 color 值：', this.color)
					console.log('当前 filterData 值：', this.filterData)
					this.folders.forEach((item,index)=>{
						if (!Array.isArray(item.colorCard)) {
						    item.colorCard = []
						}
						if(index == this.selectedIndex){
							item.colorCard.push({
								cardId: item.colorCard.length+1,
								color: [this.color.code, "#f1f1f1", "#e6e6e6", "#d9d9d9"],
								name: this.color.name,
								system: this.filterData.system,
								hue: this.filterData.hue ,
								category: this.filterData.category,
								theme: this.filterData.theme
							});
						}
					})
					//console.log(this.folders)
					collectionStore.updateList(this.folders)
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
				//console.log(name)
				this.folders.push({
					id:this.foldersLength+1,
					name,
					colorCard:[]
				});
				this.showCreatePopup = false;
				this.foldersLength += 1
				//console.log(this.folders)
				collectionStore.updateList(this.folders)
			},
			backShowcase() {
			    // 返回上一级页面
			    uni.navigateBack({
			    delta: 1
			    });
			},
		}
	}
</script>

<style>
	 /* .container{
		position: fixed;
		bottom: 130rpx;
		display: flex;
		justify-content: center; 
		align-items: center;    
		width: 100%;             
		box-sizing: border-box;
	}*/
	
	.buttons{
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.collect-btn {
		padding: 5rpx 50rpx;
		font-size: 26rpx;
		border-radius: 22rpx;
		background-color: #deb67f;
		color: #fff;
		border: none;
		margin-right: 30rpx;
	}
	
	.back-btn{
		padding: 5rpx 50rpx;
		font-size: 26rpx;
		border-radius: 22rpx;
		background-color: #ffffff;
		color: #deb67f;
		border: 2rpx solid #deb67f;
	}

	.popup {
		position: fixed;
		bottom: 0rpx;
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
		bottom: 100rpx;
		left: 0;
		right: 0;
		background-color: #fdf1e8;
		padding: 30rpx;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		
		max-height: 500rpx; /* 根据实际空间需求设置最大高度（如500rpx） */
		overflow-y: auto; /* 内容超出时显示纵向滚动条 */
		overflow-x: hidden; /* 禁止横向滚动 */
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
		margin-bottom: 100rpx;
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
	
	.header{
		margin:10rpx 60rpx;
		width: 84rpx;
		height: 84rpx;
		border-radius: 42rpx;
		background-color: #007aff;
		opacity: 0.1;
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