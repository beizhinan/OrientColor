<template>
	<view style="width: 100%;">
		<!-- 背景 -->
		<view class="back"></view>
		<!--搜索框-->
		<view class="findBox">
			<!-- 用v-model绑定输入框内容到inputValue -->
			<input placeholder="搜索我的收藏" class="find" v-model="inputValue">
			<view class="iconfont icon-sousuo search-icon" @click="findData"></view>
		</view>
		<!--收藏夹-->
		<view class="box">
			<view class="collection">收藏夹</view>
			<view class='mamage' :class="{'select-color':managerFlag}"
			@click="changeManager">管理</view>
		</view>
		<!--具体内容-->
		<view class="content">
			<view class="favorites" :url="`/pages/favorites/favorites?name=${item.name}`" open-type="navigate"
			v-for="(item) in dataList"
			:key="item.id"
			@click="selectOrGoto(item,index)"
			:class="{'actives':selectedIds.includes(item.id)}"
			>
				<view class="header"></view>
				<view class="name">{{item.name}}</view>
				<view class="number">{{item.colorCard.length}} 项</view>
				<!-- .stop阻止事件冒泡,筛选中 -->
				<view class="selected" 
				v-show="this.managerFlag" 
				@click.stop="select(item, index)"
				:class="{'icon-seleted':selectedIds.includes(item.id),
				'iconfont':selectedIds.includes(item.id),
				'active':selectedIds.includes(item.id)}"
				></view>
			</view>
			
			<view class="favorites" @click="addFavorites" v-show="!managerFlag">
				<view class="iconfont icon-tianjiajiahaowubiankuang iconAdd"></view>
			</view>
			
			<!--用于补全一整行，使每个块对齐，避免一行两个块的时候，中间产生空位-->
			<view class="block" v-show="dataListLength%3===2||!managerFlag"></view>
		</view>
		
		<view style="margin: 60rpx auto 0; width: 142rpx;">
			<modelButtonVue class="delete" v-show="managerFlag"
			@tap="judge"
			>删除</modelButtonVue>
		</view>
		
		<!--确认框-->
		<view class="background" v-show="this.deletes">
			<view class="mains">
				<view class="words">{{msg}}</view>
				<view class="option">
					<modelButtonVue @tap="this.deletes=false">取消</modelButtonVue>
					<modelButtonVue @tap="deleteData">确认</modelButtonVue>
				</view>
			</view>
		</view>
		<buttomTabVue></buttomTabVue>
	</view>
</template>

