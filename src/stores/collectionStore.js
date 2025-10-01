import { defineStore } from 'pinia'
import { getCollection } from "@/api/collection.js"

export const useCollectedStore = defineStore('collectionStore',{
	state:() => ({
		//收藏页相关共享的数据
		collection:[],
		modify:false
	}),
	actions:{
		//初始化，在 collection.vue调用时 调用
		initList(){
			//console.log("这是初始化")
			if(this.collection.length !== 0){
				console.log("已经有数据了")
				return Promise.resolve()
			}
			return getCollection()
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
			console.log(this.collection)
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
		    const sendData = {
		      success: true,
		      data: this.collection
		    }
		
		    return new Promise((resolve, reject) => {
		      uni.request({
		        url: 'http://localhost:8888/user1',
		        method: 'PUT',
		        header: {
		          'Content-Type': 'application/json'
		        },
		        data: sendData, // 小程序会自动处理 JSON 转换，无需 stringify
		        success: (res) => {
		          if (res.statusCode === 200) {
		            console.log('提交成功，后端返回：', res.data)
					this.modify = false
		            resolve(res.data)
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
		}
	}
})