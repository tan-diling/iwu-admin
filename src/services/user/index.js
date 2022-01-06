import request from '@/utils/request';

// 用户列表
export async function getUserList(params) {
  return request('/api/user/profile/paginateAll', {
    method: 'get',
    params: { ...params },
  });
}

// 封禁
export async function requestUserLock(data) {
  return request('/api/user/profile/audit/lock', {
    method: 'put',
    data: { ...data },
  });
}

// 解封
export async function requestUserUnlock(data) {
  return request('/api/user/profile/audit/unlock', {
    method: 'put',
    data: { ...data },
  });
}

// 修改用户信息
export async function updateUser({ id, ...rest }) {
  return request(`/api/user/profile/${id}`, {
    method: 'patch',
    data: { ...rest },
  });
}

// 添加用户
export async function addUser(data) {
  return request(`/api/user/profile`, {
    method: 'post',
    data: { ...data },
  });
}

// 审核成功
export async function auditAccept(data) {
  return request(`/api/user/profile/audit/accept`, {
    method: 'put',
    data: { ...data },
  });
}

// 审核失败
export async function auditRefuse(data) {
  return request(`/api/user/profile/audit/refuse`, {
    method: 'put',
    data: { ...data },
  });
}
