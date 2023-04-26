<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :okAuth="okAuth"
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, unref, computed, nextTick } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  // 接口
  import {
    organizationAdd,
    organizationUpdate,
    organizationForm,
    organizationTreeForEdit,
  } from '/@/api/system/organization';
  // data
  import {
    isUpdate,
    idRef,
    record,
    inputFormSchemas,
    organizationTreeOptions,
  } from '../organization.data';
  const okAuth = ref(['system:organization:edit']);
  const emit = defineEmits(['success', 'register']);

  // const props = defineProps({
  //   rootTreeData: { type: Array, default: () => [] },
  // });

  const { notification } = useMessage();

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 120,
    schemas: inputFormSchemas,
    showActionButtonGroup: false,
    baseColProps: { lg: 24, md: 24 },
  });

  /**
   * 构建Drawer
   */
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ loading: true, confirmLoading: true });
    // 请求数据
    record.value = ((await organizationForm({ id: data?.record?.id })) || {}) as Recordable;
    organizationTreeOptions.value = (await organizationTreeForEdit({})) || [];

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
          treeData: organizationTreeOptions,
        },
      },
    ]);

    setFieldsValue({
      ...record.value,
    });

    setDrawerProps({ loading: false, confirmLoading: false });
  });
  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ loading: true, confirmLoading: true });
      if (unref(isUpdate)) {
        await organizationUpdate({
          ...values,
          id: idRef.value,
        });
      } else {
        await organizationAdd({ ...values });
      }

      notification.success({ message: `执行成功` });
      closeDrawer();
      emit('success');
      // emit('success', data);
    } finally {
      setDrawerProps({ loading: false, confirmLoading: false });
    }
  }
  /**
   * 标题
   */
  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
</script>
