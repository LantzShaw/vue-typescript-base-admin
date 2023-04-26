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

export const tfOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 120,
  schemas: [
    {
      label: t('唯一标识'),
      field: 'kvName',
      component: 'Input',
    },
    {
      label: t('数据值'),
      field: 'kvValue',
      component: 'Input',
    },
    {
      label: t('自动覆盖'),
      field: 'overwriteFlag',
      component: 'Select',
      componentProps: {
        options: tfOptions,
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
    title: t('唯一标识'),
    dataIndex: 'kvName',
    sorter: true,
    width: 130,
  },
  {
    title: t('数据值'),
    dataIndex: 'kvValue',
    sorter: true,
    width: 130,
  },
  {
    title: t('自动覆盖'),
    dataIndex: 'overwriteFlag',
    sorter: true,
    width: 100,
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    field: 'kvName',
    label: t('唯一标识'),
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
  },
  {
    label: t('数据值'),
    field: 'kvValue',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      placeholder: '请输入值',
      maxlength: 255,
      rows: 4,
      allowClear: true,
      showCount: true,
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    label: t('自动覆盖'),
    field: 'overwriteFlag',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
];
