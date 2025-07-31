<template>
	<!--搜索框-->
	<view class="findBox">
		<!-- 用v-model绑定输入框内容到inputValue -->
		<input placeholder="搜索我的收藏" class="find" v-model="inputValue">
		<view class="iconfont icon-sousuo search-icon" @click="findData"></view>
	</view>
	<!--收藏夹-->
	<view class="box">
		<view class="collection">收藏夹</view>
		<view class='mamage'>管理</view>
	</view>
	<!--具体内容-->
	<view class="content">
		<navigator class="favorites" :url="`/pages/favorites/favorites?name=${item.name}`" open-type="navigate"
			v-for="(item,index) in dataList"
			:key="item.id"
			>
			<view class="header"></view>
			<view class="name">{{item.name}}</view>
			<view class="number">{{item.colorCard.length}} 项</view>
		</navigator>
		<view class="favorites" @click="addFavorites">
			<view class="iconfont icon-tianjiajiahaowubiankuang iconAdd"></view>
		</view>
		<!--用于补全一整行，使每个块对齐，避免一行两个块的时候，中间产生空位-->
		<view class="block"></view>
	</view>
	
</template>

<script>
	export default{
		data(){
			return{
				inputValue:'',
				newName: '',  // 存储新收藏夹名称
				dataList:[],  //筛选后的数据,用来显示需要的收藏夹
				//原始数据
				data:[
					{
						id:1,
						name:'收藏夹1',
						colorCard:[
							{
								cardId:1,
								color:'red',
							},
							{
								cardId:2,
								color:'blue',
							}
						]
					},
					{
						id:2,
						name:'收藏夹2',
						colorCard:[
							{
								cardId:1
							},
							{
								cardId:2
							},
							{
								cardId:3
							}
						]
					},
					{
						id:3,
						name:'收藏夹3',
						colorCard:[
							{
								cardId:1
							},
							{
								cardId:2
							}
						]
					},
					{
						id:4,
						name:'收藏夹4',
						colorCard:[
							{
								cardId:1
							},
							{
								cardId:2
							}
						]
					},
					{
						id:5,
						name:'收藏夹5',
						colorCard:[
							{
								cardId:1
							},
							{
								cardId:2
							}
						]
					},
					{
						id:6,
						name:'收藏夹6',
						colorCard:[
							{
								cardId:1
							},
							{
								cardId:2
							}
						]
					},
				]
			}
		},
		onLoad(){
			//初始化dataList
			this.dataList = this.data
		},
		methods:{
			//搜索函数
			findData(){
				const value = this.inputValue.trim()// 获取输入的关键词（去除空格）
				console.log(value)
				this.dataList = []
				if(!value){
					//重置dataList
					this.dataList = this.data
					return
				}
				// 筛选出名称包含关键词的数据
				this.dataList = this.data.filter(item => {
					return item.name.includes(value);
				});
			},
			//新建收藏夹
			addFavorites(){
				this.newName = '默认收藏夹'//设置默认名字，有其他需求再改
				if (!this.newName.trim()) {
				    // 验证：名称不能为空
				    uni.showToast({ title: '请输入名称', icon: 'none' });
				    return;
				}
				    
				// 生成新id（确保唯一，取现有最大id+1）
				const maxId = this.data.length > 0 ? Math.max(...this.data.map(item => item.id)) : 0;
				// 新增数据对象
				 const newItem = {
				  id: maxId + 1,
				  name: this.newName.trim(),
				  colorCard: []  // 默认卡片数据
				};
				    
				// 添加到数据源
				this.data.push(newItem);
				// 清空输入框
				this.newName = '';
				// 提示成功
				uni.showToast({ title: '添加成功', icon: 'success' });
			}
		}
	}
</script>

<style>
	body{
		background-color: #f4f3f6;
	}
	
	/*搜索框*/
	.findBox{
		position: relative;
		margin-top: 75rpx;
		height: 90rpx;
	}
	.find{
		margin: 0 45rpx;
		padding-left: 30rpx;
		padding-right: 125rpx;
		height: 90rpx;
		font-size: 22rpx;
		line-height: 90rpx;
		border: 1rpx solid #f3f3f5;
		border-radius: 45rpx;
		background-color: #ffffff;
	}
	.search-icon {
		position: absolute;
		top: 5rpx;
		right:60rpx;
		height: 80rpx;
		width:80rpx;
		border-radius: 40rpx;
		color: white;
		background-color: #007aff;
		font-size: 30rpx;
		text-align: center;
		line-height: 80rpx;
		cursor: pointer;
	}
	
	/*收藏夹标题*/
	.box{
		display:flex;
		justify-content: space-between;
		height:150rpx;
		margin-left: 50rpx;
		margin-right: 67rpx;
		line-height: 140rpx;
	}
	.collection{
		font-size: 36rpx;
		font-weight: bold;
	}
	.mamage{
		font-size: 26rpx;
		color:#acacb3;
	}
	
	/*内容*/
	.content{
		display:flex;
		justify-content: space-between;
		flex-wrap: wrap;
		/* background-color: aqua; */
		margin:0 50rpx;
	}
	.favorites{
		height: 200rpx;
		width: 200rpx;
		margin-bottom: 15rpx;
		border-radius: 20rpx;
		background-color: white;
		text-align: center;
		font-size: 20rpx;
	}
	.block{
		height: 200rpx;
		width: 200rpx;
	}
	.header{
		margin:10rpx 60rpx;
		width: 84rpx;
		height: 84rpx;
		border-radius: 42rpx;
		background-color: #ebf5ff;
	}
	.name{
		margin-bottom: 8rpx;
	}
	.number{
		font-size: ;
		color:#bebebe;
	}
	.iconAdd{
		height: 200rpx;
		width: 200rpx;
		border-radius: 20rpx;
		line-height: 200rpx;
		font-size: 60rpx;
		color:#799fce;
		cursor: pointer;
	}
</style>