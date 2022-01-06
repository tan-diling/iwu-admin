import request from '@/utils/request';

export async function getSettings(params) {
  return request('/api/setting', {
    method: 'get',
    params: { ...params },
  });
}
