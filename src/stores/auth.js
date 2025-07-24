import { defineStore } from 'pinia'
import { wxLogin, wxAuthLogin, checkLogin } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userInfo: uni.getStorageSync('userInfo') || null, // 用户信息
    token: uni.getStorageSync('token') || null, // 从缓存中读取token
    isLogin: false // 登录状态
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
    
    // 完成登录流程（传入用户信息）
    async completeLogin(userInfoRes) {
      try {
        // 获取code
        const code = await wxLogin()
        console.log("code：", code)  // 只用于开发
        
        // 发送到后端验证
        const res = await wxAuthLogin(code)
        
        if (res.code === 200) {
          this.token = res.data.token
          this.userInfo = userInfoRes.userInfo
          this.isLogin = true
          
          // 存储到缓存
          uni.setStorageSync('token', res.data.token)
          uni.setStorageSync('userInfo', userInfoRes.userInfo)
          
          return Promise.resolve(res)
        } else {
          return Promise.reject(res)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 检查登录状态
    async checkLogin() {
      if (this.token) {
        try {
          const res = await checkLogin()
          if (res.code === 200) {
            this.isLogin = true
            return true
          }
        } catch (error) {
          this.clearAuth()
          return false
        }
      }
      return false
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