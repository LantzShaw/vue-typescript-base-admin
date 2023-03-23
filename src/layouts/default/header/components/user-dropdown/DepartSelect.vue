<template>
  <BasicModal v-bind="config" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <div style="padding-left: 10px; padding-right: 10px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref, computed, watch, unref, defineExpose } from 'vue';
  import { Avatar, FormItem, Form, Row, Tooltip, Select } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getUserOrganizations, selectDepart, getUserDepartments } from '/@/api/sys/user';
  import { FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  const AAvatar = Avatar;
  const AForm = Form;
  const AFormItem = Form.Item;
  const ATooltip = Tooltip;
  const ASelect = Select;
  const ASelectOption = Select.Option;

  const userStore = useUserStore();
  const { createMessage, notification } = useMessage();
  const props = defineProps({
    title: { type: String, default: '部门选择' },
    closable: { type: Boolean, default: false },
    username: { type: String, default: '' },
  });

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const config = {
    maskClosable: false,
    closable: false,
    canFullscreen: false,
    width: '500px',
    minHeight: 20,
    maxHeight: 20,
  };

  const { t } = useI18n();

  const emit = defineEmits(['success', 'register']);
  /**
   * 表单字段
   */
  const inputFormSchemas: FormSchema[] = [
    {
      field: 'organizationId',
      label: t('当前公司'),
      component: 'Select',
      required: true,
    },
    {
      field: 'departmentId',
      label: t('当前部门'),
      component: 'TreeSelect',
      required: true,
      componentProps: {
        getPopupContainer: () => document.body,
      },
    },
  ];

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 90,
    schemas: inputFormSchemas,
    showActionButtonGroup: false,
    baseColProps: { lg: 24, md: 24 },
  });

  const organizationId = ref('');
  const departmentId = ref('');
  const organizationOptions = ref<any[]>([]);
  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });

    organizationId.value = userStore.getOrganizationId || '';
    departmentId.value = userStore.getDepartmentId || '';

    organizationOptions.value = (await getUserOrganizations({})) || [];

    if (organizationId.value) {
      const treeData = await getUserDepartments({
        organizationId: organizationId.value,
      });

      updateSchema([
        {
          field: 'departmentId',
          componentProps: {
            treeData,
          },
        },
      ]);
    }

    updateSchema([
      {
        field: 'organizationId',
        componentProps: {
          options: organizationOptions,

          onChange: async (e: any) => {
            const treeData = await getUserDepartments({ organizationId: e });

            await updateSchema([
              {
                field: 'departmentId',
                componentProps: {
                  treeData,
                },
              },
            ]);
            // 如果applicationId没变
            if (organizationId.value == e) {
            } else {
              setFieldsValue({ departmentId: '' });
            }
          },
        },
      },
    ]);
    // 字段赋值
    setFieldsValue({
      organizationId: organizationId.value,
      departmentId: departmentId.value,
    });
    setModalProps({ loading: false, confirmLoading: false });
  });

  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ loading: true, confirmLoading: true });
      userStore.setOrganizationId(values.organizationId);
      userStore.setDepartmentId(values.departmentId);
      notification.success({ message: `执行成功` });
      closeModal();
      emit('success');
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
  const getTitle = computed(() => '切换部门');
</script>
<style lang="less" scoped>
  .loginSelectForm {
    margin-bottom: -20px;
  }

  .loginSelectModal {
    top: 20px;
  }

  .valid-error .ant-select-selection__placeholder {
    color: #f5222d;
  }
</style>
