import request from '@/utils/request.js'

// 获取单个色谱颜色数据
export function getChromatographyDetail(id, title) {
  return request({
    url: '/chromatography/detail',
    method: 'GET',
    data: {
      id,
      title
    }
  })
}