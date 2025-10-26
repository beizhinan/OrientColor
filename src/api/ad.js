import request from '@/utils/request';

/**
 * 获取开屏海报
 * URL: /ad/photo
 * 方法: GET
 * @returns {Promise}
 */
export function getAdPhoto() {
  return request({
    url: '/ad/photo',
    method: 'GET'
  });
}