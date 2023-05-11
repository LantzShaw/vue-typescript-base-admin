<template>
  <PageWrapper :title="`配置关联设备`" contentFullHeight dense @back="goBack">
    <template #headerContent>
      <a-descriptions :column="2">
        <a-descriptions-item label="计划编号">
          {{ bizWorkflowDeviceMaintPlan?.planNo }}
        </a-descriptions-item>
        <a-descriptions-item label="关联企业">
          [{{ bizWorkflowDeviceMaintPlan?.bizEnterprise?.enterpriseNo }}]
          {{ bizWorkflowDeviceMaintPlan?.bizEnterprise?.enterpriseName }}
        </a-descriptions-item>
        <a-descriptions-item label="生效日期">
          {{ bizWorkflowDeviceMaintPlan?.planStartDate }}
          -
          {{ bizWorkflowDeviceMaintPlan?.planEndDate }}
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'manage:association-device:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
        <a-button
          v-if="getSelectRowKeys().length > 0"
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
    <AssociationDeviceModal @register="registerAssociationDeviceModal" @success="handleSuccess" />
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
  import AssociationDeviceModal from './AssociationDeviceModal.vue';

  // 接口

  import { workflowDeviceMaintPlanForm } from '/@/api/manage/workflowDeviceMaintPlan';
  import { associationDevicePage, associationDeviceDelete } from '/@/api/manage/associationDevice';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    organizationId,
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    sensorTypeOptions,
    planPeriodTypeOptions,
    searchForm,
    tableColumns,
  } from './associationDevice.data';

  const ADescriptions = Descriptions;
  const ADescriptionsItem = Descriptions.Item;
  const go = useGo();
  const { closeCurrent } = useTabs();
  const { currentRoute } = useRouter();

  const bizWorkflowDeviceMaintPlan = ref<Recordable>({});

  const { t } = useI18n();
  const { notification, createConfirm } = useMessage();

  const planId = unref(currentRoute).params?.id ?? '';

  /**
   * 构建registerModal
   */
  // 编辑
  const [registerAssociationDeviceModal, { openModal: openAssociationDeviceModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload, getForm, getSelectRowKeys, clearSelectedRowKeys }] = useTable({
    title: '',
    api: associationDevicePage,
    rowSelection: {
      type: 'checkbox',
    },
    rowKey: 'id',
    beforeFetch: (params) => {
      params.planId = planId;
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
    openAssociationDeviceModal(true, {
      isUpdate: false,
      planId: planId,
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
          await associationDeviceDelete([...getSelectRowKeys()]);
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
    var paths = path.split('/item/');
    go(paths[0]);
    closeCurrent();
  }

  async function getBizWorkflowDeviceMaintPlan() {
    bizWorkflowDeviceMaintPlan.value = ((await workflowDeviceMaintPlanForm({
      id: planId,
    })) || {}) as Recordable;

    organizationId.value = bizWorkflowDeviceMaintPlan.value?.organizationId;
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
  }

  onMounted(() => {
    getBizWorkflowDeviceMaintPlan();
    initDict();
  });
</script>
