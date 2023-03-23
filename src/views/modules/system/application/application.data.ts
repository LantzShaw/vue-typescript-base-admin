import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';

import { checkApplicationCode } from '/@/api/system/application';

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
  baseColProps: { lg: 6, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('应用名称'),
      field: 'applicationName',
      component: 'Input',
    },
    {
      label: t('应用编码'),
      field: 'applicationCode',
      component: 'Input',
    },
    {
      label: t('后端应用'),
      field: 'showFlag',
      component: 'Select',
      componentProps: {
        options: tfOptions,
        allowClear: true,
      },
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
    title: t('应用名称'),
    dataIndex: 'applicationName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('应用编码'),
    dataIndex: 'applicationCode',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('后端应用'),
    dataIndex: 'showFlag',
    sorter: true,
    width: 90,
    align: 'center',
  },
  {
    title: t('状态'),
    dataIndex: 'status',
    sorter: true,
    width: 90,
    align: 'center',
  },
  {
    title: t('排序'),
    dataIndex: 'ranking',
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
    label: t('应用名称'),
    field: 'applicationName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 255,
    },
  },
  {
    label: t('应用编码'),
    field: 'applicationCode',
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
    rules: [
      { required: true },
      {
        validator(_rule, value) {
          return new Promise((resolve, reject) => {
            if (!value || value === '') return resolve();
            checkApplicationCode(idRef.value || '', value)
              .then((res) => (res ? resolve() : reject(t('应用编码已存在'))))
              .catch((err) => reject(err.message || t('验证失败')));
          });
        },
      },
    ],
  },
  {
    label: t('后端应用'),
    field: 'showFlag',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
  {
    label: t('状态'),
    field: 'status',
    component: 'ApiRadioGroup',
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
    label: t('排序'),
    field: 'ranking',
    required: true,
    component: 'InputNumber',
    helpMessage: '升序',
    componentProps: {
      maxlength: 10,
    },
  },
];
