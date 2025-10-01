import request from '@/utils/request'

// 获取一级颜色数据
export function getLevelOneColors() {
  return request.get(`/colors/level-one`)
}

// 获取二级颜色数据
export function getLevelTwoColors(parentId) {
  return request.get(`/colors/level-two/${parentId}`)
}

// 获取三级颜色数据
export function getLevelThreeColors(parentId) {
  return request.get(`/colors/level-three/${parentId}`)
}

// 获取四级颜色数据
export function getLevelFourColors(parentId) {
  return request.get(`/colors/level-four/${parentId}`)
}