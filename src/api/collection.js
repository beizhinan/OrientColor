import { request } from '@/utils/request'

export function getCollection(user_id){
	return new Promise((resolve, reject) => {
	    request({
		  url:`/user/collection?user_id=${user_id}`,
	      method: 'GET',
	    })
	    .then(response => {
			// 确保基础数据是数组
			const result = Array.isArray(response.data) ? response.data : []
			resolve(result)
	    })
	    .catch(error => {
			console.error('获取数据失败:', error)
			//返回空数组
			resolve([])
	    })
	})
}
