import request from '@/utils/request.js'

// 获取推荐色谱卡片列表
export function getRecommendedColors() {
  return request({
    url: '/home/recommended',
    method: 'GET'
  })
}