<script>
	//import '@fontsource/noto-serif-sc'
	import buttomTabVue from '../../components/buttomTab/buttomTab.vue'
	import modelButtonVue from '../../components/collect/modelButton.vue'
	export default{
		data(){
			return{
				inputValue:'',
				newName: '',  // 存储新收藏夹名称
				managerFlag:false,//是否进入管理，默认为false
				dataList:[],  //筛选后的数据,用来显示需要的收藏夹
				dataListLength:0,//用于判断是否需要添加block
				selectedIds: [], // 存储选中项的 ID（避免索引变化问题）
				msg:'',//用于输出部分消息
				deletes:false,
				//原始数据
				data:[
					{
						id:1,
						name:'收藏夹1',
						colorCard:[
							{
								cardId:1,
								color:['#f9f9f9','#f1f1f1','#e6e6e6','#d9d9d9'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:1
							},
							{
								cardId:2,
								color:['blue','white','yellow','orange'],
								name:'xxxxx色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:2
							}
						]
					},
					{
						id:2,
						name:'收藏夹2',
						colorCard:[
							{
								cardId:1,
								color:['red'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:3
							},
							{
								cardId:2,
								color:['red'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:4
							},
							{
								cardId:3,
								color:['red'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:5
							}
						]
					},
					{
						id:3,
						name:'收藏夹3',
						colorCard:[
							{
								cardId:1,
								color:['red'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:6
							},
							{
								cardId:2,
								color:['red'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:7
							}
						]
					},
					{
						id:4,
						name:'收藏夹4',
						colorCard:[
							{
								cardId:1,
								color:['red'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:8
							},
							{
								cardId:2,
								color:['red'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:9
							}
						]
					},
					{
						id:5,
						name:'收藏夹5',
						colorCard:[
							{
								cardId:1,
								color:['red'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:10
							},
							{
								cardId:2,
								color:['red','white'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:11
							}
						]
					},
					{
						id:6,
						name:'收藏夹6',
						colorCard:[
							{
								cardId:1,
								color:['red'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:12
							},
							{
								cardId:2,
								color:['red'],
								name:'开化寺色谱',
								form:'红色系,淡调,唐代,建筑',
								colorId:13
							}
						]
					},
				]
			}
		},
		onLoad(){
			//初始化dataList
			this.dataList = this.data
			this.dataListLength=this.dataList.length
		},
		methods:{
			// 手动实现导航逻辑
			goToDetail(item) {
				// 只有在非管理模式下才跳转
				// 将对象转为JSON字符串
				const itemStr = encodeURIComponent(JSON.stringify(item));
				//console.log(itemStr)
				// 跳转到页面
			    if (!this.managerFlag) {
					uni.navigateTo({
						url: `/pages/favorites/favorites?item=${itemStr}`
					})
				}
				// else{
				// 	this.select(item,index)
				// }
			},
			//搜索函数
			findData(){
				const value = this.inputValue.trim()// 获取输入的关键词（去除空格）
				console.log(value)
				this.dataList = []
				if(!value){
					//重置dataList
					this.dataList = this.data
					this.dataListLength=this.dataList.length
					return
				}
				// 筛选出名称包含关键词的数据
				this.dataList = this.data.filter(item => {
					this.inputValue=''
					this.dataListLength=this.dataList.length;
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
				  colorCard: []  ,// 默认卡片数据
				};
				    
				// 添加到数据源
				this.data.push(newItem)
				// 清空输入框
				this.newName = ''
				// 提示成功
				uni.showToast({ title: '添加成功', icon: 'success' })
				this.findData()
			},
			deleteData(){
				if(this.selectedIds.length!==0){
					this.data = this.data.filter(item => {
					    // 检查当前项的id是否不在选中数组中
					    return !this.selectedIds.includes(item.id);
					});
					// 更新列表长度
					this.dataList = this.data
					this.dataListLength = this.dataList.length;
					// 清空选中状态（删除后重置选择）
					this.selectedIds = []
				}else{
					this.dataList = this.data
					this.dataListLength=this.dataList.length
				}
				this.deletes=false
			},
			changeManager(){
				this.managerFlag=!this.managerFlag
				this.selectedIds=[]
			},
			select(item,index){
				const id = item.id;
				// 判断是否已选中
				if (this.selectedIds.includes(id)) {
					// 取消选中：从数组移除
					this.selectedIds = this.selectedIds.filter(i => i !== id)
				} else {
					// 选中：加入数组
					this.selectedIds.push(id);
				}
				//console.log(item.id)
			},
			judge(){
				//console.log(this.deletes)
				this.deletes = true
				if(this.selectedIds.length === 0){
					this.msg = "没有选中的文件夹"
				}
				else if(this.selectedIds.length === 1){
					const selectedItem = this.dataList.find(item => item.id === this.selectedIds[0]);
					this.msg = `是否确认删除“${selectedItem.name}”`
				}
				else{
					this.msg = "是否确认删除所选文件夹"
				}
			},
			selectOrGoto(item,index){
				if(!this.managerFlag){
					this.goToDetail(item)
				}else{
					this.select(item,index)
				}
			}
		},
		components:{
			buttomTabVue,
			modelButtonVue,
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
		background-color: #c69c6d;
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
		font-style: "STSong",serif;
		font-size: 36rpx;
		font-weight: bold;
		color:#9f7735;
	}
	.mamage{
		font-size: 26rpx;
		color:#acacb3;
		cursor: pointer;
	}
	/* 新增蓝色样式类 */
	.select-color {
	    color: #d78410;
	}
	
	/*内容*/
	.content{
		box-sizing: border-box;
		position: relative;
		display:flex;
		justify-content: space-between;
		flex-wrap: wrap;
		/* background-color: aqua; */
		margin:0 50rpx;
	}
	.favorites{
		box-sizing: border-box;
		position: relative;
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
		font-size: 20rpx;
		color:#bebebe;
	}
	.selected{
		box-sizing: border-box;
		position: absolute;
		top: 10rpx;
		left:10rpx;
		height: 24rpx;
		width: 24rpx;
		background-color: #d9d9d9;
		border-radius: 50%;
		cursor: pointer;
		/* 核心居中设置 */
		display: flex; /* 启用弹性盒布局 */
	    justify-content: center; /* 水平居中 */
	    align-items: center; /* 垂直居中 */
	}
	.active{
		border:3rpx solid #e6e6fb;
		background-color: white;
		font-size: 16rpx;
		font-weight: bold;
		color:#deb680;
	}
	.actives{
		border:4rpx solid #deb680;
	}
	.delete{
		/* display: block; */
		/* position:absolute;
		right: 0rpx;
		bottom: -140rpx; */
		/* margin: 60rpx auto 0; */
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
	/*确认框*/
	.background{
		position: fixed; /* 固定定位，脱离文档流覆盖全屏 */
		top: 0;
		left: 0;
		right: 0;
		bottom: 0; /* 四边贴齐屏幕边缘 */
		background-color: rgba(243, 242, 245,0.8);
		z-index: 999; /* 确保在页面内容上方（需大于其他元素z-index） */
	}
	/* 中间弹窗内容（可选样式，让弹窗居中） */
	.mains {
		position: absolute; /* 相对于蒙版定位 */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%); /* 居中对齐 */
		background-color: white; 
		height:475rpx;
		width: 650rpx;
		border-radius: 20rpx;
		/* opacity: 1; */ /* 透明度 */
	}
	.words{
		position: absolute; 
		top: 175rpx; 
		left: 50%; 
		transform: translateX(-50%); /* 水平居中修正 */
		font-size: 28rpx;
	}
	.option{
		position: absolute; 
		bottom: 80rpx;
		right:45rpx;
		display: flex;
		justify-content: space-between;
		height:80rpx;
		width: 320rpx;
	}
</style>