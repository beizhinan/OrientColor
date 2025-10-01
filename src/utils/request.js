// 基础路径，根据实际项目配置
const BASE_URL = 'http://39.97.55.169:8080/api/v1' // 替换为你的后端API地址

// 调试开关
const DEBUG = true

/**
 * 网络请求封装
 * @param {Object} options 请求配置
 */
const request = (options) => {
  // 默认配置
  const defaultOptions = {
    url: '',
    method: 'GET',
    data: {},
    header: {
      'Content-Type': 'application/json'
    },
    loading: true, // 默认显示加载中
    loadingText: '加载中...'
  }
  
  // 合并配置
  options = Object.assign({}, defaultOptions, options)
  
  // 完整URL
  if (!options.url.startsWith('http') && !options.url.startsWith('https')) {
    options.url = BASE_URL + options.url
  }
  
  // 显示加载中
  if (options.loading) {
    uni.showLoading({
      title: options.loadingText,
      mask: true
    })
  }
  
  // 调试输出请求信息
  if (DEBUG) {
    console.log('[Request] 发送请求:', {
      url: options.url,
      method: options.method,
      data: options.data,
      header: options.header
    })
  }
  
  // // 获取token
  // const token = uni.getStorageSync('token')
  // if (token) {
  //   options.header['Authorization'] = `Bearer ${token}`
  // }
  
  // 返回Promise
  return new Promise((resolve, reject) => {
    uni.request({
      url: options.url,
      method: options.method,
      data: options.data,
      header: options.header,
      success: (res) => {
        // 隐藏加载中
        if (options.loading) {
          uni.hideLoading()
        }
        
        // 调试输出响应信息
        if (DEBUG) {
          console.log('[Response] 收到响应:', {
            url: options.url,
            statusCode: res.statusCode,
            data: res.data
          })
        }
        
        // 处理响应数据
        if (res.statusCode === 200) {
          // 根据后端返回的数据结构进行调整
          if (res.data.code === 200 || res.data.status === 'success') {
            resolve(res.data)
          } else {
            // 业务错误处理
            handleBusinessError(res.data)
            reject(res.data)
          }
        } else {
          // HTTP状态码错误处理
          handleHttpError(res.statusCode)
          reject(res)
        }
      },
      fail: (err) => {
        // 隐藏加载中
        if (options.loading) {
          uni.hideLoading()
        }
        
        // 调试输出错误信息
        if (DEBUG) {
          console.error('[Request] 请求失败:', {
            url: options.url,
            error: err
          })
        }
        
        // 网络错误处理
        handleNetworkError(err)
        reject(err)
      },
      complete: () => {
        // 未添加全局完成处理
      }
    })
  })
}

/**
 * 处理业务错误
 * @param {Object} error 错误信息
 */
function handleBusinessError(error) {
  const errorMap = {
    401: '未授权，请登录',
    403: '拒绝访问',
    404: '请求资源不存在',
    500: '服务器错误'
  }
  
  const message = error.message || errorMap[error.code] || '未知错误'
  
  // 调试输出业务错误
  if (DEBUG) {
    console.error('[Business Error] 业务错误:', error)
  }
  
  // 401 token过期处理
  if (error.code === 401) {
    // 清除token并跳转到登录页
    uni.removeStorageSync('token')
    uni.showModal({
      title: '提示',
      content: '登录已过期，请重新登录',
      showCancel: false,
      success: () => {
        uni.navigateTo({
          url: '/pages/user/user'
        })
      }
    })
    return
  }
  
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 处理HTTP错误
 * @param {Number} statusCode HTTP状态码
 */
function handleHttpError(statusCode) {
  const errorMap = {
    400: '请求参数错误',
    401: '未授权，请登录',
    403: '拒绝访问',
    404: '请求资源不存在',
    405: '请求方法不允许',
    408: '请求超时',
    500: '服务器内部错误',
    501: '服务未实现',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时'
  }
  
  const message = errorMap[statusCode] || `网络请求错误，状态码：${statusCode}`
  
  // 调试输出HTTP错误
  if (DEBUG) {
    console.error('[HTTP Error] HTTP状态码错误:', {
      statusCode: statusCode,
      message: message
    })
  }
  
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 处理网络错误
 * @param {Object} err 错误对象
 */
function handleNetworkError(err) {
  let message = '网络错误，请检查网络连接'
  
  if (err.errMsg.includes('timeout')) {
    message = '网络请求超时'
  } else if (err.errMsg.includes('abort')) {
    message = '网络请求被中止'
  }
  
  // 调试输出网络错误
  if (DEBUG) {
    console.error('[Network Error] 网络错误:', err)
  }
  
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

/**
 * GET请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 */
request.get = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'GET',
    ...options
  })
}

/**
 * POST请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 */
request.post = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'POST',
    ...options
  })
}

/**
 * PUT请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 */
request.put = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'PUT',
    ...options
  })
}

/**
 * DELETE请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 */
request.delete = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'DELETE',
    ...options
  })
}

// 同时提供命名导出和默认导出
export { request }
export default request