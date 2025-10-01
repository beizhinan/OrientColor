import { request } from '@/utils/request'

export function getCollection(){
	return new Promise((resolve, reject) => {
	    request({
	      url: 'http://localhost:8888/user1',   //测试数据地址，使用json-server，需要npm安装
		  //url:'http://39.97.55.169:8080/api/v1/user/collection/user1',
	      method: 'GET',
		  //params: { user_id: userId } // GET请求用params传递参数
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
