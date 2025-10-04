import request from '@/utils/request'

/**
 * 图片颜色提取 - 使用uni.uploadFile实现
 * @param {Object} file 图片文件对象
 * @returns Promise
 */
export function extractColorsFromImage(file) {
  return new Promise((resolve, reject) => {
    // 增加调试输出
    console.log('[ImageSearch] 开始上传图片:', file);
    
    uni.uploadFile({
      url: 'http://39.97.55.169:8080/api/v1/search/image',
      filePath: file.path || file.uri || file,
      name: 'image',
      header: {
        // 如果有token或其他认证信息，可以在这里添加
        // 'Authorization': 'Bearer ' + uni.getStorageSync('token')
      },
      success: (uploadFileRes) => {
        try {
          // 增加调试输出
          console.log('[ImageSearch] 接口响应原始数据:', uploadFileRes);
          
          // 解决中文乱码问题
          let data;
          // 尝试直接解析
          try {
            data = JSON.parse(uploadFileRes.data);
          } catch (e) {
            // 如果直接解析失败，尝试处理编码问题
            const decodedData = decodeURIComponent(escape(uploadFileRes.data));
            data = JSON.parse(decodedData);
          }
          
          // 增加解析后数据的调试输出
          console.log('[ImageSearch] 解析后数据:', data);
          
          resolve(data);
        } catch (error) {
          console.error('[ImageSearch] 解析响应数据失败:', error);
          reject(new Error('解析响应数据失败: ' + error.message));
        }
      },
      fail: (error) => {
        console.error('[ImageSearch] 上传失败:', error);
        reject(error);
      }
    });
  });
}