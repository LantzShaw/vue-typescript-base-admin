<template>
  <BasicModal
    width="50%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :okAuth="'system:device:add'"
    :title="getTitle"
    :centered="true"
    @ok="handleSubmit"
  >
    <div style="padding-left: 10px; padding-right: 10px">
      <BasicForm autoFocusFirstItem @register="registerForm" />

      <AMapSearch v-model:position="currentPosition" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, watch, computed, unref, onUnmounted } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { AMapSearch } from '/@/components/AMap';
  // 接口
  import { deviceForm, deviceAdd, deviceUpdate } from '/@/api/manage/device';
  // data
  import { isUpdate, idRef, record, inputFormSchemas } from './device.data';

  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  const currentPosition = ref<string[]>(['1', '2']);

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 80,
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

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    record.value = [];

    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await deviceForm({ id: data?.record?.id })) || {}) as Recordable;
      idRef.value = data.record.id;

      const { dtuipLng, dtuipLat } = record.value;

      currentPosition.value = [dtuipLng, dtuipLat];

      console.log(currentPosition.value);
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
        await deviceUpdate({ ...values, id: idRef.value });
      } else {
        await deviceAdd({ ...values });
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

  watch(
    currentPosition,
    (newValue) => {
      setFieldsValue({
        dtuipLng: newValue[0],
        dtuipLat: newValue[1],
      });
    },
    // {
    //   deep: true,
    //   immediate: true,
    // },
  );

  onUnmounted(() => {
    console.log('modal onUnmounted');
  });
</script>
