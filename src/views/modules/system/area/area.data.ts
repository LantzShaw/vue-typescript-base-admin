import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';
import { TreeItem } from '/@/components/Tree/index';

// 接口
import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const areaLevelOptions = ref<any[]>([]);

export const treeData = ref<TreeItem[]>([]);

const { t } = useI18n();

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('[行政区划代码]名称'),
    dataIndex: 'id',
    width: 180,
    align: 'left',
  },
  {
    title: t('层级'),
    dataIndex: 'levelCode',
    width: 90,
    align: 'center',
  },
  {
    title: t('组合名'),
    dataIndex: 'mergerName',
    width: 130,
    align: 'left',
  },
  {
    title: t('排序'),
    dataIndex: 'sortValue',
    width: 80,
  },
  {
    title: t('经度'),
    dataIndex: 'longitude',
    width: 80,
  },
  {
    title: t('维度'),
    dataIndex: 'latitude',
    width: 80,
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('行政区划代码'),
    field: 'id',
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },
    required: true,
  },
  {
    label: t('上级代码'),
    field: 'parentId',
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },
    required: true,
  },
  {
    label: t('名称'),
    field: 'name',
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },
    required: true,
  },
  {
    label: t('层级'),
    field: 'levelCode',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'area_level',
      },
    },
    required: true,
  },
  {
    label: t('简称'),
    field: 'shortName',
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },
    required: true,
  },
  {
    label: t('组合名'),
    field: 'mergerName',
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
    required: true,
  },
  {
    label: t('拼音'),
    field: 'pinyin',
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
    required: true,
  },
  {
    label: t('排序'),
    field: 'sortValue',
    helpMessage: '升序',
    component: 'InputNumber',
    componentProps: {
      maxlength: 10,
    },
    required: true,
  },
  {
    label: t('区号'),
    field: 'cityCode',
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
  },
  {
    label: t('邮政编码'),
    field: 'zipCode',
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
  },
  {
    label: t('经度'),
    field: 'longitude',
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
    required: true,
  },
  {
    label: t('维度'),
    field: 'latitude',
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
    required: true,
  },
];
