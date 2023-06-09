<template>
  <BasicModal
    width="50%"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :centered="true"
    :okAuth="okAuth"
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
  // 接口
  import {
    authorityForm,
    authorityAdd,
    authorityUpdate,
    authorityTreeForEdit,
  } from '/@/api/system/authority';

  // data
  import { isUpdate, idRef, record, inputFormSchemas } from './authority.data';

  const okAuth = ref(['system:authority:add', 'system:authority:edit']);
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
    // 请求数据
    record.value = ((await authorityForm({ id: data?.record?.id })) || {}) as Recordable;
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;

    const treeData = await authorityTreeForEdit({});

    updateSchema([
      {
        field: 'parentId',
        componentProps: {
          treeData,
        },
      },
    ]);

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
        await authorityUpdate({
          ...values,
          id: idRef.value,
        });
      } else {
        await authorityAdd({ ...values });
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
