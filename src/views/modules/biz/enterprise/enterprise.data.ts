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

export const dataItemStatusOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);
export const grantTypesOptions = ref<any[]>([]);
export const scopeOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('企业名称'),
      field: 'enterpriseName',
      component: 'Input',
    },
    {
      label: t('企业编号'),
      field: 'enterpriseNo',
      component: 'Input',
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('企业名称'),
    dataIndex: 'enterpriseName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('企业编号'),
    dataIndex: 'enterpriseNo',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('安全负责人'),
    dataIndex: 'smPersonName',
    sorter: true,
    width: 90,
    align: 'center',
  },
  {
    title: t('法人'),
    dataIndex: 'legalPersonName',
    sorter: true,
    width: 90,
    align: 'center',
  },
  {
    title: t('专工'),
    dataIndex: 'swPersonName',
    sorter: true,
    width: 90,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('企业名称'),
    field: 'enterpriseName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('企业编号'),
    field: 'enterpriseNo',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('安全负责人'),
    field: 'smPersonName',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },

  {
    label: t('安全负责人联系方式'),
    field: 'smPersonContact',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },

  {
    label: t('法人'),
    field: 'legalPersonName',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },

  {
    label: t('法人联系方式'),
    field: 'legalPersonContact',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },

  {
    label: t('专工'),
    field: 'swPersonName',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },

  {
    label: t('专工联系方式'),
    field: 'swPersonContact',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
];
