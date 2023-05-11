import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { enterpriseSelect } from '/@/api/manage/enterprise';

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
    title: t('关联企业'),
    dataIndex: 'bizEnterprise',
    width: 130,
    align: 'left',
  },
  {
    title: t('创建时间'),
    dataIndex: 'createTime',
    width: 100,
    sorter: true,
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
    componentProps: {
      readonly: true,
    },
  },
  {
    label: t('关联企业'),
    field: 'organizationId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      api: enterpriseSelect,
      getPopupContainer: () => document.body,
    },
  },
];
