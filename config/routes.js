export default [
  {
    path: '/auth',
    layout: false,
    routes: [
      {
        path: '/auth/login',
        layout: false,
        name: 'login',
        component: './auth/Login',
      },
      {
        path: '/auth',
        redirect: '/auth/login',
      },
      {
        name: 'register-result',
        path: '/auth/register-result',
        component: './auth/register-result',
      },
      {
        name: 'register',
        path: '/auth/register',
        component: './auth/register',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/user',
    name: 'userManagement',
    icon: 'user',
    routes: [
      {
        path: '/user',
        redirect: '/user/list',
      },
      {
        name: 'userList',
        path: '/user/list',
        component: './user/list',
      },
      {
        name: 'userDateEntry',
        path: '/user/data-entry',
        component: './user/data-entry',
      },
      {
        name: 'userAudit',
        path: '/user/audit',
        component: './user/audit',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/content',
    name: 'contentManagement',
    icon: 'fileText',
    routes: [
      {
        path: '/content',
        redirect: '/content/complaint/list',
      },
      {
        name: 'complaintList',
        path: '/content/complaint/list',
        component: './content/complaint',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/matchmaker',
    name: 'matchmakerManagement',
    icon: 'usergroupAdd',
    routes: [
      {
        path: '/matchmaker',
        redirect: '/matchmaker/list',
      },
      {
        name: 'matchmakerList',
        path: '/matchmaker/list',
        component: './matchmaker/list',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/user/list',
  },
  {
    component: '404',
  },
];