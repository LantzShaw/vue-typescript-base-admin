<template>
  <a-spin :spinning="loading">
    <CollapseContainer
      v-for="item in applicationMenus"
      :key="item.iamApplicationDto.id"
      :title="item.iamApplicationDto.applicationName"
      class="my-4 application-container"
    >
      <BasicTree
        checkable
        search
        toolbar
        :checkStrictly="true"
        :treeData="item.iamMenuTreeNodeDtoList"
        :checkedKeys="item.grantMenuIdList"
        :expandedKeys="item.grantMenuIdList"
        :ref="setTreeRefs(item.iamApplicationDto.id)"
      />
    </CollapseContainer>
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
  import { CollapseContainer } from '/@/components/Container';
  import { BasicTree, TreeActionType } from '/@/components/Tree';

  // 组件
  import { BasicForm, useForm } from '/@/components/Form';
  import { FormSchema } from '/@/components/Form';
  import { orgTreeSync, orgUpdate, orgOwnMenu, orgGrantMenu } from '/@/api/system/org';
  import { optionsListBatchApi } from '/@/api/sys/dict';

  import { idRef } from '../org.data';
  import { isArray } from '/@/utils/is';
  const emit = defineEmits(['success']);

  const treeRefs: Recordable<TreeActionType> = {};

  const setTreeRefs = (key: string) => (el: any) => {
    if (el) treeRefs[key] = el;
  };
  const applicationMenus = ref<Array<Recordable>>([]);

  const { notification } = useMessage();
  const { t } = useI18n();
  const props = defineProps({
    data: { type: Object, default: () => ({}) },
  });

  const loading = ref<boolean>(false);

  // 当前的弹窗数据
  // const record = ref<Recordable>({});
  const model = ref<object>({});

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
        loading.value = true;
        applicationMenus.value = (await orgOwnMenu({ organizationId: record.id })) || [];
        loading.value = false;
      },
      { deep: true, immediate: true },
    );
  });

  function getGrantMenuIdList() {
    const keys = Object.keys(treeRefs);
    let ids: Array<any> = [];
    for (const key of keys) {
      const ks = treeRefs[key].getCheckedKeys();
      if (isArray(ks)) {
        for (const k of ks as Array<any>) {
          ids.push(k);
        }
      } else {
        for (const k of ks.checked as Array<any>) {
          ids.push(k);
        }
      }
    }
    return ids;
  }
  async function handleSubmit() {
    try {
      loading.value = true;
      let grantMenuIdList = getGrantMenuIdList();
      await orgGrantMenu({ organizationId: idRef.value, menuIds: grantMenuIdList });
      notification.success({ message: `执行成功` });
      emit('success');
    } finally {
      loading.value = false;
    }
  }
</script>
<style lang="less">
  .application-container {
    border: 1px solid #d9d9d9;
  }
</style>
