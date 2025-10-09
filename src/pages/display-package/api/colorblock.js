import request from '@/utils/request.js'

// 获取单个颜色详细信息
export function getColorDetail(params) {
  return request({
    url: '/colorblock/detail',
    method: 'GET',
    data: params
  })
}