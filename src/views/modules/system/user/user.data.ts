import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';
// 接口
import { checkUsername } from '/@/api/system/user';

import { roleSelect } from '/@/api/system/role';
import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const dataItemStatusOptions = ref<any[]>([]);
export const dataScopeTypeOptions = ref<any[]>([]);
export const roleOptions = ref<any[]>([]);

const { t } = useI18n();

// 自定义数据权限
const isCustom = (type: string) => type === '5';

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('用户名'),
      field: 'username',
      component: 'Input',
    },
    {
      label: t('用户昵称'),
      field: 'nickName',
      component: 'Input',
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
    title: t('用户名'),
    dataIndex: 'username',
    width: 130,
    align: 'center',
  },
  {
    title: t('用户昵称'),
    dataIndex: 'nickName',
    width: 130,
    align: 'center',
  },
  {
    title: t('状态'),
    dataIndex: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: t('更新时间'),
    dataIndex: 'updateTime',
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
    label: t('用户名'),
    field: 'username',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
    rules: [
      {
        required: true,
        validator: async (_rule, value) => {
          return new Promise((resolve, reject) => {
            if (!value || value === '') return resolve();
            checkUsername(idRef.value || '', value)
              .then((res) => (res ? resolve() : reject(t('登录账号已存在'))))
              .catch((err) => reject(err.message || t('验证失败')));
          });
        },
        trigger: 'blur',
      },
    ],
    dynamicDisabled: ({}) => unref(isUpdate),
  },

  {
    label: t('用户昵称'),
    field: 'nickName',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
    required: true,
  },
  {
    label: t('密码'),
    field: 'password',
    component: 'StrengthMeter',
    required: true,
    ifShow: ({}) => !unref(isUpdate),
  },
  {
    label: t('确认密码'),
    field: 'confirmPass',
    component: 'InputPassword',
    required: true,
    ifShow: ({}) => !unref(isUpdate),
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('确认密码不能为空');
            }
            if (value !== values.password) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },

  {
    label: t('密码过期日期'),
    field: 'credentialsExpireAt',
    component: 'DatePicker',
    componentProps: {
      style: { width: '100%' },
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: t('邮箱'),
    field: 'email',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('手机号码'),
    field: 'mobile',
    component: 'Input',
    componentProps: {
      maxlength: 100,
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
      isBtn: true,
    },
  },
];

/**
 * 表单字段
 */
export const changePasswordInputFormSchemas: FormSchema[] = [
  {
    label: t('密码'),
    field: 'password',
    component: 'StrengthMeter',
    required: true,
  },
  {
    label: t('确认密码'),
    field: 'confirmPass',
    component: 'InputPassword',
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('确认密码不能为空');
            }
            if (value !== values.password) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];
