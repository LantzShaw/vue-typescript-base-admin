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

export const dataItemStatusOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('选项标签'),
      field: 'name',
      component: 'Input',
    },
    {
      label: t('选项键值'),
      field: 'value',
      component: 'Input',
    },
    {
      label: t('状态'),
      field: 'status',

      component: 'Select',
      componentProps: {
        options: dataItemStatusOptions,
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
    title: t('选项标签'),
    dataIndex: 'name',
    sorter: true,
    width: 130,
  },
  {
    title: t('选项键值'),
    dataIndex: 'value',
    sorter: true,
    width: 110,
  },
  {
    title: t('状态'),
    dataIndex: 'status',
    width: 80,
    align: 'center',
  },
  {
    title: t('排序'),
    dataIndex: 'sortValue',
    width: 60,
    align: 'center',
  },
  {
    title: t('更新时间'),
    dataIndex: 'updateTime',
    width: 120,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    field: 'name',
    label: '选项标签',
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    field: 'aliasName',
    label: '标签别名',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    field: 'value',
    label: '选项键值',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
    required: true,
  },
  {
    field: 'sortValue',
    label: '排序',
    required: true,
    component: 'InputNumber',
    helpMessage: '升序',
    componentProps: {
      maxlength: 10,
    },
  },
  {
    field: 'status',
    component: 'ApiRadioGroup',
    label: '状态',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'data_item_status',
        excludeItems: ['2', '3'],
      },
    },
  },
  {
    field: 'cssClass',
    label: 'CSS类名',
    helpMessage: [
      '支持以下风格内置字典样式：',
      'tag pink、tag red、tag orange、tag green、tag cyan、tag blue、tag purple',
      'tag error、tag success、tag warning、tag processing、tag default',
      'badge error、badge success、badge warning、badge processing',
    ],
    component: 'Input',
    componentProps: {
      maxlength: 500,
    },
  },
  {
    field: 'cssStyle',
    label: 'CSS样式',
    component: 'Input',
    componentProps: {
      maxlength: 500,
    },
  },

  {
    label: '备注',
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
