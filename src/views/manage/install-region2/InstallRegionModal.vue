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
    <div style="padding-right: 10px; padding-left: 10px">
      <BasicForm autoFocusFirstItem @register="registerForm" />
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
  // import { AMapSearch } from '/@/components/AMap';
  // 接口
  import {
    installRegionForm,
    installRegionAdd,
    installRegionUpdate,
  } from '/@/api/manage/installRegion';
  import { enterpriseSelect } from '/@/api/manage/enterprise';

  // data
  import { isUpdate, idRef, record, inputFormSchemas } from './installRegion.data';

  const okAuth = ref(['system:device:add']);
  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  // const currentPosition = ref<string[]>([]);

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
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
    record.value = ((await installRegionForm({ id: data?.record?.id })) || {}) as Recordable;
    const enterpriseOptions = (await enterpriseSelect({})) || [];
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;

    updateSchema([
      {
        field: 'organizationId',
        componentProps: {
          options: enterpriseOptions,
        },
      },
    ]);

    if (unref(isUpdate)) {
      // 请求数据
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
      record.value.organizationId = data?.organizationId;
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
        await installRegionUpdate({ ...values, id: idRef.value });
      } else {
        await installRegionAdd({ ...values });
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
