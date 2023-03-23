import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';
// 接口

import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const requestMethodOptions = ref<any[]>([]);
export const dictCategoryOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 6, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('接口名称'),
      field: 'authorityName',
      component: 'Input',
    },
    {
      label: t('关联URL'),
      field: 'url',
      component: 'Input',
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('接口名称'),
    dataIndex: 'authorityName',
    sorter: true,
    width: 130,
    align: 'left',
  },
  {
    title: t('关联URL'),
    dataIndex: 'url',
    sorter: true,
    width: 130,
    align: 'left',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    field: 'authorityName',
    label: t('接口名称'),
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('父级'),
    field: 'parentId',
    component: 'TreeSelect',
    required: true,
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas2: FormSchema[] = [
  {
    field: 'moduleName',
    label: t('模块名称'),
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('模块类型'),
    field: 'moduleType',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'module_type',
      },
    },
    dynamicDisabled: ({}) => unref(isUpdate),
  },
  {
    label: t('所属模块'),
    field: 'parentId',
    component: 'TreeSelect',
    required: true,
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    label: t('显示顺序'),
    field: 'sortValue',
    component: 'InputNumber',
    defaultValue: '30',
    componentProps: {
      maxlength: 10,
    },
    required: true,
  },
];

/**
 * 表格2字段
 */
export const tableColumns2: BasicColumn[] = [
  {
    title: t('字典名称'),
    dataIndex: 'title',
    width: 130,
    align: 'left',
  },
  {
    title: t('字典标识'),
    dataIndex: 'code',
    width: 130,
    align: 'left',
  },
  {
    title: t('更新时间'),
    dataIndex: 'updateTime',
    width: 100,
    align: 'center',
  },
  {
    title: t('备注'),
    dataIndex: 'remark',
    width: 130,
    align: 'left',
  },
];
