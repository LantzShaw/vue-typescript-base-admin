<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="账号信息"
    width="50%"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <Description :column="1" :data="record" :schema="inputFormSchemas2" />
  </BasicModal>
</template>
<script lang="ts" setup>
  // 组件
  import { Description } from '/@/components/Description/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口

  // data
  import { record, inputFormSchemas2 } from './employee.data';

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    // 请求数据
    record.value = data.record.sysUser;

    setModalProps({ loading: false, confirmLoading: false });
  });
</script>
