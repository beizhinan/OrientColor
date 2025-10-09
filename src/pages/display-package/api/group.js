import request from '@/utils/request'

/**
 * 根据标签名和标签值获取对应的颜色数据列表
 * @param {Object} params 请求参数 {label: 标签名, value: 标签值}
 * @returns Promise
 */
export function getGroupColors(params) {
  return request.get('/group/colors', params)
}