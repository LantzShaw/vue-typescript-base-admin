import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 120,
  schemas: [
    {
      label: t('组名称'),
      field: 'groupName',
      component: 'Input',
    },
    {
      field: 'bindFlag',
      component: 'RadioButtonGroup',
      label: '关联企业状态',
      componentProps: {
        options: [
          {
            label: '全部',
            value: '',
          },
          {
            label: '已关联',
            value: '1',
          },
          {
            label: '未关联',
            value: '0',
          },
        ],
      },
      defaultValue: '',
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('组名称'),
    dataIndex: 'groupName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('所属企业'),
    dataIndex: 'sysOrganization',
    width: 130,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('组名称'),
    field: 'groupName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('所属企业'),
    field: 'organizationId',
    component: 'Select',
  },
];
