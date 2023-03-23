<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :okAuth="'system:org:edit'"
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <div style="padding-left: 10px; padding-right: 10px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>
<script lang="ts">
  export default defineComponent({
    name: 'ViewsSysMenuForm',
  });
</script>
<script lang="ts" setup>
  import { defineComponent, ref, unref, computed, nextTick } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import { orgAdd, orgUpdate, orgForm, orgTreeForEdit } from '/@/api/system/org';
  // data
  import { isUpdate, idRef, record, inputFormSchemas, orgTreeOptions } from './org.data';

  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
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
    record.value = ((await orgForm({ id: data?.record?.id })) || {}) as Recordable;
    orgTreeOptions.value = (await orgTreeForEdit({})) || [];

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }
    if (data.parentId) {
      record.value.parentId = data.parentId;
    }

    updateSchema([
      {
        field: 'parentId',
        componentProps: {
          treeData: orgTreeOptions,
        },
      },
    ]);

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
        await orgUpdate({
          ...values,
          id: idRef.value,
        });
      } else {
        await orgAdd({ ...values });
      }

      notification.success({ message: `执行成功` });
      closeModal();
      emit('success');
      // emit('success', data);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
  /**
   * 标题
   */
  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
</script>
