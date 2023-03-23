import { defHttp } from '/@/utils/http/axios';

enum Api {
  Ownership = '/upms/ownership',
  OwnershipAdd = '/upms/ownership/add',
  OwnershipUpdate = '/upms/ownership/update',
  OwnershipDelete = '/upms/ownership/delete',
  OwnershipForm = '/upms/ownership/form',
  OwnershipRevised = '/upms/ownership/revised',
  OwnershipTreeForEdit = '/upms/ownership/tree-for-edit',
  OwnershipTree = '/upms/ownership/tree',
  OwnershipOwnAuthority = '/upms/ownership/own-authority',
}

export const ownershipForm = (params?: any) => defHttp.get({ url: Api.OwnershipForm, params });

export const ownershipTree = (params?: any) => defHttp.get({ url: Api.OwnershipTree, params });

export const ownershipTreeForEdit = (params?: any) =>
  defHttp.get({ url: Api.OwnershipTreeForEdit, params });

export const ownershipAdd = (data?: any) => defHttp.post({ url: Api.OwnershipAdd, data });

export const ownershipUpdate = (data?: any) => defHttp.post({ url: Api.OwnershipUpdate, data });

export const ownershipDelete = (data?: any) => defHttp.delete({ url: Api.OwnershipDelete, data });

export const ownershipRevised = (data?: any) => defHttp.post({ url: Api.OwnershipRevised, data });

export const ownershipOwnAuthority = (params?: any) =>
  defHttp.get({ url: Api.OwnershipOwnAuthority, params });
