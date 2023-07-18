export enum PageEnum {
  // basic login path
  BASE_LOGIN = '/login',
  BASE_GITEE_SOCIAL_LOGIN = '/social/oauth2/callback/GITEE',
  BASE_BAIDU_SOCIAL_LOGIN = '/social/oauth2/callback/BAIDU',
  BASE_DINGTALK_SOCIAL_LOGIN = '/social/oauth2/callback/DINGTALK',

  // basic home path
  BASE_HOME = '/home/welcome',
  // error page path
  ERROR_PAGE = '/exception',
  // error log page path
  ERROR_LOG_PAGE = '/error-log/list',
}
export const PageWrapperFixedHeightKey = 'PageWrapperFixedHeight';
