import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';

// 接口
import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const roleOptions = ref<any[]>([]);
export const requestMethodOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('权限名称'),
      field: 'attributeName',
      component: 'Input',
    },
    {
      label: t('请求类型'),
      field: 'requestMethod',
      component: 'Select',
      componentProps: {
        options: requestMethodOptions,
        allowClear: true,
      },
    },
    {
      label: t('url'),
      field: 'url',
      component: 'Input',
    },
    {
      label: t('权限代码'),
      field: 'attributeCode',
      component: 'Input',
    },
    {
      label: t('表达式'),
      field: 'expression',
      component: 'Input',
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('服务接口'),
    dataIndex: 'url',
    sorter: true,
    width: 230,
    align: 'left',
  },
  {
    title: t('权限代码'),
    dataIndex: 'attributeCode',
    sorter: true,
    width: 90,
    align: 'center',
  },

  {
    title: t('表达式'),
    dataIndex: 'expression',
    width: 90,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('url'),
    field: 'url',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    label: t('请求类型'),
    field: 'requestMethod',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    label: t('权限代码'),
    field: 'attributeCode',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    label: t('指定表达式'),
    field: 'manualSetting',
    component: 'Input',
    helpMessage: ['优先使用指定表达式'],
    componentProps: {
      maxlength: 255,
    },
  },
  {
    field: 'expression',
    component: 'Select',
    label: '表达式',
    componentProps: {
      options: [
        {
          label: '允许所有',
          value: 'PERMIT_ALL',
        },
        {
          label: '允许匿名',
          value: 'ANONYMOUS',
        },
        {
          label: '记住我',
          value: 'REMEMBER_ME',
        },
        {
          label: '拒绝所有',
          value: 'DENY_ALL',
        },
        {
          label: '需要认证',
          value: 'AUTHENTICATED',
        },
        {
          label: '拥有指定角色的用户可访问',
          value: 'HAS_ROLE',
        },
        {
          label: '拥有指定任意角色的用户可访问',
          value: 'HAS_ANY_ROLE',
        },
        {
          label: '拥有指定权限的用户可访问',
          value: 'HAS_AUTHORITY',
        },
        {
          label: '拥有指定任意权限的用户可访问',
          value: 'HAS_ANY_AUTHORITY',
        },
        {
          label: '来自指定IP表达式的用户可访问',
          value: 'HAS_IP_ADDRESS',
        },
      ],
      allowClear: true,
      getPopupContainer: () => document.body,
    },
  },
  {
    label: t('IP地址'),
    field: 'ipAddress',
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
    required: true,
    ifShow: ({ values }) => isHasIpAddress(values.expression),
  },
  {
    label: t('角色集合'),
    field: 'roleIds',
    component: 'Select',
    componentProps: {
      getPopupContainer: () => document.body,
      mode: 'multiple',
    },
    required: true,
    ifShow: ({ values }) => isHasAnyRole(values.expression),
  },
  {
    label: t('角色'),
    field: 'roleId',
    component: 'Select',
    componentProps: {
      getPopupContainer: () => document.body,
    },
    required: true,
    ifShow: ({ values }) => isHasRole(values.expression),
  },
];

const isHasIpAddress = (type: string) => type === 'HAS_IP_ADDRESS';
const isHasRole = (type: string) => type === 'HAS_ROLE';
const isHasAnyRole = (type: string) => type === 'HAS_ANY_ROLE';
