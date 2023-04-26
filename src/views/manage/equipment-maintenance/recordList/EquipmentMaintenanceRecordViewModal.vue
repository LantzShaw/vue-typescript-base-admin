<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :showCancelBtn="false"
    :showOkBtn="false"
    title="查看设备"
    :centered="true"
    :okAuth="okAuth"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <BasicTable :columns="deviceTableColumns" :dataSource="record.sensors" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
import {ref, unref} from 'vue';

  // 组件
  import { BasicTable } from '/@/components/Table';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import { equipmentMaintenanceRecordForm } from '/@/api/manage/equipmentMaintenanceRecord';
  // data
  import { isUpdate, idRef, record, deviceTableColumns } from './equipmentMaintenanceRecord.data';
  const okAuth = ref(['manage:maintenance-record:view']);
  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    // 请求数据
    record.value = ((await equipmentMaintenanceRecordForm({ id: data?.record?.id })) ||
      {}) as Recordable;
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }

    setModalProps({ loading: false, confirmLoading: false });
  });
</script>
