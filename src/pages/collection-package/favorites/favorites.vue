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
	import buttomTabVue from '@/components/buttomTab/buttomTab.vue'
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
				
				colorPoints: [
					{ L: 23, a: -1, b: 3, C: 3, H: 108, name: "暗灰", code: "#373733" },
					{ L: 73, a: 5, b: 14, C: 15, H: 72, name: "黯白", code: "#C6B09A" },
					{ L: 39, a: -6, b: 6, C: 8, H: 133, name: "黯大绿", code: "#565E51" },
					{ L: 27, a: -11, b: 18, C: 21, H: 123, name: "偏黄的大绿", code: "#374323" },
					{ L: 25, a: -3, b: -4, C: 5, H: 229, name: "黯大青", code: "#343E42" },
					{ L: 49, a: -5, b: 15, C: 16, H: 109, name: "偏黄的二绿", code: "#76775B" },
					{ L: 46, a: -11, b: 11, C: 15, H: 134, name: "偏灰的黯二绿", code: "#61715A" },
					{ L: 38, a: -10, b: -23, C: 25, H: 247, name: "偏绿的二青", code: "#1C5F7D" },
					{ L: 45, a: -7, b: -5, C: 9, H: 216, name: "黯二青", code: "#596E73" },
					{ L: 40, a: 39, b: 23, C: 45, H: 31, name: "上好二朱", code: "#9F413C" },
					{ L: 67, a: 15, b: 44, C: 47, H: 71, name: "黯金", code: "#D19652" },
					{ L: 40, a: -20, b: -7, C: 21, H: 199, name: "孔雀蓝", code: "#286869" },
					{ L: 54, a: -19, b: -12, C: 22, H: 213, name: "浅孔雀蓝", code: "#478B95" },
					{ L: 35, a: -12, b: -10, C: 16, H: 220, name: "深孔雀蓝", code: "#2D5861" },
					{ L: 69, a: -14, b: 9, C: 17, H: 148, name: "黯绿华", code: "#94AF98" },
					{ L: 47, a: -4, b: 5, C: 6, H: 125, name: "绿灰", code: "#6C7066" },
					{ L: 7, a: 0, b: 7, C: 7, H: 90, name: "好墨", code: "#191406" },
					{ L: 87, a: 2, b: 7, C: 7, H: 74, name: "黯铅白", code: "#E3D8CD" },
					{ L: 55, a: 25, b: 33, C: 41, H: 53, name: "黯铅丹", code: "#BB724D" },
					{ L: 54, a: -7, b: -7, C: 10, H: 227, name: "黯青华", code: "#6E868E" },
					{ L: 55, a: -6, b: 0, C: 6, H: 183, name: "偏灰的黯青华", code: "#7A8885" },
					{ L: 54, a: -29, b: 12, C: 32, H: 158, name: "上好三绿", code: "#4C8F6D" },
					{ L: 61, a: -2, b: 11, C: 11, H: 102, name: "偏黄的三绿", code: "#97937F" },
					{ L: 54, a: -14, b: 11, C: 17, H: 141, name: "黯三绿", code: "#70876E" },
					{ L: 46, a: -11, b: -14, C: 18, H: 231, name: "偏绿的三青", code: "#437283" },
					{ L: 42, a: 27, b: 20, C: 33, H: 36, name: "鲜三朱", code: "#934F43" },
					{ L: 47, a: 13, b: 28, C: 31, H: 64, name: "深黄", code: "#926742" },
					{ L: 33, a: 1, b: 8, C: 8, H: 86, name: "深灰", code: "#524C41" },
					{ L: 25, a: 12, b: 14, C: 18, H: 49, name: "黯深朱", code: "#513326" },
					{ L: 25, a: 35, b: 19, C: 40, H: 29, name: "鲜深朱", code: "#6E1F20" },
					{ L: 59, a: 10, b: 23, C: 25, H: 67, name: "浅土黄", code: "#AC8766" },
					{ L: 37, a: 15, b: 15, C: 21, H: 45, name: "黯土朱", code: "#754E40" },
					{ L: 51, a: 14, b: 17, C: 21, H: 51, name: "浅土朱", code: "#9A6F5C" },
				]
			}
		},
		onLoad(options){
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
					all: "",
					system: item.system,
					hue: item.hue,
					theme: item.theme,
					category:item.category// 复制 item 中的四个字段
				}
				const params = JSON.stringify(Item)
				//第三个参数
				const colorPointsStr = encodeURIComponent(JSON.stringify(this.colorPoints));
				const newUrl = `/pages/chart-package/chart/chart?selectedFilters=${selectedFilters}&filterData=${encodeURIComponent(params)}&colorPoints=${colorPointsStr}`
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
