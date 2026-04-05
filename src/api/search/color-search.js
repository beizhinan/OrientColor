import request from '@/utils/request'

/**
 * 获取色盘数据
 * @param {Boolean} isLowChroma 是否为低艳色
 * @returns {Promise}
 */
export function getColorWheelData(isLowChroma) {
  return request({
    url: '/search/color/all',
    method: 'POST',
    data: {
      isLowChroma
    }
  })
}

/**
 * 获取色盘颜色矩阵数据
 * @param {Boolean} isLowChroma 是否为低艳色
 * @param {Array} centerColors 中心颜色数据
 * @returns {Promise}
 */
export function getColorListData(isLowChroma, centerColors) {
  return request({
    url: '/search/color/list',
    method: 'POST',
    data: {
      isLowChroma,
      centerColors
    }
  })
}

/**
 * 获取颜色详细信息
 * @param {Object} color 颜色对象
 * @returns {Promise}
 */
export function getColorDetail(color) {
  return request({
    url: '/search/color/detail',
    method: 'POST',
    data: {
      color: {
        name: color.name,
        label: color.label,
        h: color.h
      }
    }
  })
}

/**
 * 获取低艳色颜色详细信息
 * @param {Boolean} isLowChroma 是否为低艳色
 * @param {Object} centerColor 中心颜色对象
 * @returns {Promise}
 */
export function getLowChromaColorDetail(isLowChroma, centerColor) {
  return request({
    url: '/search/color/low-detail',
    method: 'POST',
    data: {
      isLowChroma,
      centerColor
    }
  })
}