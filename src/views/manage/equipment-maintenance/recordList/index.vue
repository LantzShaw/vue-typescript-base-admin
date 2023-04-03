<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <!-- <a-button
          v-auth="'manage:event-trigger:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button> -->
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
        <template v-else-if="column.key === 'eventStatus'">
          <dict-label :options="maintenanceStatusOptions" :value="record.eventStatus" />
        </template>

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              // 甲方 - 使用方形成工单
              {
                label: '形成工单',
                onClick: handleFirstPartyConfirm.bind(null, record),
                auth: 'manage:event-trigger:edit',
                ifShow:
                  record.apReceiveFlag === '0' && externalUserOrgIdList.includes(organizationId),
              },
              // 乙方 - 维护方形成工单
              {
                label: '形成工单',
                onClick: handleSecondPartyConfirm.bind(null, record),
                auth: 'manage:event-trigger:edit',
                ifShow:
                  record.bpReceiveFlag === '0' && maintainerOrgIdList.includes(organizationId),
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
                onClick: navigateToEquipmentMaintenanceReport.bind(null, record),
                auth: 'manage:event-trigger:edit',
                ifShow: record.eventStatus === '2',
              },
              {
                label: '通知监管方',
                auth: 'manage:event-trigger:delete',
                disabled: record.eventStatus !== '2',
                popConfirm: {
                  title: '是否通知监管方',
                  confirm: handleDelete.bind(null, record),
                },
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
    <EquipmentMaintenanceRecordModal
      @register="registerEquipmentMaintenanceRecordModal"
      @success="handleSuccess"
    />
    <EquipmentMaintenanceRecordConfirmModal
      @register="registerEquipmentMaintenanceRecordConfirmModal"
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
  import EquipmentMaintenanceRecordModal from './EquipmentMaintenanceRecordModal.vue';
  import { jsonToSheetXlsx } from '/@/components/Excel';
  import EquipmentMaintenanceRecordConfirmModal from './EquipmentMaintenanceRecordConfirmModal.vue';

  // 接口
  import {
    equipmentMaintenanceRecordPage,
    equipmentMaintenanceRecordDelete,
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
    maintenanceStatusOptions,
  } from './equipmentMaintenanceRecord.data';
  import { getOrganizationId } from '/@/utils/auth';
  import { useUserStore } from '/@/store/modules/user';
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
  const [registerEquipmentMaintenanceRecordModal, { openModal: openEquipmentMaintenanceModal }] =
    useModal();

  const [
    registerEquipmentMaintenanceRecordConfirmModal,
    { openModal: openEquipmentMaintenanceConfirmModal },
  ] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload, getDataSource }] = useTable({
    title: '',
    api: equipmentMaintenanceRecordPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: true,
    actionColumn: {
      width: 220,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: 'right',
      // fixed: undefined,
      // auth: 'system:application:operation',
    },
  });

  /**
   * 导出
   */
  function handleExport() {
    jsonToSheetXlsx({
      data: getDataSource(),
      // header: getColumns().map((column) => column.title),
      filename: `设备维护列表_${new Date().getTime()}.xls`,
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
   * 甲方形成工单确认
   *
   * @param record
   */
  function handleFirstPartyConfirm(record: Recordable) {
    console.log('------------甲方形成工单确认-------------', record);
  }

  /**
   * 乙方形成工单确认
   *
   * @param record
   */
  function handleSecondPartyConfirm(record: Recordable) {
    console.log('------------乙方形成工单确认------------', record);
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
   * 跳转至工单报告
   */
  function navigateToEquipmentMaintenanceReport(record: Recordable) {
    go(`/equipment/maintenance/report/${record.id}`);
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await equipmentMaintenanceRecordDelete({ id: record.id });
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
    const {
      alarm_status,
      delete_status,
      online_status,
      sensor_type,
      plan_period_type,
      maintenance_status,
    } = await optionsListBatchApi([
      'alarm_status',
      'delete_status',
      'online_status',
      'sensor_type',
      'plan_period_type',
      'maintenance_status',
    ]);
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
    sensorTypeOptions.value = sensor_type || [];
    planPeriodTypeOptions.value = plan_period_type || [];
    maintenanceStatusOptions.value = maintenance_status || [];
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
