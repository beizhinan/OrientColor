<template>
	<!-- 交互规则 -->
	<view class="rule">
		<image class="tips-icon" src="/src/static/showcase/collection-info.png"></image>
		<view class="tips-title" v-if="cardStyle==='1dRect'">您可以选择LabC色彩模型中任意1个维度生成带状图懂,点击具体色块查看详情</view>
		<view class="tips-title" v-if="cardStyle==='1dPolar'">您可以选择H色彩模型中生成环状图像,滑动圆环查看详情</view>
		<view class="box1">
			 <view 
			class="selection" 
			v-for="(item, index) in items" 
			:key="index"
			:class="{ 'active': selectedSquare === index }"
			@click="selectItem(index)"
			v-if="cardStyle==='1dRect'"
			>
				{{ item }}
			</view>
			<view class="selection active" v-if="cardStyle==='1dPolar'">H</view>
		</view>
	</view>
	
	
	<view class="buttons">
		<button class="collect-btn" @click="startCollect">收藏色谱</button>
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
	
	<!-- 抵消底部导航栏的高度 -->
	<view class="tab"></view>
</template>

<script>
	export default {
		props:{
			cardStyle:{
				type:String,
				require:true,
				default:'1dRect'
			}
		},
		data() {
			return {
				items: ['L', 'a', 'b', 'c'],  // 选项数据
				selectedSquare: 1,     // 选中的索引，初始为-1表示未选中任何项
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
			selectItem(index) {
			      this.selectedSquare = index;
			},
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
			
		}
	}
</script>

<style>
	.rule{
		box-sizing: border-box;
		background-color: #fdf1e8;
		height: 185rpx;
		width:650rpx;
		margin-top: 40rpx;
		padding-top: 30rpx;
	}
	.tips-icon {
		display: inline-block;
		margin-left: 20rpx;
		height: 20rpx;
		width: 20rpx;
		vertical-align: middle; 
	}	
	.tips-title {
		display: inline-block;
		margin-left: 5rpx;
		margin-bottom: 14rpx;
		vertical-align: middle; 
		width: 600rpx;
		font-weight: 500;
		font-size: 20rpx;
	}
	
	.box1{
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		height:70rpx;
		width: 410rpx;
		margin-left: 20rpx;
	}
	.selection{
		box-sizing: border-box;
		width: 80rpx;
		height: 70rpx;
		background-color: white;
		color:#007aff;
		border: 5rpx solid #007aff;
		border-radius: 10rpx;
		text-align: center;
		line-height: 70rpx;
	}
	.active{
		background-color: #007aff;
		color:white
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
	
	.folder .active {
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
	
	.tab{
		height: 125rpx;
		width: 100%;
	}
</style>