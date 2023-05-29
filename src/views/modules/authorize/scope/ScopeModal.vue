<template>
  <BasicModal
    width="50%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :okAuth="okAuth"
    :title="getTitle"
    :centered="true"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import { scopeForm, scopeAdd, scopeUpdate } from '/@/api/authorize/scope';
  // data
  import { isUpdate, idRef, record, inputFormSchemas } from './scope.data';

  const okAuth = ref(['authorize:scope:add', 'authorize:scope:edit']);
  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
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
    record.value = ((await scopeForm({ id: data?.record?.id })) || {}) as Recordable;
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }
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
        await scopeUpdate({ ...values, id: idRef.value });
      } else {
        await scopeAdd({ ...values });
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
