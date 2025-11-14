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