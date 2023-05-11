import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 接口

import { enterpriseSelect } from '/@/api/manage/enterprise';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const treeData = ref<any[]>([]);
export const organizationOptions = ref<any[]>([]);
export const enterpriseOptions = ref<any[]>([]);

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
    {
      label: t('关联企业'),
      field: 'organizationId',
      component: 'ApiSelect',
      componentProps: {
        showSearch: true,
        optionFilterProp: 'label',
        api: enterpriseSelect,
        getPopupContainer: () => document.body,
      },
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
    label: t('区域名称'),
    field: 'regionName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
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
    dynamicDisabled: ({}) => unref(isUpdate),
  },
];
