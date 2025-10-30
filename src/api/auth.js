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
      url: 'https://coloreast.cn/eastern_color/api/user/login/wechat',
      method: 'POST',
      data: { code },
      header: {
        'Content-Type': 'application/json' // 明确告知后端请求体是 JSON 格式
      }
    })
    // 5. 可选：统一处理请求成功/失败的日志（便于排查）
    .then(response => {
      console.log('微信登录成功，后端返回：', response); // 打印 token 等信息
      return response; // 必须返回 response，否则前端拿不到数据
    })
    .catch(error => {
      console.error('微信登录请求失败：', error.message); // 打印错误原因
      return Promise.reject(error); // 重新抛出错误，让前端 catch 处理
    });
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


