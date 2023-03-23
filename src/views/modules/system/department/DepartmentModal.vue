<template>
  <BasicModal
    width="50%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :okAuth="'system:application:add'"
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
  import { computed, unref } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import {
    departmentForm,
    departmentAdd,
    departmentUpdate,
    departmentTreeForEdit,
  } from '/@/api/system/department';
  import { orgTree } from '/@/api/system/org';
  // data
  import {
    isUpdate,
    idRef,
    record,
    inputFormSchemas,
    organizationOptions,
  } from './department.data';

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
    record.value = ((await departmentForm({ id: data?.record?.id })) || {}) as Recordable;
    const treeData2 = (await orgTree({})) || [];

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
      updateSchema([
        {
          field: 'parentId',
          componentProps: {
            treeData: [],
          },
        },
      ]);
    }
    updateSchema([
      {
        field: 'organizationId',
        componentProps: {
          treeData: treeData2,
          onChange: async (e: any) => {
            const treeData = await departmentTreeForEdit({ organizationId: e, id: idRef.value });

            await updateSchema([
              {
                field: 'parentId',
                componentProps: {
                  treeData,
                },
              },
            ]);
            // 如果applicationId没变
            if (record.value.organizationId == e) {
            } else {
              setFieldsValue({ parentId: '0' });
            }
          },
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
        await departmentUpdate({ ...values, id: idRef.value });
      } else {
        await departmentAdd({ ...values });
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
