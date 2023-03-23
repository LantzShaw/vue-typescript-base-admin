<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :okAuth="'system:role:edit'"
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <div style="padding-left: 10px; padding-right: 10px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import { roleSelect } from '/@/api/system/role';
  import {
    defaultRoleAdd,
    defaultRoleUpdate,
    defaultRoleForm,
    defaultRoleAccountTypeSelect,
  } from '/@/api/system/defaultRole';
  // data
  import {
    isUpdate,
    idRef,
    record,
    inputFormSchemas,
    roleOptions,
    accountTypeOptions,
  } from './defaultRole.data';

  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 90,
    schemas: inputFormSchemas,
    showActionButtonGroup: false,
    baseColProps: { lg: 24, md: 24 },
  });

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    // 请求数据
    record.value = ((await defaultRoleForm({ id: data?.record?.id })) || {}) as Recordable;
    roleOptions.value = (await roleSelect({})) || [];
    accountTypeOptions.value = (await defaultRoleAccountTypeSelect({})) || [];
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }

    await updateSchema([
      {
        field: 'scene',
        componentProps: {
          options: accountTypeOptions,
        },
      },
    ]);

    await updateSchema([
      {
        field: 'roleId',
        componentProps: {
          options: roleOptions,
        },
      },
    ]);
    // 字段赋值
    setFieldsValue({
      ...record.value,
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
      if (unref(isUpdate)) {
        await defaultRoleUpdate({ ...values, id: idRef.value });
      } else {
        await defaultRoleAdd({ ...values });
      }
      notification.success({ message: `执行成功` });
      closeModal();
      emit('success');
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  /**
   * 标题
   */
  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
</script>
