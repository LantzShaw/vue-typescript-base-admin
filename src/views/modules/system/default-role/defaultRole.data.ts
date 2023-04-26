import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';

// 接口

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const roleOptions = ref<any[]>([]);
export const accountTypeOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('名称'),
    dataIndex: 'sceneDisplayName',
    width: 100,
    align: 'center',
  },
  {
    title: t('代码'),
    dataIndex: 'scene',
    width: 100,
    align: 'center',
  },
  {
    title: t('角色代码'),
    dataIndex: 'role',
    width: 130,
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
    label: t('场景'),
    field: 'scene',
    component: 'Select',
    componentProps: {
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    label: t('角色'),
    field: 'roleId',
    component: 'Select',
    componentProps: {
      getPopupContainer: () => document.body,
    },
    required: true,
  },
];
