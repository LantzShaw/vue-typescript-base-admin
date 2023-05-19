<template>
  <BasicModal
    width="50%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :title="getTitle"
    :centered="true"
    @ok="handleSubmit"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <BasicForm autoFocusFirstItem @register="registerForm" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, unref, ref } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import {
    workflowNotificationAdd,
    workflowNotificationUpdate,
    workflowNotificationForm,
  } from '/@/api/biz/workflowNotification';
  import { enterpriseSelect } from '/@/api/biz/enterprise';
  // data
  import { isUpdate, idRef, record, inputFormSchemas } from './workflowNotification.data';

  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
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
    record.value = ((await workflowNotificationForm({ id: data?.record?.id })) || {}) as Recordable;
    const enterpriseOptions = (await enterpriseSelect({})) || [];

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;

    updateSchema([
      {
        field: 'organizationId',
        componentProps: {
          options: enterpriseOptions,
          readonly: true,
        },
      },
    ]);

    if (unref(isUpdate)) {
      // 请求数据
      idRef.value = data.record.id;
      var arr = [record.value.planStartDate, record.value.planEndDate];
      record.value.planDate = arr;
    } else {
      idRef.value = '';
    }
    setFieldsValue({
      ...record.value,
      // planDate: [record.value.planStartDate, record.value.planEndDate],
    });

    setModalProps({ loading: false, confirmLoading: false });
  });

  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      const values = await validate();
      var planCycleArgument = 1;
      if (values.planCycle == '4') {
        planCycleArgument = values.planCycleArgument;
      }

      setModalProps({ loading: true, confirmLoading: true });
      if (unref(isUpdate)) {
        await workflowNotificationUpdate({
          ...values,
          id: idRef.value,
          planStartDate: values.planDate[0],
          planEndDate: values.planDate[1],
          planCycleArgument: planCycleArgument,
        });
      } else {
        await workflowNotificationAdd({
          ...values,
          planStartDate: values.planDate[0],
          planEndDate: values.planDate[1],
          planCycleArgument: planCycleArgument,
        });
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
