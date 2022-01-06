const TokenKey = 'accessToken';
const RefreshKey = 'refreshToken';

export function getToken() {
  return localStorage.getItem(TokenKey) || '';
}

export function getRefreshToken() {
  return localStorage.getItem(RefreshKey) || '';
}

export function setToken(token) {
  const { accessToken, refreshToken } = token;
  localStorage.setItem(TokenKey, accessToken);
  localStorage.setItem(RefreshKey, refreshToken);
}

export function removeToken() {
  localStorage.removeItem(TokenKey);
  localStorage.removeItem(RefreshKey);
}

// export function fetchRefreshToken(params = {}) {
//   const { noNavigate } = params;
//   const refreshToken = getRefreshToken();
//   return axios
//     .post(`/api/auth/refresh`, { token: refreshToken })
//     .then(res => {
//       // console.log('refreshToken', res);
//       return Promise.resolve(res.data);
//     })
//     .catch(error => {
//       if (!noNavigate)
//         Router.replace({
//           path: '/login',
//           query: {
//             redirect: Router.currentRoute.fullPath, // 登录之后跳转到对应页面
//           },
//         });
//       return Promise.reject(error.data);
//     });
// }

export function getUser() {
  return localStorage.getItem('user') || '';
}

export function setUser(user) {
  return localStorage.setItem('user', user);
}
