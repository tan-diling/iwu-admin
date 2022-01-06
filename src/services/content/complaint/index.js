import request from '@/utils/request';

// 投诉列表
export async function getComplaintList(params) {
  return request('/api/complaint/paginate', {
    method: 'get',
    params: { ...params },
  });
}

// 投诉反馈
export async function complaintFeedback({ id, ...rest }) {
  return request(`/api/complaint/${id}`, {
    method: 'patch',
    data: { ...rest },
  });
}
