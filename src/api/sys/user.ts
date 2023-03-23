import { defHttp } from '/@/utils/http/axios';
import { RequestEnum, ResultEnum, ContentTypeEnum } from '/@/enums/httpEnum';
import { LoginParams, LogoutParams, LoginResultModel, GetUserInfoModel } from './model/userModel';
import { AccessPrincipal, SocialSource } from './model/socialModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/oauth2/token',
  Logout = '/oauth2/revoke',
  GetUserInfo = '/upms/user-info',
  GetPermCode = '/upms/my-perm-code',
  GetMyApplication = '/upms/my-application',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
      headers: {
        'Content-Type': ContentTypeEnum.FORM_URLENCODED,
      },
    },
    {
      isTransformResponse: false,
      errorMessageMode: mode,
      withToken: false,
    },
  );
}

export function socialLoginApi(
  source: SocialSource,
  accessPrincipal: AccessPrincipal,
  mode: ErrorMessageMode = 'modal',
  oidc = false,
) {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params: oidc
        ? { ...accessPrincipal, grant_type: 'social_credentials', source: source, scope: 'openid' }
        : { ...accessPrincipal, grant_type: 'social_credentials', source: source },
      headers: {
        'Content-Type': ContentTypeEnum.FORM_URLENCODED,
      },
    },
    {
      isTransformResponse: false,
      errorMessageMode: mode,
      withToken: false,
    },
  );
}

export function getSocialList() {
  return defHttp.get({ url: '/open/identity/sources' });
}
/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function getMyApplication() {
  return defHttp.get({ url: Api.GetMyApplication });
}

export function getUserOrganizations(params?: any) {
  return defHttp.get({ url: '/upms/my-organization', params });
}

export function getUserDepartments(params?: any) {
  return defHttp.get({ url: '/upms/my-department', params });
}

export function selectDepart(data?: any) {
  return defHttp.post({ url: '/upms/my-application5', data });
}
export function getUserTenants() {
  return defHttp.get({ url: '/upms/my-tenant' });
}

export function doLogout(params: LogoutParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.Logout,
      params,
      headers: {
        'Content-Type': ContentTypeEnum.FORM_URLENCODED,
      },
    },
    {
      isTransformResponse: false,
      errorMessageMode: mode,
      withToken: false,
    },
  );
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
