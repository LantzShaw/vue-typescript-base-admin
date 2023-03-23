import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const dataItemStatusOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('范围代码'),
      field: 'scopeCode',
      component: 'Input',
    },
    {
      label: t('范围名称'),
      field: 'scopeName',
      component: 'Input',
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('范围代码'),
    dataIndex: 'scopeCode',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('范围名称'),
    dataIndex: 'scopeName',
    sorter: true,
    width: 130,
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
    label: '范围代码',
    field: 'scopeCode',
    required: true,
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请使用小写英文单词编写的范围代码，例如：all、read_user等',
      maxlength: 255,
      rows: 4,
      allowClear: true,
      showCount: true,
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    label: t('范围名称'),
    field: 'scopeName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
];
