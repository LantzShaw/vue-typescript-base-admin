import { ref, unref, h } from 'vue';

// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';
import { Input } from 'ant-design-vue';
// 接口
import { orgTree } from '/@/api/system/org';
import { optionsListApi } from '/@/api/sys/dict';
import { checkRoleCode } from '/@/api/system/role';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const requestMethodOptions = ref<any[]>([]);
export const dataScopeTypeOptions = ref<any[]>([]);
export const genderOptions = ref<any[]>([]);
export const dataItemStatusOptions = ref<any[]>([]);
export const identityOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);

const { t } = useI18n();

// 自定义数据权限
const isCustom = (type: string) => type === '5';

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 6, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('姓名'),
      field: 'employeeName',
      component: 'Input',
    },
    {
      label: t('手机号码'),
      field: 'mobilePhoneNumber',
      component: 'Input',
    },
    {
      label: t('电子邮件'),
      field: 'email',
      component: 'Input',
    },
    {
      label: t('身份'),
      field: 'identity',
      component: 'Select',
      componentProps: {
        options: identityOptions,
        allowClear: true,
      },
    },
    {
      label: t('性别'),
      field: 'gender',
      component: 'Select',
      componentProps: {
        options: genderOptions,
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
    title: t('人员姓名'),
    dataIndex: 'employeeName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('性别'),
    dataIndex: 'gender',
    sorter: true,
    width: 90,
    align: 'center',
  },
  {
    title: t('身份'),
    dataIndex: 'identity',
    sorter: true,
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
    label: t('人员姓名'),
    field: 'employeeName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('人员编号'),
    field: 'employeeNo',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('性别'),
    field: 'gender',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'gender',
      },
    },
  },
  {
    label: t('身份'),
    field: 'identity',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'identity',
      },
    },
  },
  {
    label: t('电子邮件'),
    field: 'email',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('手机号码'),
    field: 'mobilePhoneNumber',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('办公电话'),
    field: 'officePhoneNumber',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
];
