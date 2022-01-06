import request from '@/utils/request';

// 红娘列表
export async function getMatchmakerList(params) {
  return request('/api/match-maker/paginate', {
    method: 'get',
    params: { ...params },
  });
}

// 修改红娘信息
export async function updateMatchmaker({ id, ...rest }) {
  return request(`/api/match-maker/${id}`, {
    method: 'patch',
    data: { ...rest },
  });
}

// 添加红娘
export async function addMatchmaker(data) {
  return request(`/api/match-maker`, {
    method: 'post',
    data: { ...data },
  });
}

export async function deleteMatchmaker({ id }) {
  return request(`/api/match-maker/${id}`, {
    method: 'delete',
    // data: { ...data },
  });
}
