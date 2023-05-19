import type { AppRouteRecordRaw } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
import {
  REDIRECT_NAME,
  LAYOUT,
  EXCEPTION_COMPONENT,
  PAGE_NOT_FOUND_NAME,
} from '/@/router/constant';

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: LAYOUT,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PAGE_NOT_FOUND_NAME,
      component: EXCEPTION_COMPONENT,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
};

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect',
  component: LAYOUT,
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)/:_redirect_type(.*)/:_origin_params(.*)',
      name: REDIRECT_NAME,
      component: () => import('/@/views/sys/redirect/index.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
};

export const ERROR_LOG_ROUTE: AppRouteRecordRaw = {
  path: '/error-log',
  name: 'ErrorLog',
  component: LAYOUT,
  redirect: '/error-log/list',
  meta: {
    title: 'ErrorLog',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'list',
      name: 'ErrorLogList',
      component: () => import('/@/views/sys/error-log/index.vue'),
      meta: {
        title: t('routes.basic.errorLogList'),
        hideBreadcrumb: true,
        currentActiveMenu: '/error-log',
      },
    },
  ],
};

export const ACCOUNT_ROUTE: AppRouteRecordRaw = {
  path: '/account',
  name: 'AccountPage',
  component: LAYOUT,
  redirect: '/account/settings',
  meta: {
    title: '个人页',
    icon: 'user',
    // ignoreKeepAlive: true,
    // hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'settings',
      name: 'AccountSettingPage2',
      component: () => import('/@/views/account/settings/index.vue'),
      meta: {
        title: t('个人设置'),
        // ignoreKeepAlive: true,
      },
    },
  ],
};

export const HOME_ROUTE: AppRouteRecordRaw = {
  path: '/home',
  name: 'HomePage',
  component: LAYOUT,
  redirect: '/home/welcome',
  meta: {
    title: '首页',
  },
  children: [
    {
      path: 'welcome',
      name: 'HomeWelcomePage',
      component: () => import('/@/views/sys/home/index.vue'),
      meta: {
        title: t('首页'),
        affix: true,
      },
    },
  ],
};
