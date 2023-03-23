import { defHttp } from '/@/utils/http/axios';

enum Api {
  DictItemPage = '/base/dict-item/page',
  DictItemForm = '/base/dict-item/form',
  DictItem = '/base/dict-item',
  DictItemAdd = '/base/dict-item/add',
  DictItemUpdate = '/base/dict-item/update',
  DictItemDelete = '/base/dict-item/delete',
}

export const dictItemPage = (params?: any) => defHttp.get({ url: Api.DictItemPage, params });

export const dictItemForm = (params?: any) => defHttp.get({ url: Api.DictItemForm, params });

export const dictItemAdd = (data?: any) => defHttp.post({ url: Api.DictItemAdd, data });

export const dictItemUpdate = (data?: any) => defHttp.post({ url: Api.DictItemUpdate, data });

export const dictItemDelete = (data?: any) => defHttp.delete({ url: Api.DictItemDelete, data });
