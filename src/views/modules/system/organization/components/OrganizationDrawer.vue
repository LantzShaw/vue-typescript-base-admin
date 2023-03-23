<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :okAuth="'system:org:edit'"
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
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
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  // 接口
  import { orgAdd, orgUpdate, orgForm, orgTreeForEdit } from '/@/api/system/org';
  // data
  import { isUpdate, idRef, record, inputFormSchemas, orgTreeOptions } from '../org.data';

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
        await orgUpdate({
          ...values,
          id: idRef.value,
        });
      } else {
        await orgAdd({ ...values });
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
