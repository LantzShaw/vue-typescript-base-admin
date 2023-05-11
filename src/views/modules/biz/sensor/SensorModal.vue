<template>
  <BasicModal
    width="75%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :okAuth="okAuth"
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
  import { computed, reactive, ref, unref } from 'vue';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import { sensorForm, sensorUpdate } from '/@/api/biz/sensor';
  // data
  import { isUpdate, idRef, record, organizationId, inputFormSchemas } from './sensor.data';

  const okAuth = ref(['manage:sensor:add']);

  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  // const formState = reactive({
  //   organizationId: undefined,
  //   regionId: undefined,
  // });

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: inputFormSchemas,
    showActionButtonGroup: false,
    baseColProps: { lg: 8, md: 24 },
  });

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });

    record.value = ((await sensorForm({
      id: data?.record?.id,
    })) || {}) as Recordable;

    organizationId.value = record.value?.organizationId;
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      idRef.value = data.record.id;

      // formState.organizationId = data.record.organizationId;
      // formState.regionId = data.record.regionId;

      // // NOTE: 由于后端反的是number类型，将其转成字符串
      // record.value.dtuipSensorTypeId = record.value.dtuipSensorTypeId?.toString();
      // // record.value.dtuipId = record.value.dtuipId?.toString();
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
        await sensorUpdate({ ...values, id: idRef.value });
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
