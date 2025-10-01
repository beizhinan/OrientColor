import { request } from '@/utils/request'

export function getCollection(){
	return new Promise((resolve, reject) => {
	    request({
	      url: 'http://localhost:8888/user1',   //测试数据地址，使用json-server
		  //url:'http://39.97.55.169:8080/api/v1/user/collection'
	      method: 'GET',
		  //params: { user_id: userId } // GET请求用params传递参数
	    })
	    .then(response => {
			// 确保基础数据是数组
			const result = Array.isArray(response.data) ? response.data : []
			//处理数据
			const parseData = result.map(item => {
				//转到色谱对象
				const colorCard = item.colorCard || []
				const newColorCard = colorCard.map(card =>{
					//转到每条色谱
					// 确保 card 是对象，避免遍历异常
					const currentCard = card || {};
					//将色谱的色系、色调等信息拼接为form字段
					const forms = [currentCard.colorSystem,currentCard.hue,currentCard.type,currentCard.theme]
					.filter(Boolean).join(',') //过滤空值直接拼接
					//创建新的符合collection的数据格式
					const newColorCardItem = {
						color: currentCard.color,
						name: currentCard.name,
						form: forms,
						colorId: currentCard.colorId
					}
					//返回对象
					return newColorCardItem
				})
				return {
					...item,
					colorCard: newColorCard
				}
			})
			resolve(parseData)
	    })
	    .catch(error => {
			console.error('获取数据失败:', error)
			//返回空数组
			resolve([])
	    })
	})
}