<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :okAuth="'system:dict-item:add'"
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
    labelWidth: 90,
    schemas: inputFormSchemas2,
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
        await authorityModuleUpdate({
          ...values,
          id: idRef.value,
          dictCode: dictCode.value,
        });
      } else {
        await authorityModuleAdd({ ...values, dictCode: dictCode.value });
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
