import { defHttp } from '/@/utils/http/axios';

enum Api {
  Login = '/oauth/token',
  Logout = '/oauth/logout',
  GetUserInfo = '/system/sysAuth/getUserInfo',
  GetPermCode = '/getPermCode',
  GetDictList = '/system/sysDict/page',
}

export const fileList = (params?: any) => defHttp.get({ url: '/base/file/list', params });

export const filePage = (params?: any) => defHttp.get({ url: '/base/file/page', params });

export const fileGet = (params?: any) => defHttp.get({ url: '/base/file/detail', params });

export const fileForm = (params?: any) => defHttp.get({ url: '/base/file/form', params });

export const fileSelect = (params?: any) => defHttp.get({ url: '/base/file/option', params });

export const fileAdd = (data?: any) => defHttp.post({ url: '/base/file/add', data });

export const fileUpdate = (data?: any) => defHttp.post({ url: '/base/file/edit', data });

export const fileDelete = (data?: any) => defHttp.post({ url: '/base/file/delete', data });

export const checkConfKey = (id: string, confKey: string) =>
  defHttp.get({
    url: '/system/sysFile/checkConfKey',
    params: { id, confKey },
  });

export const findAvailableApplicationResourceList = (params?: any) =>
  defHttp.get({ url: '/system/sysApplication/findAvailableApplicationResourceList', params });

export const fileDownload = (params?: any) =>
  defHttp.get(
    { url: '/base/file/download1', params, responseType: 'blob' },
    {
      isTransformResponse: false,
    },
  );

export const fileShow = (fileName?: any) =>
  defHttp.get(
    { url: '/base/file/show/' + fileName, responseType: 'arraybuffer' },
    {
      isTransformResponse: false,
    },
  );
