<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :canFullscreen="false"
    title="修改密码"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, unref, computed } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 公共组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  // 接口
  import { updatePassword } from '/@/api/sys/account';
  // data
  import { inputFormSchemas } from './data';

  const emit = defineEmits(['register']);

  const { notification } = useMessage();

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, validate }] = useForm({
    labelWidth: 90,
    schemas: inputFormSchemas,
    showActionButtonGroup: false,
    baseColProps: { lg: 24, md: 24 },
  });

  /**
   * 构建registerModal
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(() => {
    resetFields();
    setModalProps({ confirmLoading: false });
  });

  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ loading: true, confirmLoading: true });

      await updatePassword({
        ...values,
      });

      notification.success({ message: `执行成功` });
      closeModal();
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
</script>
