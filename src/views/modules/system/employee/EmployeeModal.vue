<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :okAuth="okAuth"
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
  import { computed, ref, unref } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import { employeeForm, employeeAdd, employeeUpdate } from '/@/api/system/employee';
  // data
  import { isUpdate, idRef, record, inputFormSchemas } from './employee.data';
  const okAuth = ref(['system:dict-item:add']);
  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  const dictCode = ref('');

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 110,
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
    record.value = ((await employeeForm({ id: data?.record?.id })) || {}) as Recordable;
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    dictCode.value = data.dictCode;

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
        await employeeUpdate({
          ...values,
          id: idRef.value,
          dictCode: dictCode.value,
        });
      } else {
        await employeeAdd({ ...values, dictCode: dictCode.value });
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
