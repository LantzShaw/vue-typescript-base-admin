<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="新增关联设备"
    width="75%"
    :min-height="500"
    :centered="true"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <div>
      <BasicTable @register="registerTable">
        <!-- 按钮工具栏 -->
        <template #toolbar>
          <a-button
            v-if="getSelectRowKeys().length > 0"
            type="primary"
            danger
            @click="handleBatchBind"
          >
            批量关联
          </a-button>
        </template>
        <!-- 表格内容 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'regionId'">
            {{ record.bizInstallRegion?.regionName }}
          </template>
          <template v-else-if="column.key === 'dtuipSensorTypeId'">
            <dict-label :options="sensorTypeOptions" :value="record.dtuipSensorTypeId" />
          </template>
          <template v-else-if="column.key === 'dtuipIsDelete'">
            <dict-label :options="deleteStatusOptions" :value="record.dtuipIsDelete" />
          </template>
          <template v-else-if="column.key === 'dtuipIsLine'">
            <dict-label :options="onlineStatusOptions" :value="record.dtuipIsLine" />
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { onMounted, nextTick, h } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';

  // 接口

  import {
    workflowDeviceMaintPlanSensorPage2,
    workflowDeviceMaintPlanSensorAdd,
  } from '/@/api/biz/workflowDeviceMaintPlanSensor';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    planId,
    organizationId,
    sensorSearchForm,
    sensorTableColumns,
    sensorTypeOptions,
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
  } from './workflowDeviceMaintPlanSensor.data';

  const emit = defineEmits(['success', 'register']);

  const { t } = useI18n();
  const { notification, createConfirm } = useMessage();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload, getForm, getSelectRowKeys, clearSelectedRowKeys }] = useTable({
    title: '',
    api: workflowDeviceMaintPlanSensorPage2,
    rowSelection: {
      type: 'checkbox',
    },
    rowKey: 'id',
    beforeFetch: (params) => {
      params.planId = planId.value;
      return params;
    },
    immediate: false,
    pagination: true,
    columns: sensorTableColumns,
    formConfig: sensorSearchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    maxHeight: 350,
  });

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    getForm().resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    planId.value = data?.planId;
    organizationId.value = data?.organizationId;
    nextTick(() => {
      reload();
    });

    setModalProps({ loading: false, confirmLoading: false });
  });

  /**
   * 执行成功
   */
  async function handleBatchBind() {
    if (getSelectRowKeys().length > 0) {
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('确认关联')),
        onOk: async () => {
          await workflowDeviceMaintPlanSensorAdd({
            planId: planId.value,
            organizationId: organizationId.value,
            ids: getSelectRowKeys(),
          });

          notification.success({ message: `执行成功` });
          clearSelectedRowKeys();
          handleSuccess();
          emit('success');
        },
      });
    }
  }

  function handleSuccess() {
    reload();
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { alarm_status, delete_status, online_status, sensor_type } = await optionsListBatchApi([
      'alarm_status',
      'delete_status',
      'online_status',
      'sensor_type',
    ]);
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
    sensorTypeOptions.value = sensor_type || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
