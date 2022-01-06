import { extend } from 'umi-request';
import { request as umiRequest, history } from 'umi';
import { getToken, removeToken, setToken, getRefreshToken } from './auth';

const request = extend({
  // prefix: '/api',
  timeout: 30000,
  headers: {
    // 'Content-Type': 'multipart/form-data',
    // 'Content-Type': 'application/json; charset=utf-8',
  },
});

const errorHandler = (error) => {
  if (error.data) {
    throw error.data;
  } else {
    throw error.message;
  }
};

request.interceptors.request.use((url, options) => {
  return {
    url: `${url}`,
    options: {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getToken()}`,
      },
      errorHandler,
    },
  };
});

request.interceptors.response.use(async (response, options) => {
  const data = await response.clone().json();
  const { code } = data;
  // console.log('request data222', data);
  if (code === 401) {
    // const refreshResponse = await umiRequest('/api/auth/refresh', {
    //   method: 'post',
    //   data: { token: AccessToken },
    // });
    // console.log('refreshResponse', refreshResponse);
    return umiRequest('/api/auth/refresh', {
      method: 'post',
      data: { token: getRefreshToken() },
    })
      .then((res) => {
        const {
          data: { accessToken, refreshToken },
        } = res;
        setToken({ accessToken, refreshToken });
        const { url, ...restOptions } = options;
        // console.log('new token', {
        //   ...restOptions,
        //   headers: { ...restOptions.headers, Authorization: `Bearer ${accessToken}` },
        // });
        return request(url, {
          ...restOptions,
          headers: { ...restOptions.headers, Authorization: `Bearer ${accessToken}` },
        });
      })
      .catch((err) => {
        removeToken();
        const last = history.location.pathname;
        // console.log('token err', err);
        // console.log('token err data', data);
        history.push({
          pathname: '/auth/login',
          query: {
            redirect: last, // 登录之后跳转到对应页面
          },
        });
      });
  }
  return response;
});

export default request;
