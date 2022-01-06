import request from '@/utils/request';
// import { request } from 'umi';
import { getToken } from '@/utils/auth';

export async function login(data) {
  return request('/api/auth/login/admin', {
    method: 'post',
    data,
  });
}

export async function logout(data) {
  return request('/api/auth/logout', {
    method: 'post',
    data: { token: getToken(), ...data },
  });
}
