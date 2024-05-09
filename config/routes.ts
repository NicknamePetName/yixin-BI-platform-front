export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  // { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  { path: '/', redirect: '/add_chart' },
  {
    path: '/add_chart',
    name: '智能分析',
    icon: 'barChart',
    component: './AddChart',
  },
  {
    path: '/add_chart_async',
    name: '智能分析-异步',
    icon: 'barChart',
    component: './AddChartAsync',
  },
  {
    path: '/add_chart_async_mq',
    name: '智能分析-MQ',
    icon: 'barChart',
    component: './AddChartAsyncMq',
  },
  {
    path: '/my_chart',
    name: '我的图表',
    icon: 'pieChart',
    component: './MyChart',
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  // { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
