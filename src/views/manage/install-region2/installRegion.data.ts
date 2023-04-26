import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 接口
import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const treeData = ref<any[]>([]);
export const organizationOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 120,
  schemas: [
    {
      label: t('区域名称'),
      field: 'regionName',
      component: 'Input',
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('区域名称'),
    dataIndex: 'regionName',
    sorter: true,
    width: 130,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('所属企业'),
    field: 'organizationId',
    component: 'Select',
    required: true,
  },
  {
    label: t('区域名称'),
    field: 'regionName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
];
