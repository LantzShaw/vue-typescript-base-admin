import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/upms/my-menu',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = (params?: any) => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList, params });
};
