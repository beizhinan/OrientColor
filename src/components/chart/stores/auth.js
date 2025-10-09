import { defineStore } from 'pinia'
import { wxLogin, wxAuthLogin, getWxUserInfo,checkLogin } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userInfo: uni.getStorageSync('userInfo') || null, // 用户信息
    token: uni.getStorageSync('token') || null, // 从缓存中读取token
    isLogin: false, // 登录状态
	user_id: null
  }),
  
  actions: {
    // 微信登录（只获取code）
    async wxLogin() {
      try {
        // 获取微信code
        const code = await wxLogin()
        return Promise.resolve(code)
      } catch (error) {
        return Promise.reject(error)
      }
    },
	
	//解析token
	parseJWT(tokens) {
	  try {
	    // 1. 拆分 token，获取 Payload 部分（第二部分）
	    const base64Url = tokens.split('.')[1]
	    if (!base64Url) {
	      throw new Error('无效的 token 格式')
	    }
	
	    // 2. 处理 Base64URL 编码（替换特殊字符，补充 padding）
	    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') // 替换 URL 安全字符
	    const padding = base64.length % 4
	    if (padding) {
	      const padLength = 4 - padding
	      base64 += '='.repeat(padLength) // 补充 Base64 必要的 padding
	    }
	
	    // 3. Base64 解码为 JSON 字符串
	    const jsonPayload = decodeURIComponent(
	      atob(base64) // 解码 Base64
	        .split('')
	        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)) // 转换为 URI 编码
	        .join('')
	    )
	
	    // 4. 转换为 JSON 对象并返回
	    return JSON.parse(jsonPayload)
	  } catch (error) {
	    console.error('解析 token 失败：', error.message)
	    return null
	  }
	},
    
    // 完成登录流程
    async completeLogin() {
      try {
        // 先获取用户信息（需用户主动触发）
        const userInfoRes = await getWxUserInfo()
		console.log(userInfoRes)
        
        // 检查是否获取到用户信息
        if (!userInfoRes.userInfo) {
          return Promise.reject(new Error('获取用户信息失败'))
        }

        // 获取code（调用当前store的wxLogin方法）
        const code = await this.wxLogin()
        console.log("code：", code)  // 只用于开发
        
        // 发送到后端验证
        const res = await wxAuthLogin(code)
		// const res = {
		// 	// 测试数据，为了通过验证
		// 	code:200,
		// 	success:true,
		// 	data:{
		// 		token:"didjis",
		// 		data:[]
		// 	}
		// }
        console.log("res：", res)
		
		// 解析 token
		const payload = this.parseJWT(res.token)
		
		if (payload) {
		  console.log('解析结果：', payload)
		  this.user_id = payload.sub
		  console.log("赋值：",this.user_id,"  原值",payload.sub)
		}
        
        if (res) {
          //this.token = res.data.token
		  this.token =res.token
          this.userInfo = userInfoRes.userInfo
          this.isLogin = true
		  
          
          // 存储到缓存
          uni.setStorageSync('token', res.token)
          uni.setStorageSync('userInfo', userInfoRes.userInfo)
          
          return Promise.resolve(res)
        } else {
          return Promise.reject(res)
        }
      } catch (error) {
        this.clearAuth()
        return Promise.reject(error)
      }
    },
    
    // 检查登录状态（仅验证本地状态，不自动登录）
    checkLogin() {
      // 检查本地是否有token和用户信息
      if (this.token && this.userInfo) {
        this.isLogin = true;
        return true;
      }
      
      // 从storage同步最新状态
      const storedToken = uni.getStorageSync('token');
      const storedUserInfo = uni.getStorageSync('userInfo');
      
      if (storedToken && storedUserInfo) {
        this.token = storedToken;
        this.userInfo = storedUserInfo;
        this.isLogin = true;
        return true;
      }
      
      // 未登录状态
      this.isLogin = false;
      return false;
    },
    
    // 验证token有效性（通过后端接口）
    async validateLogin() {
      if (!this.checkLogin()) {
        return false;
      }
      
      try {
        const res = await checkLogin()
        if (res.code === 200) {
          this.isLogin = true;
          return true;
        } else {
          this.clearAuth();
          return false;
        }
      } catch (error) {
        console.error("验证登录状态失败:", error);
        this.clearAuth();
        return false;
      }
    },
    
    // 清除认证信息
    clearAuth() {
      this.token = null
      this.userInfo = null
      this.isLogin = false
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    }
  },
  
  getters: {
    // 获取用户昵称
    nickName: (state) => state.userInfo?.nickName || '未登录',
    // 获取用户头像
    avatarUrl: (state) => state.userInfo?.avatarUrl || '/static/default-avatar.png'
  }
})
    