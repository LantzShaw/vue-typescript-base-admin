import { ref, unref } from 'vue';
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

export const tfOptions = ref<any[]>([]);
export const identityOptions = ref<any[]>([]);
export const genderOptions = ref<any[]>([]);

// export const treeData = ref<TreeItem[]>([]);
export const treeData = ref<any[]>([]);
export const organizationOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('姓名'),
      field: 'employeeName',
      component: 'Input',
    },
    {
      label: t('性别'),
      field: 'gender',
      component: 'Select',
      componentProps: {
        options: genderOptions,
        allowClear: true,
      },
    },
    {
      label: t('身份'),
      field: 'identity',
      component: 'Select',
      componentProps: {
        options: identityOptions,
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
    title: t('姓名'),
    dataIndex: 'employeeName',
  },
  {
    title: t('性别'),
    dataIndex: 'gender',
  },
  {
    title: t('身份'),
    dataIndex: 'identity',
  },
  {
    title: t('已关联组织机构数'),
    dataIndex: 'associateOrganizationNum',
  },
];
