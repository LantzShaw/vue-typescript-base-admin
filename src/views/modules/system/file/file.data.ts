import { ref, h } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { Tag } from 'ant-design-vue';
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
export const fileStorageLocationOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 6, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('文件名称'),
      field: 'fileName',
      component: 'Input',
    },
    {
      label: t('存储位置'),
      field: 'fileLocation',
      component: 'Select',
      componentProps: {
        options: fileStorageLocationOptions,
        allowClear: true,
      },
    },
    {
      label: t('文件后缀'),
      field: 'fileType',
      component: 'Input',
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('文件名称'),
    dataIndex: 'fileName',
    width: 130,
    align: 'center',
    slots: { customRender: 'firstColumn' },
  },
  {
    title: t('原文件名称'),
    dataIndex: 'originalFileName',
    width: 130,
    align: 'center',
  },
  {
    title: t('存储位置'),
    dataIndex: 'fileLocation',
    width: 90,
    slots: { customRender: 'fileLocation' },
  },
  {
    title: t('文件扩展名'),
    dataIndex: 'ext',
    width: 90,
    align: 'center',
    customRender: ({ record }) => {
      return h(Tag, { color: 'blue' }, () => record.ext);
    },
  },
  {
    title: t('MIME类型'),
    dataIndex: 'contentType',
    width: 90,
    align: 'center',
    customRender: ({ record }) => {
      return h(Tag, { color: 'blue' }, () => record.contentType);
    },
  },
  {
    title: t('文件大小'),
    dataIndex: 'fileSizeInfo',
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
    label: t('配置名称'),
    field: 'confName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('配置Key'),
    field: 'confKey',
    component: 'Input',
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
              .then((res) => (res ? resolve() : reject(t('应用编码已存在'))))
              .catch((err) => reject(err.message || t('验证失败')));
          });
        },
      },
    ],
  },
  {
    label: t('配置值'),
    field: 'confValue',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('系统参数'),
    field: 'sysLevel',
    component: 'ApiRadioGroup',
    helpMessage: ['系统参数无法删除'],
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
      isBtn: true,
    },
  },
  {
    label: t('分类'),
    field: 'category',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'config_category',
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
