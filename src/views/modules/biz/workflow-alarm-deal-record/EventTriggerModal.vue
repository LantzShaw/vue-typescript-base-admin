<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :show-cancel-btn="false"
    :show-ok-btn="false"
    :okAuth="okAuth"
    title="详情"
    :centered="true"
  >
    <div style="padding-left: 10px; padding-right: 10px">
      <div class="h-12 leading-12 text-center bg-gray-100 font-bold">事件信息</div>
      <a-descriptions bordered>
        <a-descriptions-item label="设备名称" :span="2">{{
          record.dtuipSensorName ?? '--'
        }}</a-descriptions-item>

        <a-descriptions-item label="触发值" :span="2">{{
          record.dtuipTriggerVal
        }}</a-descriptions-item>
        <a-descriptions-item label="触发时间" :span="2">
          {{ record.dtuipTriggerDate ?? '--' }}
        </a-descriptions-item>

        <a-descriptions-item label="事件状态" :span="2">
          <dict-label :options="eventTriggerStatusOptions" :value="record.eventStatus" />
        </a-descriptions-item>

        <a-descriptions-item label="异常情况" :span="4">
          <div v-html="record.dtuipTriggerContent ?? '--'"> </div>
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
import {ref, unref} from 'vue';
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
  } from 'ant-design-vue';

  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { DictLabel } from '/@/components/DictLabel/index';

  // 接口
  import { eventTriggerForm } from '/@/api/manage/eventTrigger';

  // data
  import { isUpdate, idRef, record, eventTriggerStatusOptions } from './eventTrigger.data';
  const okAuth = ref(['manage:event:view']);
  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    record.value = [];

    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await eventTriggerForm({ id: data?.record?.id })) || {}) as Recordable;
    } else {
      idRef.value = '';
    }

    setModalProps({ loading: false, confirmLoading: false });
  });
</script>
