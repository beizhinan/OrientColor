import { defineStore } from 'pinia'
import { getCollection } from "@/api/collection.js"
import { useAuthStore } from '@/stores/auth.js'

export const useCollectedStore = defineStore('collectionStore',{
	state:() => ({
		//收藏页相关共享的数据
		collection:[],
		modify:false,
	}),
	actions:{
		//初始化，在 collection.vue调用时 调用
		initList(){
			const authStore = useAuthStore()
			if(!authStore.user_id){
				// 1. 先移除旧的监听（避免重复监听）
				uni.$off('loginSuccessGlobal');
				// 2. 监听全局事件
				uni.$on('loginSuccessGlobal', () => {
				    console.log('全局事件触发，重新执行 initList');
				    this.initList(); // 登录成功后重新执行
				});
				uni.navigateTo({
				      url: "pages/auth-package/login/login",
				});
				return;
			}
			//console.log("这是初始化")
			if(this.collection.length !== 0){
				console.log("已经有数据了")
				return Promise.resolve()
			}
			return getCollection(authStore.user_id)
			.then(collectionData => {
			    // 2. 赋值并处理数据
				this.collection = collectionData
				console.log('初始化数据：',this.collection)
			})
			.catch(error => {
				// 3. 捕获错误（若有）
				console.error('收藏夹数据加载失败:', error)
			})
		},
		//更新数据
		updateList(data){
			this.collection = data
			this.modify = true
			this.submitData()
		},
		//删除数据---色带
		deleteCardData(name,index){
			this.collection = this.collection.map(store =>{
				if(store.name === name){
					store.colorCard = store.colorCard.filter((_,currentIndex) => currentIndex!==index)
				}
				return store
			})
			this.modify = true
		},
		//提交数据
		async submitData() {
			const authStore = useAuthStore()
		  try {
			this.collection.forEach((item,id)=>{
				item.id = (id+1) + ''
				item.colorCard.forEach((colorCard,index)=>{
					colorCard.cardId = (index + 1) + ''
				})
			})
			console.log(this.collection)
		    const sendData = this.collection.map(item=>{
				return {
					id:item.id,
					name:item.name || '默认收藏夹',
					colorCard: item.colorCard.map(card=>{
						return {
							cardId:card.cardId,
						    name: card.name || '未知色卡',    
						    system: card.system,   
						    hue: card.hue,        
						    category: card.category,  
					        theme: card.theme
						};
					})
				}
			})
			console.log(sendData)
		    return new Promise((resolve, reject) => {
		      uni.request({
		        url:`https://coloreast.cn/api/v1/user/collection?user_id=${authStore.user_id}`,
		        method: 'PUT',
		        header: {
		          'Content-Type': 'application/json'
		        },
		        data: sendData, // 小程序会自动处理 JSON 转换，无需 stringify
		        success: (res) => {
		          if (res.statusCode === 200) {
		            console.log('提交成功，后端返回：', res)
					this.modify = false
					this.collection = res.data.data
					console.log("这是提交过后的数据",this.collection)
		            resolve(res)
		          } else {
		            reject(new Error('提交失败，状态码：' + res.statusCode))
		          }
		        },
		        fail: (err) => {
		          reject(new Error('网络请求失败：' + err.errMsg))
		        }
		      })
		    })
			} catch (error) {
				console.error('提交数据出错：', error)
				throw error // 抛出错误，让组件捕获处理
			}
		},
	}
})