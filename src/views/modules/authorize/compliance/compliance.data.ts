import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 接口
import { optionsListApi } from '/@/api/sys/dict';

import { checkApplicationCode } from '/@/api/authorize/compliance';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const dataItemStatusOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('应用名称'),
      field: 'complianceName',
      component: 'Input',
    },
    {
      label: t('应用编码'),
      field: 'complianceCode',
      component: 'Input',
    },
    {
      label: t('后端应用'),
      field: 'showFlag',
      component: 'Select',
      componentProps: {
        options: tfOptions,
        allowClear: true,
      },
    },
    {
      label: t('状态'),
      field: 'status',
      component: 'Select',
      componentProps: {
        options: dataItemStatusOptions,
        allowClear: true,
      },
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('用户名'),
    dataIndex: 'principalName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('客户端ID'),
    dataIndex: 'clientId',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('操作系统'),
    dataIndex: 'osName',
    width: 90,
    align: 'center',
  },
  {
    title: t('浏览器'),
    dataIndex: 'browserName',
    width: 90,
    align: 'center',
  },
  {
    title: t('operation'),
    dataIndex: 'operation',
    width: 90,
    align: 'center',
  },

  {
    title: t('创建时间'),
    dataIndex: 'createTime',
    sorter: true,
    width: 100,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('应用名称'),
    field: 'complianceName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('应用简称(可选)'),
    field: 'abbreviation',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('应用图标(可选)'),
    field: 'logo',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('应用主页(可选)'),
    field: 'homepage',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('应用类型'),
    field: 'complianceType',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: '回调地址(可多个逗号分隔)',
    field: 'redirectUris',
    component: 'InputTextArea',
    colProps: { lg: 24, md: 24 },
  },
  {
    label: t('Token有效期'),
    field: 'accessTokenValidity',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('RefreshToken有效期'),
    field: 'refreshTokenValidity',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('客户端密钥过期时间'),
    field: 'clientSecretExpiresAt',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: '客户端密钥集URL',
    field: 'jwkSetUrl',
    component: 'InputTextArea',
    colProps: { lg: 24, md: 24 },
  },
  {
    label: t('是否需要 Proof Key'),
    field: 'requireProofKey',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('是否需要认证确认'),
    field: 'requireAuthorizationConsent',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('是否允许重用 Refresh Token'),
    field: 'reuseRefreshTokens',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('认证模式'),
    field: 'authorizationGrantTypes',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('认证模式'),
    field: 'complianceCode',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
    rules: [
      { required: true },
      {
        validator(_rule, value) {
          return new Promise((resolve, reject) => {
            if (!value || value === '') return resolve();
            checkApplicationCode(idRef.value || '', value)
              .then((res) => (res ? resolve() : reject(t('应用编码已存在'))))
              .catch((err) => reject(err.message || t('验证失败')));
          });
        },
      },
    ],
  },
  {
    label: t('后端应用'),
    field: 'showFlag',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
      isBtn: true,
    },
  },
  {
    label: t('状态'),
    field: 'status',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'data_item_status',
      },
      isBtn: true,
    },
  },
  {
    label: t('排序'),
    field: 'sortValue',
    required: true,
    component: 'InputNumber',
    helpMessage: '升序',
    componentProps: {
      maxlength: 10,
    },
  },
];
