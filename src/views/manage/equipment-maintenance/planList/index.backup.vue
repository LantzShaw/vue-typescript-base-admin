<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'manage:event-trigger:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
        <a-button preIcon="ant-design:download-outlined" @click="handleExport"> 导出 </a-button>
        <a-button type="default" preIcon="ant-design:upload-outlined" @click="handleImport">
          导入
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'sensorName'">
          <a @click="handleEdit(record)" :title="record.sensorName">
            {{ record.sensorName }}
          </a>
        </template>

        <template v-else-if="column.key === 'planStartDate'">
          {{ formatToDate(record.planStartDate) }}
        </template>
        <template v-else-if="column.key === 'planEndDate'">
          {{ formatToDate(record.planEndDate) }}
        </template>
        <template v-else-if="column.key === 'dtuipSensorTypeId'">
          <dict-label :options="sensorTypeOptions" :value="record.dtuipSensorTypeId" />
        </template>
        <template v-else-if="column.key === 'dtuipIsAlarms'">
          <dict-label :options="alarmStatusOptions" :value="record.dtuipIsAlarms" />
        </template>
        <template v-else-if="column.key === 'dtuipIsDelete'">
          <dict-label :options="deleteStatusOptions" :value="record.dtuipIsDelete" />
        </template>
        <template v-else-if="column.key === 'dtuipIsLine'">
          <dict-label :options="onlineStatusOptions" :value="record.dtuipIsLine" />
        </template>
        <template v-else-if="column.key === 'planCycle'">
          <dict-label :options="planPeriodTypeOptions" :value="record.planCycle" />
        </template>
        <!-- <template v-else-if="column.key === 'status'">
          <dict-label :options="onlineStatusOptions" :value="record.dtuipIsLine" />
        </template> -->

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'manage:event-trigger:edit',
              },
              // 甲方 - 使用方形成工单
              {
                label: '形成工单',
                onClick: handleFirstPartyConfirm.bind(null, record),
                auth: 'manage:event-trigger:edit',
                // disabled: record.apReceiveFlag === '1',
                // ifShow:
                //   record.eventStatus === '0' &&
                //   record.apReceiveFlag === '0' &&
                //   externalUserOrgIdList.includes(organizationId),
              },
              // 乙方 - 维护方形成工单
              {
                label: '形成工单',
                onClick: handleSecondPartyConfirm.bind(null, record),
                auth: 'manage:event-trigger:edit',
                // disabled: record.bpReceiveFlag === '1',
                ifShow:
                  record.eventStatus === '0' &&
                  record.bpReceiveFlag === '0' &&
                  maintainerOrgIdList.includes(organizationId),
              },
              {
                label: '流程确认',
                onClick: handleOpenConfirmModal.bind(null, record),
                auth: 'manage:event-trigger:edit',
                ifShow:
                  record.eventStatus === '1' &&
                  record.apReceiveFlag === '1' &&
                  externalUserOrgIdList.includes(organizationId),
              },
              {
                label: '流程确认',
                onClick: handleOpenConfirmModal.bind(null, record),
                auth: 'manage:event-trigger:edit',
                ifShow:
                  record.eventStatus === '1' &&
                  record.bpReceiveFlag === '1' &&
                  maintainerOrgIdList.includes(organizationId),
              },
              {
                label: '工单报告',
                onClick: navigateToReport.bind(null, record),
                auth: 'manage:event-trigger:edit',
                // ifShow: record.eventStatus === '2',
              },
              {
                label: '关联设备',
                onClick: handleEdit.bind(null, record),
                auth: 'manage:event-trigger:edit',
              },
              {
                label: '删除',
                color: 'error',
                auth: 'manage:event-trigger:delete',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <EquipmentMaintenancePlanModal
      @register="registerEquipmentMaintenancePlanModal"
      @success="handleSuccess"
    />
    <EquipmentMaintenanceConfirmModal
      @register="registerEquipmentMaintenanceConfirmModal"
      @success="handleSuccess"
    />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import EquipmentMaintenancePlanModal from './EquipmentMaintenancePlanModal.vue';
  import EquipmentMaintenanceConfirmModal from './EquipmentMaintenanceConfirmModal.vue';
  import { jsonToSheetXlsx } from '/@/components/Excel';

  import { formatToDate } from '/@/utils/dateUtil';

  // 接口
  import {
    equipmentMaintenancePlanPage,
    equipmentMaintenancePlanDelete,
    equipmentMaintenancePlanUpdate,
  } from '/@/api/manage/equipmentMaintenance';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    sensorTypeOptions,
    planPeriodTypeOptions,
    searchForm,
    tableColumns,
  } from './equipmentMaintenancePlan.data';
  import { useUserStore } from '/@/store/modules/user';
  import { getOrganizationId } from '/@/utils/auth';
  import { useGo } from '/@/hooks/web/usePage';

  const userStore = useUserStore();
  const go = useGo();

  const { notification } = useMessage();

  const organizationId = getOrganizationId() as string;

  const maintainerOrgIdList = userStore.getMaintainerOrgIdList || [];
  const externalUserOrgIdList = userStore.getExternalUserOrgIdList || [];

  /**
   * 构建registerModal
   */
  // 编辑
  const [registerEquipmentMaintenancePlanModal, { openModal: openEquipmentMaintenanceModal }] =
    useModal();

  // 设备维护确认
  const [
    registerEquipmentMaintenanceConfirmModal,
    { openModal: openEquipmentMaintenanceConfirmModal },
  ] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload, getDataSource }] = useTable({
    title: '',
    api: equipmentMaintenancePlanPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: true,
    actionColumn: {
      width: 260,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: 'right',
      // fixed: undefined,
      // auth: 'system:application:operation',
    },
  });

  /**
   * 甲方确认
   *
   * @param record
   */
  async function handleFirstPartyConfirm(record: Recordable) {
    console.log('------------------------使用方------------------', record);

    // await equipmentMaintenancePlanUpdate({
    //   id: record.dealRecordId,
    //   apReceiveFlag: '1',
    //   processStep: '000',
    // });

    await reload();
  }

  /**
   * 乙方确认
   *
   * @param record
   */
  async function handleSecondPartyConfirm(record: Recordable) {
    console.log('----------------维护放-----------------', record);

    // await equipmentMaintenancePlanUpdate({
    //   id: record.id,
    //   bpReceiveFlag: '1',
    //   processStep: '050',
    // });

    await reload();
  }

  /**
   * 弹出流程确认框
   *
   * @param record
   */
  function handleOpenConfirmModal(record: Recordable) {
    openEquipmentMaintenanceConfirmModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 工单报告跳转
   *
   * @param record
   */
  function navigateToReport(record: Recordable) {
    go(`/equipment/maintenance/report/${record.id}`);
  }

  /**
   * 导出
   */
  function handleExport() {
    jsonToSheetXlsx({
      data: getDataSource(),
      // header: getColumns().map((column) => column.title),
      filename: `设备维护计划列表_${new Date().getTime()}.xls`,
    });
  }

  /**
   * 导入
   */
  function handleImport() {}

  /**
   * 新增
   */
  function handleCreate() {
    openEquipmentMaintenanceModal(true, {
      isUpdate: false,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openEquipmentMaintenanceModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await equipmentMaintenancePlanDelete({ id: record.id });
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    reload();
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
    initDict();
  });
</script>

<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
