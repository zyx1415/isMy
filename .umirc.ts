/*
 * @Description: 未添加描述
 * @Date: 2021-02-23 09:37:03
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-29 23:39:23
 */
import { defineConfig } from 'umi';

export default defineConfig({
  request: {
    dataField: '',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', redirect: '/wm' },
    {
      path: '/wm',
      component: '@/layouts/index',
      routes: [
        {
          path: '/wm',
          component: './Home',
          title: '闻梦拼车 首页',
          exact: true,
        },
        {
          path: '/wm/CarPoolHome',
          component: './CarPoolHome',
          title: '我要拼车',
          exact: true,
        },
        {
          path: '/wm/Contact',
          component: './Contact',
          title: '意见反馈',
          exact: true,
        },
        {
          path: '/wm/UserInfo',
          component: './UserInfo',
          title: '我的信息',
          exact: true,
        },
        {
          path: '/wm/Driver',
          component: './Driver',
          title: '司机找单',
          exact: true,
        },
        {
          path: '/wm/DriverOrder',
          component: './DriverOrder',
          title: '我的抢单',
          exact: true,
        },
      ],
    },
  ],
  fastRefresh: {},
  history: {
    type: 'hash',
  },
  base: '/',
  publicPath: './',
  hash: true,
});
