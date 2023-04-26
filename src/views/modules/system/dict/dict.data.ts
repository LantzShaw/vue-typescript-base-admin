import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
// 接口
import { checkCode } from '/@/api/system/dict';
import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const dictCategoryOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('字典名称'),
      field: 'title',
      component: 'Input',
    },
    {
      label: t('字典标识'),
      field: 'code',
      component: 'Input',
    },
    {
      label: t('字典分类'),
      field: 'category',
      component: 'Select',
      componentProps: {
        options: dictCategoryOptions,
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
    title: t('字典名称'),
    dataIndex: 'title',
    sorter: true,
    width: 130,
  },
  {
    title: t('字典标识'),
    dataIndex: 'code',
    sorter: true,
    width: 130,
  },
  {
    title: t('分类'),
    dataIndex: 'category',
    sorter: true,
    width: 100,
  },
  {
    title: t('更新时间'),
    dataIndex: 'updateTime',
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
    field: 'title',
    label: t('字典名称'),
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    field: 'code',
    label: t('字典标识'),
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },
    rules: [
      {
        required: true,
        validator: async (_rule, value) => {
          return new Promise((resolve, reject) => {
            if (!value || value === '') return resolve();
            checkCode(idRef.value || '', value)
              .then((res) => (res ? resolve() : reject(t('字典标识已存在'))))
              .catch((err) => reject(err.message || t('验证失败')));
          });
        },
        trigger: 'blur',
      },
    ],
  },
  {
    label: t('字典分类'),
    field: 'category',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'dict_category',
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
