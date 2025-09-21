import request from '@/utils/request'

// 获取一级颜色数据
export function getLevelOneColors() {
  return request.get(`/colors/level-one`)
}

// 获取二级颜色数据
export function getLevelTwoColors(themeId, parentId) {
  return request.get(`/colors/level-two/${themeId}/${parentId}`)
}

// 获取三级颜色数据
export function getLevelThreeColors(themeId, parentId) {
  return request.get(`/colors/level-three/${themeId}/${parentId}`)
}

// 获取四级颜色数据
export function getLevelFourColors(themeId, parentId) {
  return request.get(`/colors/level-four/${themeId}/${parentId}`)
}