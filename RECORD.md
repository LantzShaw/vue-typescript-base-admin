# Record

### Note

**1. `.vue` 页面只有一个根节点，因为外层有`Transition` 包裹了**

### Code

```ts
import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';

// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';

// 接口
import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const onlineStatusOptions = ref<any[]>([]);
export const deleteStatusOptions = ref<any[]>([]);
export const alarmStatusOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);
export const grantTypesOptions = ref<any[]>([]);
export const scopeOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 6, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('设备名称'),
      field: 'deviceName',
      component: 'Input',
    },
    {
      label: t('设备编号'),
      field: 'deviceNo',
      component: 'Input',
    },
    {
      label: t('是否报警'),
      field: 'dtuipIsAlarms',
      component: 'Select',
      componentProps: {
        options: alarmStatusOptions,
        allowClear: true,
      },
    },
    {
      label: t('是否删除'),
      field: 'dtuipIsDelete',
      component: 'Select',
      componentProps: {
        options: deleteStatusOptions,
        allowClear: true,
      },
    },
    {
      label: t('是否在线'),
      field: 'dtuipIsLine',
      component: 'Select',
      componentProps: {
        options: onlineStatusOptions,
        allowClear: true,
      },
    },
  ],
};

const isShowAuthenticationSigningAlgorithm = (clientAuthenticationMethods: string[]) => {
  if (Array.isArray(clientAuthenticationMethods)) {
    return (
      clientAuthenticationMethods.includes('private_key_jwt') ||
      clientAuthenticationMethods.includes('client_secret_jwt')
    );
  }
  return false;
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('设备名称'),
    dataIndex: 'deviceName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('设备编号'),
    dataIndex: 'deviceNo',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('设备平台添加时间'),
    dataIndex: 'dtuipCreateDate',
    width: 150,
    align: 'center',
    ellipsis: true,
    sorter: true,
  },
  {
    title: t('是否报警'),
    dataIndex: 'dtuipIsAlarms',
    width: 90,
    align: 'center',
  },
  {
    title: t('是否删除'),
    dataIndex: 'dtuipIsDelete',
    width: 90,
    align: 'center',
  },
  {
    title: t('是否在线'),
    dataIndex: 'dtuipIsLine',
    width: 90,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('设备名称'),
    field: 'deviceName',
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
    field: 'applicationType',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'application_type',
      },
    },
  },
  {
    label: t('令牌时效'),
    field: 'accessTokenValidity',
    component: 'InputNumber',
    componentProps: {
      maxlength: 10,
      placeholder: '单位秒',
    },
    required: true,
  },
  {
    label: t('刷新时效'),
    field: 'refreshTokenValidity',
    component: 'InputNumber',
    componentProps: {
      maxlength: 10,
      placeholder: '单位秒',
    },
    required: true,
  },
  {
    label: t('客户端密钥过期时间'),
    field: 'clientSecretExpiresAt',
    component: 'DatePicker',
    componentProps: {
      style: { width: '100%' },
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    required: true,
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
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
  {
    label: t('是否需要认证确认'),
    field: 'requireAuthorizationConsent',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
  {
    label: t('是否允许重用 Refresh Token'),
    field: 'reuseRefreshTokens',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
  {
    label: t('认证模式'),
    field: 'authorizationGrantTypes',
    component: 'CheckboxGroup',
    componentProps: {
      options: [],
    },
  },
  {
    label: '回调地址(可多个逗号分隔)',
    field: 'redirectUris',
    component: 'InputTextArea',
    colProps: { lg: 24, md: 24 },
    dynamicRules: ({ values }) => {
      if (Array.isArray(values.authorizationGrantTypes)) {
        if (values.authorizationGrantTypes.includes('authorization_code')) {
          return [{ required: true, message: '回调地址必填' }];
        }
      }

      return [];
    },
  },
  {
    label: t('客户端验证模式'),
    field: 'clientAuthenticationMethods',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'authentication_method',
      },
      mode: 'multiple',
    },
  },
  {
    label: t('令牌端点认证签名算法'),
    field: 'authenticationSigningAlgorithm',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'signature',
      },
    },
    ifShow: ({ values }) =>
      isShowAuthenticationSigningAlgorithm(values.clientAuthenticationMethods),
  },
  {
    label: t('OIDC端点认证签名算法'),
    field: 'idTokenSignatureAlgorithm',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'signature',
      },
    },
  },
  {
    label: t('Client Id'),
    field: 'clientId',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
    ifShow: ({}) => unref(isUpdate),
  },
  {
    label: t('Client Secret'),
    field: 'clientSecret',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
    ifShow: ({}) => unref(isUpdate),
  },
  {
    label: t('应用范围'),
    field: 'scopes',
    component: 'CheckboxGroup',
    componentProps: {
      options: [],
    },
  },
];
```

### Question
