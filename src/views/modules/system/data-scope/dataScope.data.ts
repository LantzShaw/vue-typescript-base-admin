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

export const dataScopeTypeOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('名称'),
      field: 'dataName',
      component: 'Input',
    },
    {
      label: t('主表'),
      field: 'dataTableName',
      component: 'Input',
    },
    {
      label: t('类型'),
      field: 'dataScopeType',
      component: 'Select',
      componentProps: {
        options: dataScopeTypeOptions,
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
    title: t('名称'),
    dataIndex: 'dataName',
    sorter: true,
    width: 100,
  },
  {
    title: t('主表'),
    dataIndex: 'dataTableName',
    sorter: true,
    width: 90,
  },
  {
    title: t('mapper方法全路径'),
    dataIndex: 'dataMapperFunction',
    sorter: true,
    align: 'left',
    width: 180,
  },
  {
    title: t('类型'),
    dataIndex: 'dataScopeType',
    sorter: true,
    width: 90,
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    field: 'dataName',
    label: t('名称'),
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('类型'),
    field: 'dataScopeType',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'data_scope_type',
      },
    },
  },
  {
    field: 'dataMapperFunction',
    label: t('mapper方法全路径'),
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
  },
  {
    field: 'dataTableName',
    label: t('主表'),
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
  },
  {
    field: 'dataTableAlias',
    label: t('主表别名'),
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
  },
  {
    field: 'dataColumnExclude',
    label: t('排除字段'),
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
  },
  {
    field: 'dataColumnInclude',
    label: t('保留字段'),
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
  },
  {
    field: 'innerTableName',
    label: t('数据权限表'),
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
  },
  {
    field: 'innerTableAlias',
    label: t('数据权限表别名'),
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
  },

  {
    field: 'customExpression',
    label: t('自定义数据权限'),
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
    ifShow: ({ values }) => values.dataScopeType === '5',
  },
];
