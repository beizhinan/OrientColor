import request from '@/utils/request'

/**
 * 获取所有颜色标签
 * @returns Promise
 */
export function getColorTags() {
  return request({
    url: '/search/text/tags',
    method: 'get'
  })
}

/**
 * 文字检索颜色
 * @param {string} keyword 搜索关键词
 * @returns Promise
 */
export function searchText(keyword) {
  return request({
    url: '/search/text',
    method: 'get',
    data: {
      keyword
    }
  })
}