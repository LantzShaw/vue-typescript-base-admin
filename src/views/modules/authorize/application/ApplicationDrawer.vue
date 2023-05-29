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
    <div style="padding-right: 10px; padding-left: 10px">
      <BasicForm @register="registerForm" />
    </div>
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
  import { optionsListBatchApi } from '/@/api/sys/dict';
  import { applicationForm, applicationAdd, applicationUpdate } from '/@/api/authorize/application';
  import { scopeSelect } from '/@/api/authorize/scope';
  // data
  import { isUpdate, idRef, record, inputFormSchemas } from './application.data';

  const okAuth = ref(['authorize:application:add', 'authorize:application:edit']);
  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 200,
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
    record.value = ((await applicationForm({ id: data?.record?.id })) || {}) as Recordable;
    const scopeOptions = (await scopeSelect({})) || [];
    const { grant_types } = await optionsListBatchApi(['grant_types']);

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }

    // 应用范围
    updateSchema([
      {
        field: 'scopeIds',
        componentProps: {
          options: scopeOptions,
        },
      },
    ]);
    updateSchema([
      {
        field: 'authorizationGrantTypeSet',
        componentProps: {
          options: grant_types,
        },
      },
    ]);

    let authorizationGrantTypeSet = record.value.authorizationGrantTypes
      ? record.value.authorizationGrantTypes.split(',')
      : [];
    let clientAuthenticationMethodSet = record.value.clientAuthenticationMethods
      ? record.value.clientAuthenticationMethods.split(',')
      : [];
    setFieldsValue({
      ...record.value,
      authorizationGrantTypeSet,
      clientAuthenticationMethodSet,
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
      let authorizationGrantTypes = values.authorizationGrantTypeSet.join(',');
      let clientAuthenticationMethods = values.clientAuthenticationMethodSet.join(',');
      if (unref(isUpdate)) {
        await applicationUpdate({
          ...values,
          authorizationGrantTypes,
          clientAuthenticationMethods,
          id: idRef.value,
        });
      } else {
        await applicationAdd({ ...values, authorizationGrantTypes, clientAuthenticationMethods });
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
