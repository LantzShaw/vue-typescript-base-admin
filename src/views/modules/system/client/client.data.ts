import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';
import { checkConfKey } from '/@/api/system/config';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const tfOptions = ref<any[]>([]);
export const grantTypesOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 6, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('客户端'),
      field: 'clientId',
      component: 'Input',
    },
    {
      label: t('密钥'),
      field: 'clientSecret',
      component: 'Input',
    },
    {
      label: t('域'),
      field: 'scope',
      component: 'Input',
    },
    {
      label: t('授权方式'),
      field: 'authorizedGrantTypes',
      component: 'Select',
      componentProps: {
        options: grantTypesOptions,
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
    title: t('客户端'),
    dataIndex: 'clientId',
    sorter: true,
    width: 130,
    align: 'center',
    slots: { customRender: 'firstColumn' },
  },
  {
    title: t('密钥'),
    dataIndex: 'clientSecret',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('域'),
    dataIndex: 'scope',
    width: 90,
    align: 'center',
  },
  {
    title: t('授权方式'),
    dataIndex: 'authorizedGrantTypes',
    sorter: true,
    width: 180,
    align: 'center',
    slots: { customRender: 'authorizedGrantTypes' },
  },
  {
    title: t('令牌时效'),
    dataIndex: 'accessTokenValidity',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('刷新时效'),
    dataIndex: 'refreshTokenValidity',
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
    label: t('客户端'),
    field: 'clientId',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('密钥'),
    field: 'clientSecret',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('域'),
    field: 'scope',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    field: 'autoapprove',
    component: 'RadioGroup',
    label: '自动放行',
    required: true,
    componentProps: {
      options: [
        {
          label: '是',
          value: 'true',
        },
        {
          label: '否',
          value: 'false',
        },
      ],
    },
  },
  {
    label: t('授权方式'),
    field: 'authorizedGrantTypes',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'grant_types',
      },
      mode: 'multiple',
    },
  },
  {
    label: t('令牌时效'),
    field: 'accessTokenValidity',
    component: 'InputNumber',
    required: true,
    componentProps: {
      maxlength: 10,
    },
  },
  {
    label: t('刷新时效'),
    field: 'refreshTokenValidity',
    component: 'InputNumber',
    required: true,
    componentProps: {
      maxlength: 10,
    },
  },
  {
    label: t('回调地址'),
    field: 'webServerRedirectUri',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 255,
    },
  },
  {
    label: t('权限'),
    field: 'authorities',
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
  },
  {
    label: t('扩展信息'),
    field: 'additionalInformation',
    component: 'InputTextArea',
    componentProps: {
      placeholder: 'JSON格式数据',
      maxlength: 255,
      rows: 4,
      allowClear: true,
      showCount: true,
    },
    colProps: { lg: 24, md: 24 },
  },
];
