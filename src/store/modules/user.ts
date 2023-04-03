import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import {
  ROLES_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
  APPLICATION_ID_KEY,
  TENANT_ID_KEY,
  ORGANIZATION_ID_KEY,
  MAINTAINER_ORGANIZATION_IDS_KEY,
  MONITORING_UNIT_ORGANIZATION_IDS_KEY,
  EXTERNAL_USER_ORGANIZATION_IDS_KEY,
} from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams, LogoutParams } from '/@/api/sys/model/userModel';
import { AccessPrincipal, SocialSource } from '/@/api/sys/model/socialModel';
import { doLogout, getUserInfo, loginApi, socialLoginApi } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { isArray } from '/@/utils/is';
import { h } from 'vue';

import { orgTree } from '/@/api/system/org';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  applicationId?: string;
  tenantId?: string | number;
  organizationId?: string;
  maintainerOrgIdList: string[];
  monitoringUnitOrgIdList: string[];
  externalUserOrgIdList: string[];
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // 用户信息
    userInfo: null,
    // token
    token: undefined,
    // 角色列表
    roleList: [],
    // session过期时间
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    // 应用id
    applicationId: undefined,
    //租户id
    tenantId: '',
    //组织id
    organizationId: '',
    // 维护方组织机构列表
    maintainerOrgIdList: [],
    // 监管单位组织机构列表
    monitoringUnitOrgIdList: [],
    // 使用方组织机构列表
    externalUserOrgIdList: [],
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getApplicationId(): string {
      return this.applicationId || getAuthCache<string>(APPLICATION_ID_KEY);
    },
    getTenantId(): string | number {
      return this.tenantId || getAuthCache<string | number>(TENANT_ID_KEY);
    },
    getOrganizationId(): string {
      return this.organizationId || getAuthCache<string>(ORGANIZATION_ID_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getMaintainerOrgIdList(): string[] {
      return this.maintainerOrgIdList.length > 0
        ? this.maintainerOrgIdList
        : getAuthCache<string[]>(MAINTAINER_ORGANIZATION_IDS_KEY);
    },
    getMonitoringUnitOrgIdList(): string[] {
      return this.monitoringUnitOrgIdList.length > 0
        ? this.monitoringUnitOrgIdList
        : getAuthCache<string[]>(MONITORING_UNIT_ORGANIZATION_IDS_KEY);
    },
    getExternalUserOrgIdList(): string[] {
      return this.externalUserOrgIdList.length > 0
        ? this.externalUserOrgIdList
        : getAuthCache<string[]>(EXTERNAL_USER_ORGANIZATION_IDS_KEY);
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setApplicationId(applicationId: string | undefined) {
      this.applicationId = applicationId ? applicationId : ''; // for null or undefined value
      setAuthCache(APPLICATION_ID_KEY, applicationId);
    },
    setTenantId(tenantId: string | undefined) {
      this.tenantId = tenantId ? tenantId : ''; // for null or undefined value
      setAuthCache(TENANT_ID_KEY, tenantId);
    },
    setOrganizationId(organizationId: string | undefined) {
      this.organizationId = organizationId ? organizationId : ''; // for null or undefined value
      setAuthCache(ORGANIZATION_ID_KEY, organizationId);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    setMaintainerOrgIdList(maintainerOrgIdsList: string[]) {
      this.maintainerOrgIdList = maintainerOrgIdsList;
      setAuthCache(MAINTAINER_ORGANIZATION_IDS_KEY, maintainerOrgIdsList);
    },
    setMonitoringUnitOrgIdList(monitoringUnitOrgIdList: string[]) {
      this.monitoringUnitOrgIdList = monitoringUnitOrgIdList;

      setAuthCache(MONITORING_UNIT_ORGANIZATION_IDS_KEY, monitoringUnitOrgIdList);
    },
    setExternalUserOrgIdList(externalUserOrgIdList: string[]) {
      this.externalUserOrgIdList = externalUserOrgIdList;

      setAuthCache(EXTERNAL_USER_ORGANIZATION_IDS_KEY, externalUserOrgIdList);
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.applicationId = '';
      this.organizationId = '';
      this.roleList = [];
      this.sessionTimeout = false;
      this.maintainerOrgIdList = [];
      this.monitoringUnitOrgIdList = [];
      this.externalUserOrgIdList = [];
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { access_token } = data;
        console.log('data', data);

        // save token
        this.setToken(access_token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async socialLogin(
      source: SocialSource,
      accessPrincipal: AccessPrincipal,
      params: {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode } = params;
        const data = await socialLoginApi(source, accessPrincipal, mode);
        const { access_token } = data;
        // save token
        this.setToken(access_token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      // const organizations = await this.getOrganizationAction();

      await this.setOrganizationAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      const { roles = [], employeeId, organizationId } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);

      // 如果为空
      if (!this.getApplicationId) {
        this.setApplicationId(userInfo.applicationId);
      }
      // if (!this.getOrganizationId) {
      //   this.setOrganizationId(organizationId);
      // }
      // if (!this.getDepartmentId) {
      //   this.setDepartmentId(departmentId);
      // }

      // TODO: 解决取不到organizationId的情况
      // this.setApplicationId(userInfo.applicationId);
      this.setOrganizationId(organizationId);

      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout({ token: this.getToken }, 'none');
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      this.setApplicationId(undefined);
      this.setOrganizationId(undefined);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },

    async setOrganizationAction() {
      const organizations = await orgTree();

      console.log('组织列表', organizations);

      const monitoringUnitOrgIdList: string[] = [],
        externalUserOrgIdList: string[] = [],
        maintainerOrgIdList: string[] = [];

      organizations.forEach((org) => {
        if (org.organizationType === 'GOV_SUPERVISE_UNIT') {
          monitoringUnitOrgIdList.push(org.key);
        }

        if (org.organizationType === 'GOV_USE_UNIT') {
          externalUserOrgIdList.push(org.key);
        }

        if (org.organizationType === 'GOV_MAINT_UNIT') {
          maintainerOrgIdList.push(org.key);
        }
      });

      this.setMonitoringUnitOrgIdList(monitoringUnitOrgIdList);
      this.setExternalUserOrgIdList(externalUserOrgIdList);
      this.setMaintainerOrgIdList(maintainerOrgIdList);

      // return organizations;
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
