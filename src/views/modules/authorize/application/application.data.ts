import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 接口
import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const dataItemStatusOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);
export const grantTypesOptions = ref<any[]>([]);
export const scopeOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 12, md: 12 },
  labelWidth: 90,
  schemas: [
    {
      label: t('应用名称'),
      field: 'applicationName',
      component: 'Input',
    },
    {
      label: t('应用简称'),
      field: 'abbreviation',
      component: 'Input',
    },
    {
      label: t('认证模式'),
      field: 'authorizationGrantTypeSet',
      component: 'CheckboxGroup',
      componentProps: {
        options: grantTypesOptions,
      },
      colProps: { lg: 12, md: 12 },
    },
  ],
  // actionColOptions: { span: 24 },
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
    title: t('应用名称'),
    dataIndex: 'applicationName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('应用简称'),
    dataIndex: 'abbreviation',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('认证模式'),
    dataIndex: 'authorizationGrantTypes',
    width: 150,
    align: 'center',
    ellipsis: true,
  },
  {
    title: t('密钥过期时间'),
    dataIndex: 'clientSecretExpiresAt',
    width: 90,
    align: 'center',
    sorter: true,
  },
  {
    title: t('令牌时效(分钟)'),
    dataIndex: 'accessTokenValidity',
    width: 90,
    align: 'center',
    sorter: true,
  },
  {
    title: t('刷新时效(分钟)'),
    dataIndex: 'refreshTokenValidity',
    width: 90,
    align: 'center',
    sorter: true,
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('应用名称'),
    field: 'applicationName',
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
    label: t('令牌时效(分钟)'),
    field: 'accessTokenValidity',
    component: 'InputNumber',
    componentProps: {
      maxlength: 10,
      placeholder: '单位分钟',
    },
    required: true,
  },
  {
    label: t('刷新时效(分钟)'),
    field: 'refreshTokenValidity',
    component: 'InputNumber',
    componentProps: {
      maxlength: 10,
      placeholder: '单位分钟',
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
    field: 'authorizationGrantTypeSet',
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
      if (Array.isArray(values.authorizationGrantTypeSet)) {
        if (values.authorizationGrantTypeSet.includes('authorization_code')) {
          return [{ required: true, message: '回调地址必填' }];
        }
      }

      return [];
    },
  },
  {
    label: t('客户端验证模式'),
    field: 'clientAuthenticationMethodSet',
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
      isShowAuthenticationSigningAlgorithm(values.clientAuthenticationMethodSet),
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
    field: 'scopeIds',
    component: 'CheckboxGroup',
    componentProps: {
      options: [],
    },
  },
];
