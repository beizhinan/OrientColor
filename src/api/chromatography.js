/**
 * 色谱页面API接口封装
 */

import request from '@/utils/request.js'

// 获取单个色谱颜色数据
export function getChromatographyDetail(id, title) {
  return request({
    url: '/chromatogarphy/detail',
    method: 'GET',
    params: {
      id,
      title
    }
  })
}