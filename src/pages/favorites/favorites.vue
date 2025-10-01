<template>
	<view>
		<!-- 背景 -->
		<view class="back"></view>
		<view class="title">{{data.name}}</view>
		<view class="frame" v-show="this.flag">
			<view class="content"
			v-for="(item,index) in data?.colorCard"
			:key = "item.cardId"
			>
				<view class="details">
					<view class="band" :style="{ background: colorCards[index].gradient }"></view>
					<view class="order">{{item.name}}</view>
					<view class="brief">#{{item.system}},{{item.hue}},{{item.category}},{{item.theme}}</view>
				</view>
				<view class="btnBox">
					<button class="btn" style="margin-bottom: 8rpx; border-color: #c69c6d; color:#c69c6d" @click="deleteData(index)">删除</button>
					<button class="btn" 
					style="border-color: #98867c; color: #98867c;" 
					@click="goToShowcase(item)" 
					v-show="!detailFlag || index!==order"
					>详情</button>
				</view>
				
				<!-- <view class="box" v-show="detailFlag && index === order">
					<view class="colorSolid" @click="goToColorblock(item)">查看色立体</view>
					<view class="entry" @click="goToShowcase(item)">查看词条</view>
				</view> -->
			</view>
		</view>
		<buttomTab></buttomTab>
	</view>
</template>

<script>
	import buttomTabVue from '../../components/buttomTab/buttomTab.vue'
	import {useCollectedStore} from '@/stores/collectionStore.js'
	
	const collectionStore = useCollectedStore()
	export default{
		data(){
			return{
				name:'',
				colorCards:[],
				flag:true,//判断是否删除了所有内容
				//测试数据
				//每种颜色都有自己的id
				data:{},
				detailFlag:false,
				order:-1,//确认序号
			}
		},
		onLoad(options){
			//this.name=options.name
			// console.log(this.name)
			 // 解析JSON字符串为对象
			if (options.item) {
				this.item = JSON.parse(decodeURIComponent(options.item))
				console.log("接收的对象数据：", this.item)
				this.data = this.item
				console.log(this.data)
				// 关键：如果 colorCard 不是数组，强制转为空数组
				if (!Array.isArray(this.data?.colorCard)) {
				    this.data.colorCard = []
				    //console.log("colorCard 不是数组，已重置为空数组")
				}
				 // 提取colorCard数组，并为每个项生成渐变样式
				this.colorCards = (this.item.colorCard || []).map(card => ({
				    ...card,
				    gradient: this.generateGradient(card.color) // 直接使用card.color生成渐变
				}))
				console.log(this.colorCards[0].gradient)
			}
		},
		methods:{
			deleteData(index){
				// splice(索引, 删除数量)：直接修改原数组，删除指定元素
				this.data.colorCard.splice(index, 1)
				console.log(`已删除索引为${index}的元素`)
				if(this.data.length === 0){
					this.flag=false
				}
				collectionStore.deleteCardData(this.data.name,index)
			},
			goToShowcase(item){
				// 筛选项标题
				const selectedFilters=(()=>{
					const str =['system','hue','theme','category']
					.map(field =>item[field]||'')
					.filter(Boolean)// 去掉空值
					.join('-');
					return str || 'all'
				})()
				// 筛选项用于后端筛选
				const Item = {
					all: Object.keys(item).every(key => {
					    const value = item[key];
					    // 回调函数返回布尔值（判断当前字段是否为无效值）
					    return value === "" || value === null || value === undefined;
					}) ? "全部" : "",
					system: item.system,
					hue: item.hue,
					theme: item.theme,
					category:item.category// 复制 item 中的四个字段
				}
				const params = JSON.stringify(Item)
				const newUrl = `/pages/chart/chart?selectedFilters=${selectedFilters}&filterData=${encodeURIComponent(params)}`
				uni.navigateTo({
					url: newUrl
				})
			},
			// 生成渐变色字符串（按等分段处理，如4种颜色分4段）
			generateGradient(colors) {
				const segment = 25 // 每段占比（如4种颜色各占25%）
				let gradient = 'to right, '
				colors.forEach((color, index) => {
					const start = index * segment; // 本段起始百分比
					const end = (index + 1) * segment; // 本段结束百分比
					// 拼接格式：颜色 起始%, 颜色 结束%, 
					gradient += `${color} ${start}%, ${color} ${end}%, `
				});
				// 去除最后一个逗号和空格
				return `linear-gradient(${gradient.slice(0, -2)})`
			}
		},
		components:{
			buttomTabVue,
		}
	}
</script>

<style>
	.back{
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #fdfaf5;
		z-index: -1;
	}
	.title{
		margin: 45rpx 48rpx;
		font-size: 38rpx;
		font-weight: bold;
	}
	/*主要内容*/
	.frame{
		box-sizing: border-box;
		margin: 0 43rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding: 10rpx 12rpx 15rpx 12rpx;
	}
	.content{
		position: relative;
		height: 145rpx;
		padding: 15rpx 0;
		border-bottom: 5rpx solid #f4f5f7;
	}
	.details{
		position: absolute;
		top: 25rpx;
		left: 50rpx;
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
	.btnBox{
		position: absolute;
		top: 25rpx;
		right: 20rpx;
		width: 80rpx;
		height: 110rpx;
		padding: 0;
	}
	.btn{
		width: 80rpx;
		height: 50rpx;
		padding: 0;
		background-color: #ffffff;
		text-align: center;
		line-height: 48rpx;
		font-size: 16rpx;
		border:2rpx #b9b9b9 solid;
	}
	.box{
		box-sizing: border-box;
		position: absolute;
		right:20rpx;
		bottom: 13rpx;
		display: flex;
		justify-content: space-between;
		width: 250rpx;
		height:36rpx;
		font-size: 16rpx ;
		white-space: nowrap;
	}
	.box .colorSolid{
		box-sizing: border-box;
		width: 130rpx;
		height: 34rpx;
		line-height: 100%;
		text-align: center;
		border: 3rpx solid #b2b2b2;
		border-radius: 8rpx;
		color:#b2b2b2 ;
	}
	.entry{
		box-sizing: border-box;
		width:104rpx;
		height: 34rpx;
		line-height: 100%;
		text-align: center;
		border: 3rpx solid #b2b2b2;
		border-radius: 8rpx;
		color:#b2b2b2 ;
	}
</style>