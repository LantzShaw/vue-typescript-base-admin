<template>
  <a-spin :spinning="loading">
    <BasicForm @register="register" />
    <div class="flex justify-center">
      <a-button class="!ml-4" type="primary" @click="handleSubmit"> 保存 </a-button>
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
  import { watch, computed, inject, ref, unref, onMounted, defineExpose } from 'vue';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Spin } from 'ant-design-vue';

  const ASpin = Spin;

  // 组件
  import { BasicForm, useForm } from '/@/components/Form';
  import { FormSchema } from '/@/components/Form';
  import { orgTreeSync, orgUpdate } from '/@/api/system/org';
  import { optionsListBatchApi } from '/@/api/sys/dict';

  import { editFormSchemas, idRef, isUpdate } from '../org.data';

  const emit = defineEmits(['success']);

  const { notification } = useMessage();
  const { t } = useI18n();
  const props = defineProps({
    data: { type: Object, default: () => ({}) },
    rootTreeData: { type: Array, default: () => [] },
    dataItemStatusOptions: { type: Array, default: () => [] },
    organizationTypeOptions: { type: Array, default: () => [] },
  });

  const loading = ref<boolean>(false);

  // 当前的弹窗数据
  // const record = ref<Recordable>({});
  const model = ref<object>({});

  const [register, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    size: 'large',
    baseColProps: { span: 24 },
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas: editFormSchemas,
  });

  onMounted(() => {
    // data 变化，重填表单
    watch(
      () => props.data,
      async () => {
        let record = unref(props.data);
        if (typeof record !== 'object') {
          record = {};
        }
        idRef.value = record.id;
        model.value = record;
        await resetFields();
        await setFieldsValue({ ...record });
      },
      { deep: true, immediate: true },
    );
    // 更新 父部门 选项
    watch(
      () => props.rootTreeData,
      async () => {
        updateSchema([
          {
            field: 'parentId',
            componentProps: { treeData: props.rootTreeData },
          },
        ]);
      },
      { deep: true, immediate: true },
    );
    watch(
      () => props.organizationTypeOptions,
      async () => {
        updateSchema([
          {
            field: 'organizationType',
            componentProps: { options: props.organizationTypeOptions },
          },
        ]);
      },
      { deep: true, immediate: true },
    );
    watch(
      () => props.dataItemStatusOptions,
      async () => {
        updateSchema([
          {
            field: 'status',
            componentProps: { options: props.dataItemStatusOptions },
          },
        ]);
      },
      { deep: true, immediate: true },
    );
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      loading.value = true;

      await orgUpdate({
        ...values,
        id: idRef.value,
      });

      notification.success({ message: `执行成功` });

      emit('success');
    } finally {
      loading.value = false;
    }
  }
</script>
