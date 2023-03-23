<template>
  <BasicModal
    width="50%"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :centered="true"
    @ok="handleSubmit"
  >
    <div style="padding-left: 10px; padding-right: 10px">
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
  import { dictItemForm, dictItemAdd, dictItemUpdate } from '/@/api/system/dictItem';
  import {
    authorityModuleForm,
    authorityModuleAdd,
    authorityModuleUpdate,
    authorityModuleTreeForEdit,
  } from '/@/api/system/authorityModule';

  // data
  import { isUpdate, idRef, record, inputFormSchemas2 } from './authority.data';

  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  const dictCode = ref('');

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 110,
    schemas: inputFormSchemas2,
    showActionButtonGroup: false,
    baseColProps: { lg: 24, md: 24 },
  });

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('data', data);
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    // 请求数据
    record.value = ((await authorityModuleForm({ id: data?.record?.id })) || {}) as Recordable;
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;

    const treeData = await authorityModuleTreeForEdit({});

    updateSchema([
      {
        field: 'parentId',
        componentProps: {
          treeData,
        },
      },
    ]);

    if (data.parentId) {
      record.value.parentId = data.parentId;
    }

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
        await authorityModuleUpdate({
          ...values,
          id: idRef.value,
          dictCode: dictCode.value,
        });
      } else {
        await authorityModuleAdd({ ...values, dictCode: dictCode.value });
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
