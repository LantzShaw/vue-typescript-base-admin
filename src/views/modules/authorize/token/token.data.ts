import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { DescItem } from '/@/components/Description/index';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';

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
      label: t('客户端ID'),
      field: 'registeredClientId',
      component: 'Input',
    },
    {
      label: t('用户名'),
      field: 'principalName',
      component: 'Input',
    },

    {
      label: t('认证模式'),
      field: 'authorizationGrantType',
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
    title: t('客户端ID'),
    dataIndex: 'registeredClientId',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('用户名'),
    dataIndex: 'principalName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('认证模式'),
    dataIndex: 'authorizationGrantType',
    sorter: true,
    width: 90,
    align: 'center',
  },
  {
    title: t('访问Token颁发时间'),
    dataIndex: 'accessTokenIssuedAt',
    sorter: true,
    width: 130,
  },
  {
    title: t('访问Token过期时间'),
    dataIndex: 'accessTokenExpiresAt',
    sorter: true,
    width: 130,
  },
];

/**
 * 表单字段
 */

export const inputFormSchemas: DescItem[] = [
  {
    field: 'registeredClientId',
    label: '客户端ID',
  },
  {
    field: 'principalName',
    label: '用户名',
  },
  {
    field: 'authorizationGrantType',
    label: '认证模式',
  },
  {
    field: 'state',
    label: 'state',
  },

  {
    field: 'accessTokenValue',
    label: '访问Token',
  },
  {
    field: 'accessTokenIssuedAt',
    label: '访问Token颁发时间',
  },
  {
    field: 'accessTokenExpiresAt',
    label: '访问Token过期时间',
  },

  {
    field: 'accessTokenType',
    label: '访问Token类型',
  },
  {
    field: 'accessTokenScopes',
    label: '访问TokenScopes',
  },

  {
    field: 'authorizationCodeValue',
    label: '授权code',
  },
  {
    field: 'authorizationCodeIssuedAt',
    label: '授权code签发时间',
  },
  {
    field: 'authorizationCodeExpiresAt',
    label: '授权code过期时间',
  },
];
