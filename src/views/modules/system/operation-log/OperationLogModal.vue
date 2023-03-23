<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="操作日志详情"
    width="60%"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <Description :column="1" :data="record" :schema="inputFormSchemas" />
  </BasicModal>
</template>
<script lang="ts" setup>
  // 公共组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description } from '/@/components/Description/index';
  // data
  import { record, inputFormSchemas } from './operationLog.data';

  /**
   * 构建registerModal
   */
  const [registerModal, { setModalProps }] = useModalInner((data) => {
    setModalProps({ loading: true, confirmLoading: true });
    record.value = data.record;
    setModalProps({ loading: false, confirmLoading: false });
  });
</script>
