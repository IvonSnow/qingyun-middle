export default [
  // 登录页
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },

  // 博客
  {
    name: '博客中心',
    icon: 'snippets',
    path: '/blog',
    routes: [
      {
        name: '博客管理',
        path: '/blog/manage',
        component: './blog/BlogManage',
      },
      {
        name: '博客标签',
        path: '/blog/feature',
        component: './blog/BlogFeature',
      },
      {
        name: '博客类目',
        path: '/blog/categories',
        component: './blog/BlogCategories',
      },
    ],
  },

  // 管理
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },

  // welcome和其他
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/welcome',
    component: './Welcome',
  },
  {
    component: './404',
  },
];
