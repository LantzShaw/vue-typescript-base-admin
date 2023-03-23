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
export const configCategoryOptions = ref<any[]>([]);
export const parameterTypeOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 6, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('参数名称'),
      field: 'parameterName',
      component: 'Input',
    },
    {
      label: t('参数键名'),
      field: 'parameterKey',
      component: 'Input',
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('参数名称'),
    dataIndex: 'parameterName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('参数键名'),
    dataIndex: 'parameterKey',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('参数值'),
    dataIndex: 'parameterValue',
    sorter: true,
    width: 90,
    align: 'center',
  },
  {
    title: t('参数类型'),
    dataIndex: 'parameterType',
    width: 90,
    align: 'center',
  },
  {
    title: t('内置参数'),
    dataIndex: 'internalFlag',
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
    label: t('参数名称'),
    field: 'parameterName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('参数键名'),
    field: 'parameterKey',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
    rules: [
      { required: true },
      {
        validator(_rule, value) {
          return new Promise((resolve, reject) => {
            if (!value || value === '') return resolve();
            checkConfKey(idRef.value || '', value)
              .then((res) => (res ? resolve() : reject(t('参数键名已存在'))))
              .catch((err) => reject(err.message || t('验证失败')));
          });
        },
      },
    ],
  },
  {
    label: t('参数值'),
    field: 'parameterValue',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      maxlength: 255,
      rows: 4,
      allowClear: true,
      showCount: true,
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    label: t('参数类型'),
    field: 'parameterType',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'parameter_type',
      },
    },
  },
  {
    label: t('备注'),
    field: 'remark',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入备注',
      maxlength: 255,
      rows: 4,
      allowClear: true,
      showCount: true,
    },
    colProps: { lg: 24, md: 24 },
  },
];
