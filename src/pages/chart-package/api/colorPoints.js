import { request } from '@/utils/request'

// 获取色立体色彩点数据
export function getColorPoints(params) {
  return request({
    url: '/colors/points',
    method: 'GET',
    data: params
  })
}