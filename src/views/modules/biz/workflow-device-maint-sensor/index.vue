<template>
  <PageWrapper :title="`维护工单配置关联设备`" contentFullHeight dense @back="goBack">
    <template #headerContent>
      <a-descriptions :column="2">
        <a-descriptions-item label="流水号">
          {{ bizWorkflowDeviceMaintRecord?.recordNo }}
        </a-descriptions-item>
        <a-descriptions-item label="关联企业">
          [{{ bizWorkflowDeviceMaintRecord?.bizEnterprise?.enterpriseNo }}]
          {{ bizWorkflowDeviceMaintRecord?.bizEnterprise?.enterpriseName }}
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-if="bizWorkflowDeviceMaintRecord.eventStatus == 0"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
        <a-button
          v-if="getSelectRowKeys().length > 0 && bizWorkflowDeviceMaintRecord.eventStatus == 0"
          type="primary"
          danger
          @click="handleBatchDelete"
        >
          批量删除
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'dtuipSensorTypeId'">
          <dict-label :options="sensorTypeOptions" :value="record.dtuipSensorTypeId" />
        </template>
        <template v-else-if="column.key === 'dtuipIsDelete'">
          <dict-label :options="deleteStatusOptions" :value="record.dtuipIsDelete" />
        </template>
        <template v-else-if="column.key === 'dtuipIsLine'">
          <dict-label :options="onlineStatusOptions" :value="record.dtuipIsLine" />
        </template>
        <!-- 表格按钮 -->
      </template>
    </BasicTable>
    <WorkflowDeviceMaintSensorModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, unref, ref, h } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  // hooks
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { Descriptions } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import WorkflowDeviceMaintSensorModal from './WorkflowDeviceMaintSensorModal.vue';

  // 接口

  import { workflowDeviceMaintRecordForm } from '/@/api/biz/workflowDeviceMaintRecord';
  import {
    workflowDeviceMaintSensorPage,
    workflowDeviceMaintSensorDelete,
  } from '/@/api/biz/workflowDeviceMaintSensor';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    recordId,
    organizationId,
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    sensorTypeOptions,
    planPeriodTypeOptions,
    searchForm,
    tableColumns,
  } from './workflowDeviceMaintSensor.data';

  const ADescriptions = Descriptions;
  const ADescriptionsItem = Descriptions.Item;
  const go = useGo();
  const { closeCurrent } = useTabs();
  const { currentRoute } = useRouter();

  const bizWorkflowDeviceMaintRecord = ref<Recordable>({});

  const { t } = useI18n();
  const { notification, createConfirm } = useMessage();

  recordId.value = unref(currentRoute).params?.recordId as string;

  /**
   * 构建registerModal
   */
  // 编辑
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload, getSelectRowKeys, clearSelectedRowKeys }] = useTable({
    title: '',
    api: workflowDeviceMaintSensorPage,
    rowSelection: {
      type: 'checkbox',
    },
    rowKey: 'id',
    beforeFetch: (params) => {
      params.recordId = recordId.value;
      return params;
    },
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
  });

  /**
   * 新增
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      recordId: recordId.value,
      organizationId: organizationId.value,
    });
  }

  /**
   * 删除
   */
  async function handleBatchDelete() {
    if (getSelectRowKeys().length > 0) {
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('确认删除')),
        onOk: async () => {
          await workflowDeviceMaintSensorDelete({
            recordId: recordId.value,
            ids: [...getSelectRowKeys()],
          });
          notification.success({ message: `执行成功` });
          clearSelectedRowKeys();
          handleSuccess();
        },
      });
    }
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    reload();
  }

  function goBack() {
    const path = unref(currentRoute).path;
    var paths = path.split('/sensor/');
    closeCurrent();
    go(paths[0]);
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { alarm_status, delete_status, online_status, sensor_type, plan_period_type } =
      await optionsListBatchApi([
        'alarm_status',
        'delete_status',
        'online_status',
        'sensor_type',
        'plan_period_type',
      ]);
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
    sensorTypeOptions.value = sensor_type || [];
    planPeriodTypeOptions.value = plan_period_type || [];

    bizWorkflowDeviceMaintRecord.value = ((await workflowDeviceMaintRecordForm({
      id: recordId.value,
    })) || {}) as Recordable;

    organizationId.value = bizWorkflowDeviceMaintRecord.value?.organizationId;
  }

  onMounted(() => {
    initDict();
  });
</script>
