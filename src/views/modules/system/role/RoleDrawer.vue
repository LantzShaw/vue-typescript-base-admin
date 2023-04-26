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
  import { computed, ref, unref } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';

  // 组件
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  // 接口
  import { roleAdd, roleUpdate, roleForm } from '/@/api/system/role';
  // data
  import { isUpdate, idRef, record, inputFormSchemas } from './role.data';

  const okAuth = ref(['system:role:edit']);
  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 100,
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
    record.value = ((await roleForm({ id: data?.record?.id })) || {}) as Recordable;
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }
    // 字段赋值
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
        await roleUpdate({ ...values, id: idRef.value });
      } else {
        await roleAdd({ ...values });
      }
      notification.success({ message: `执行成功` });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ loading: false, confirmLoading: false });
    }
  }

  /**
   * 标题
   */
  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
</script>
