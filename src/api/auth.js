import { request } from '@/utils/request'

/**
 * 微信登录 - 获取code
 * @returns {Promise} 返回微信登录code
 */
export function wxLogin() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res) => {
        if (res.code) {
          resolve(res.code)
        } else {
          reject(new Error('微信登录失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 微信登录 - 后端验证
 * @param {string} code - 微信登录code
 * @returns {Promise} 返回登录结果
 */
export function wxAuthLogin(code) {
  return request({
    url: '/auth/wxLogin',
    method: 'POST',
    data: { code }
  })
}

/**
 * 获取微信用户信息
 * @returns {Promise} 返回用户信息
 */
export function getWxUserInfo() {
  return new Promise((resolve, reject) => {
    uni.getUserProfile({
      desc: '获取用户信息用于登录',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 检查登录状态
 * @returns {Promise} 返回登录状态
 */
export function checkLogin() {
  return request({
    url: '/auth/checkLogin',
    method: 'GET'
  })
}