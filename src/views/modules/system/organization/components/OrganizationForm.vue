<template>
  <div class="m-4 mr-0 p-2 overflow-hidden bg-white">
    <BasicForm @register="register" />
    <div class="flex justify-center">
      <a-button @click="resetFields"> 重置1 </a-button>
      <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { watch, computed, inject, ref, unref, onMounted, defineExpose } from 'vue';

  import {
    Divider,
    Alert,
    Tree,
    Spin,
    Card,
    Empty,
    Descriptions,
    Steps,
    Tabs,
  } from 'ant-design-vue';

  // 组件
  import { BasicForm, useForm } from '/@/components/Form';

  import { orgTreeSync } from '/@/api/system/org';

  import {
    orgTypeOptions,
    treeData,
    searchForm,
    tableColumns,
    inputFormSchemas,
  } from '../organization.data';

  const emit = defineEmits(['success']);

  const props = defineProps({
    data: { type: Object, default: () => ({}) },
    rootTreeData: { type: Array, default: () => [] },
  });

  const loading = ref<boolean>(false);
  // 当前是否是更新模式
  const isUpdate = ref<boolean>(true);
  // 当前的弹窗数据
  const model = ref<object>({});

  const [register, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    size: 'large',
    baseColProps: { span: 24 },
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas: inputFormSchemas,
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
        model.value = record;
        await resetFields();
        await setFieldsValue({ ...record });
      },
      { deep: true, immediate: true },
    );
  });

  function handleSubmit() {}

  // const categoryOptions = computed(() => {
  //   if (!!props?.data?.parentId) {
  //     return orgCategoryOptions.child;
  //   } else {
  //     return orgCategoryOptions.root;
  //   }
  // });
</script>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: {
      [Divider.name]: Divider,
      [Alert.name]: Alert,
      ATree: Tree,
      AEmpty: Empty,
      ASpin: Spin,
    },
  });
</script>
