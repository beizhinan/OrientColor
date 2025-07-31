<template>
	<view>
		<view class="title">{{this.name}}</view>
			<view class="frame">
				<view class="content"
				v-for="(item,index) in data"
				:key = "item.id">
				<view class="band"></view>
				<view class="order">色卡{{item.id}}</view>
				<view class="brief">#红色系，淡调，唐代，建筑</view>
				<view class="box">
					<button class="btn" style="margin-bottom: 8rpx;" @click="deleteData(index)">删除</button>
					<button class="btn">详情</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import buttonTab from
	export default{
		data(){
			return{
				name:'',
				//测试数据
				data:[
					{
						id:1
					},
					{
						id:2
					},
					{
						id:3
					}
				]
			}
		},
		onLoad(options){
			this.name=options.name
			console.log(this.name)
		},
		methods:{
			deleteData(index){
				// splice(索引, 删除数量)：直接修改原数组，删除指定元素
				this.data.splice(index, 1)
				console.log(`已删除索引为${index}的元素`)
			}
		}
	}
</script>

<style>
	body{
		background-color: #f4f3f6;
	}
	.title{
		margin: 45rpx 48rpx;
		font-size: 38rpx;
		font-weight: bold;
	}
	/*主要内容*/
	.frame{
		margin: 0 48rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding: 10rpx 32rpx 15rpx 48rpx;
	}
	.content{
		position: relative;
		height: 130rpx;
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		border-bottom: 5rpx solid #f4f5f7;
	}
	.band{
		width: 325rpx;
		height: 50rpx;
		border-radius: 10rpx;
		/* 
		    linear-gradient(方向, 颜色1 起始位置, 颜色2 结束位置, ...)
		    这里用 to right 表示横向，颜色位置设为相同值可实现“硬边缘”分段效果 
		  */
		background: linear-gradient(
		    to right, 
		       #f9f9f9 0%,   /* 第一段：0% ~ 25% */
		        #f9f9f9 25%,  /* 硬边缘分割 */
		        #f1f1f1 25%,  /* 第二段：25% ~ 50% */
		        #f1f1f1 50%,  /* 硬边缘分割 */
		        #e6e6e6 50%,  /* 第三段：50% ~ 75% */
		        #e6e6e6 75%,  /* 硬边缘分割 */
		        #d9d9d9 75%,  /* 第四段：75% ~ 100% */
		        #d9d9d9 100%  /* 硬边缘分割 */
		);
	}
	.order{
		margin: 8rpx 0;
		font-size:20rpx;
		font-weight: bold;
	}
	.brief{
		font-size: 16rpx;
		color:#cdcdcd;
	}
	.box{
		position: absolute;
		top: 15rpx;
		right: 30rpx;
		width: 80rpx;
		height: 100rpx;
	}
	.btn{
		width: 80rpx;
		height: 48rpx;
		padding: 0;
		background-color: #ffffff;
		text-align: center;
		line-height: 48rpx;
		font-size: 16rpx;
		border:1rpx #b9b9b9 solid;
	}
</style>