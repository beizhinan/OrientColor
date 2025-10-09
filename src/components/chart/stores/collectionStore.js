import { defineStore } from 'pinia'
import { getCollection } from "@/api/collection.js"


export const useCollectedStore = defineStore('collectionStore',{
	state:() => ({
		//收藏页相关共享的数据
		collection:[],
		user_id:'',
		modify:false
	}),
	actions:{
		//初始化，在 collection.vue调用时 调用
		initList(){
			if(!this.user_id){
				this.goTologin()
			}
			if(this.collection.length !== 0){
				console.log("已经有数据了")
				return Promise.resolve()
			}
			return getCollection(this.user_id)
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
		initCollectionList(user_id){
			//在收藏夹界面使用
			this.user_id = user_id
			console.log("store:",user_id)
			if(this.collection.length !== 0){
				console.log("已经有数据了")
				return Promise.resolve()
			}
			return getCollection(this.user_id)
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
					name:item.name,
					colorCard: item.colorCard.map(card=>{
						return {
							cardId:card.cardId,
						    name: card.name,    
						    system: card.system,   
						    hue: card.hue,        
						    category: card.category,  
					        theme: card.theme
						};
					})
				}
			})
			// const sendData ={
			// 	code:200,
			// 	success:true,
			// 	data:collectionData
			// }
			//console.log("sendData:",sendData)
		    return new Promise((resolve, reject) => {
		      uni.request({
		        url:`http://39.97.55.169:8080/api/v1/user/collection?user_id=${this.user_id}`,
		        method: 'PUT',
		        header: {
		          'Content-Type': 'application/json'
		        },
		        data: this.collection, // 小程序会自动处理 JSON 转换，无需 stringify
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
		goTologin(){
			uni.navigateTo({ url: "/pages/login/login" });
		}
	},
})