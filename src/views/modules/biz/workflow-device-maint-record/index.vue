<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'manage:maintenance-record:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
        <!-- <a-button
          v-auth="'manage:maintenance-record:export'"
          preIcon="ant-design:download-outlined"
          @click="handleExport"
        >
          导出
        </a-button>
        <a-button
          v-auth="'manage:maintenance-record:import'"
          type="default"
          preIcon="ant-design:upload-outlined"
          @click="handleImport"
        >
          导入
        </a-button> -->
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'eventStatus'">
          <dict-label :options="maintenanceStatusOptions" :value="record.eventStatus" />
        </template>
        <template v-else-if="column.key === 'workType'">
          <dict-label :options="maintenanceWorkOrderTypeOptions" :value="record.workType" />
        </template>
        <template v-else-if="column.key === 'taskType'">
          <dict-label :options="maintenanceTaskTypeOptions" :value="record.taskType" />
        </template>
        <template v-else-if="column.key === 'bizEnterprise'">
          <a-tooltip placement="top">
            <template #title>
              <span
                >[{{ record?.bizEnterprise?.enterpriseNo }}]
                {{ record?.bizEnterprise?.enterpriseName }}</span
              >
            </template>
            <span v-if="record?.bizEnterprise?.enterpriseNo">
              [{{ record?.bizEnterprise?.enterpriseNo }}]
              {{ record?.bizEnterprise?.enterpriseName }}
            </span>
          </a-tooltip>
        </template>

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              // 甲方 - 使用方接收确认
              {
                label: '接收确认',
                onClick: handleFirstPartyConfirm.bind(null, record),
                auth: 'manage:maintenance-record:generate-user',
                disabled: record.apReceiveFlag === '1',
                ifShow: record.eventStatus === '0',
              },
              // 乙方 - 维护方接收确认
              {
                label: '接收确认',
                onClick: handleSecondPartyConfirm.bind(null, record),
                auth: 'manage:maintenance-record:generate-maintainer',
                disabled: record.bpReceiveFlag === '1',
                ifShow: record.eventStatus === '0',
              },
              {
                label: '工作单',
                onClick: handleOpenReportModal.bind(null, record),
                auth: 'manage:maintenance-record:process',
                ifShow: record.eventStatus !== '0',
              },
              // 维护方、使用方流程确认
              {
                label: '流程确认',
                onClick: handleOpenConfirmModal.bind(null, record),
                auth: 'manage:maintenance-record:process',
                ifShow: record.eventStatus === '1',
              },

              {
                label: '工单报告',
                onClick: navigateToEquipmentMaintenanceReport.bind(null, record),
                auth: 'manage:maintenance-record:report',
                ifShow: record.eventStatus === '2',
              },
              {
                label: '查看设备',
                onClick: handleView.bind(null, record),
                auth: 'manage:maintenance-record:view',
                ifShow: true,
              },
            ]"
            :dropDownActions="[
              {
                label: '通知监管方',
                auth: 'manage:maintenance-record:notify',
                popConfirm: {
                  title: '是否通知监管方',
                  confirm: handleNotify.bind(null, record),
                },
              },
              // {
              //   label: '设置停用',
              //   onClick: handleOpenDisabledModal.bind(null, record),
              //   auth: 'manage:maintenance-record:generate-maintainer',
              //   ifShow: record.eventStatus === '1',
              // },
              // {
              //   label: '设置待处置',
              //   onClick: handleOpenPendingModal.bind(null, record),
              //   auth: 'manage:maintenance-record:generate-maintainer',
              //   ifShow: record.eventStatus === '1',
              // },
              {
                label: '删除',
                color: 'error',
                auth: 'manage:maintenance-record:delete',
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
    <EquipmentMaintenanceRecordViewModal
      @register="registerEquipmentMaintenanceRecordViewModal"
      @success="handleSuccess"
    />
    <EquipmentMaintenanceRecordReceiveModal
      @register="registerEquipmentMaintenanceRecordReceiveModal"
      @success="handleSuccess"
    />
    <ReportModal @register="registerReportModal" @success="handleSuccess" />

    <EquipmentMaintenanceRecordDisabledModal
      :id="recordId"
      @register="registerEquipmentMaintenanceRecordDisabledModal"
      @success="handleSuccess"
    />

    <EquipmentMaintenanceRecordPendingModal
      :id="recordId"
      @register="registerEquipmentMaintenanceRecordPendingModal"
      @success="handleSuccess"
    />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted, unref, ref } from 'vue';
  import { useRouter } from 'vue-router';

  // hooks
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { Tooltip as ATooltip } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import EquipmentMaintenanceRecordModal from './EquipmentMaintenanceRecordModal.vue';
  import { jsonToSheetXlsx } from '/@/components/Excel';
  import EquipmentMaintenanceRecordConfirmModal from './EquipmentMaintenanceRecordConfirmModal.vue';
  import EquipmentMaintenanceRecordViewModal from './EquipmentMaintenanceRecordViewModal.vue';
  import EquipmentMaintenanceRecordReceiveModal from './EquipmentMaintenanceRecordReceiveModal.vue';
  import ReportModal from './ReportModal.vue';
  import EquipmentMaintenanceRecordDisabledModal from './EquipmentMaintenanceRecordDisabledModal.vue';
  import EquipmentMaintenanceRecordPendingModal from './EquipmentMaintenanceRecordPendingModal.vue';

  // 接口
  import {
    equipmentMaintenanceRecordApReceive,
    equipmentMaintenanceRecordBpReceive,
    equipmentMaintenanceRecordPage,
    equipmentMaintenanceRecordDelete,
    equipmentMaintenanceRecordSend,
  } from '/@/api/manage/equipmentMaintenanceRecord';

  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    maintenanceTaskTypeOptions,
    maintenanceWorkOrderTypeOptions,
    searchForm,
    tableColumns,
    maintenanceStatusOptions,
    onlineStatusOptions,
    deleteStatusOptions,
    alarmStatusOptions,
    sensorTypeOptions,
  } from './equipmentMaintenanceRecord.data';

  const go = useGo();
  const { currentRoute } = useRouter();
  const { notification } = useMessage();

  const recordId = ref<string>('');

  /**
   * 构建registerModal
   */
  // 编辑
  const [registerEquipmentMaintenanceRecordModal, { openModal: openEquipmentMaintenanceModal }] =
    useModal();

  // 接收确认
  const [
    registerEquipmentMaintenanceRecordReceiveModal,
    { openModal: openEquipmentMaintenanceRecordReceiveModal },
  ] = useModal();

  // 流程确认
  const [
    registerEquipmentMaintenanceRecordConfirmModal,
    { openModal: openEquipmentMaintenanceConfirmModal },
  ] = useModal();

  // 查看设备
  const [
    registerEquipmentMaintenanceRecordViewModal,
    { openModal: openEquipmentMaintenanceRecordViewModal },
  ] = useModal();

  // 生成工作单
  const [registerReportModal, { openModal: openReportModal }] = useModal();

  // 停用
  const [
    registerEquipmentMaintenanceRecordDisabledModal,
    { openModal: openEquipmentMaintenanceRecordDisabledModal },
  ] = useModal();

  // 待处置
  const [
    registerEquipmentMaintenanceRecordPendingModal,
    { openModal: openEquipmentMaintenanceRecordPendingModal },
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
      width: 300,
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
   * 查看设备
   *
   * @param record
   */
  function handleView(record: Recordable) {
    // openEquipmentMaintenanceRecordViewModal(true, {
    //   record,
    //   isUpdate: true,
    // });
    const path = unref(currentRoute).path;
    go(`${path}/sensor/${record.id}`);
  }

  /**
   * 通知监管方
   *
   * @param record
   */
  async function handleNotify(record: Recordable) {
    await equipmentMaintenanceRecordSend({ id: record.id });

    notification.success({ message: `执行成功` });

    await reload();
  }

  /**
   * 甲方接收确认
   *
   * @param record
   */
  async function handleFirstPartyConfirm(record: Recordable) {
    console.log('------------甲方接收确认-------------', record);

    openEquipmentMaintenanceRecordReceiveModal(true, {
      record,
      type: '0',
    });

    // await equipmentMaintenanceRecordApReceive({ id: record.id });

    // reload();
  }

  /**
   * 乙方接收确认
   *
   * @param record
   */
  async function handleSecondPartyConfirm(record: Recordable) {
    console.log('------------乙方接收确认------------', record);

    openEquipmentMaintenanceRecordReceiveModal(true, {
      record,
      type: '1',
    });

    // await equipmentMaintenanceRecordBpReceive({ id: record.id });

    // reload();
  }

  /**
   * 弹出生成工作单框
   *
   * @param record
   */
  function handleOpenReportModal(record: Recordable) {
    openReportModal(true, {
      record,
      isUpdate: true,
    });
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
   * 停用
   *
   * @param record
   */
  function handleOpenDisabledModal(record: Recordable) {
    recordId.value = record.id;

    openEquipmentMaintenanceRecordDisabledModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 待处置
   *
   * @param record
   */
  function handleOpenPendingModal(record: Recordable) {
    recordId.value = record.id;

    openEquipmentMaintenanceRecordPendingModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 跳转至工单报告
   */
  function navigateToEquipmentMaintenanceReport(record: Recordable) {
    const path = unref(currentRoute).path;

    go(`${path}/report/${record.id}`);
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
      maintenance_task_type,
      alarm_status,
      delete_status,
      online_status,
      sensor_type,
      maintenance_status,
      maintenance_work_order_type,
    } = await optionsListBatchApi([
      'maintenance_task_type',
      'alarm_status',
      'delete_status',
      'online_status',
      'sensor_type',
      'maintenance_status',
      'maintenance_work_order_type',
    ]);
    maintenanceTaskTypeOptions.value = maintenance_task_type || [];
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
    sensorTypeOptions.value = sensor_type || [];
    maintenanceStatusOptions.value = maintenance_status || [];
    maintenanceWorkOrderTypeOptions.value = maintenance_work_order_type || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
<script lang="ts">
  export default defineComponent({
    // 需要和路由的name一致
    name: 'WorkflowDeviceMaintRecordPage',
  });
</script>

<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
