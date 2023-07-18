import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import {
  PAGE_NOT_FOUND_ROUTE,
  REDIRECT_ROUTE,
  ACCOUNT_ROUTE,
  HOME_ROUTE,
} from '/@/router/routes/basic';

import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';

import feat from './modules/demo/feat';

// import.meta.globEager() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.globEager('./modules/**/*.ts');
const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ACCOUNT_ROUTE, HOME_ROUTE, ...routeModuleList];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

// NOTE: 驾驶舱页面路由单独设置
export const DataViewRoute: AppRouteRecordRaw = {
  path: '/dataview',
  name: 'DataView',
  component: () => import('/@/views/dataview/index.vue'),
  meta: {
    title: t('驾驶舱'),
  },
  redirect: '/dataview/home',
  children: [
    {
      path: '/biz/dataview/home',
      name: 'DataViewHome',
      component: () => import('/@/views/dataview/home/index.vue'),
      meta: {
        title: t('驾驶舱'),
      },
    },
    {
      path: '/biz/dataview/detail',
      name: 'DataViewDetail',
      component: () => import('/@/views/dataview/detail/index.vue'),
      meta: {
        title: t('驾驶舱'),
      },
    },
  ],
};

export const SocialLoginRoute: AppRouteRecordRaw = {
  path: '/social/oauth2/callback/:source',
  name: 'SocialSignInCallback',
  component: () => import('/@/views/sys/login/SocialSignInCallback.vue'),
  meta: {
    title: '社交登录 Callback',
  },
};

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  DataViewRoute,
  LoginRoute,
  SocialLoginRoute,
  RootRoute,
  ...mainOutRoutes,
  feat,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  ACCOUNT_ROUTE,
  HOME_ROUTE,
];
