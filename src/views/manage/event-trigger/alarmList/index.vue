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

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              // {
              //   label: '编辑',
              //   onClick: handleEdit.bind(null, record),
              //   auth: 'manage:event-trigger:edit',
              // },
              // 使用方接受确认
              {
                label: '使用方接受确认',
                onClick: handleFirstPartyConfirm.bind(null, record),
                auth: 'manage:event-trigger:edit',
                ifShow: externalUserOrgIdList.includes(organizationId),
              },
              // 维护方接受确认
              {
                label: '维护方接受确认',
                onClick: handleSecondPartyConfirm.bind(null, record),
                auth: 'manage:event-trigger:edit',
                ifShow: maintainerOrgIdList.includes(organizationId),
              },
              {
                label: '报警分析',
                onClick: navigateToAnalysis.bind(null, record),
                auth: 'manage:event-trigger:edit',
                ifShow: true,
              },
              {
                label: '去确认',
                // onClick: handleOpenConfirmModal.bind(null, record),
                auth: 'manage:event-trigger:edit',
                ifShow: false,
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
    <AlarmModal @register="registerAlarmModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import AlarmModal from './AlarmModal.vue';
  import { jsonToSheetXlsx } from '/@/components/Excel';

  import { useGo } from '/@/hooks/web/usePage';

  // 接口
  import {
    eventTriggerPage,
    eventTriggerDelete,
    eventTriggerAddToEvent,
  } from '/@/api/manage/eventTrigger';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    sensorTypeOptions,
    searchForm,
    tableColumns,
  } from './alarm.data';
  import { useUserStore } from '/@/store/modules/user';
  import { getOrganizationId } from '/@/utils/auth';

  const { notification } = useMessage();

  const userStore = useUserStore();

  // const organizationId = ref<any>(userStore.getOrganizationId);

  const organizationId = getOrganizationId() as string;

  const maintainerOrgIdList = userStore.getMaintainerOrgIdList || [];
  const externalUserOrgIdList = userStore.getExternalUserOrgIdList || [];

  console.log(organizationId, maintainerOrgIdList, externalUserOrgIdList);

  /**
   * 构建registerModal
   */
  // 编辑
  const [registerAlarmModal, { openModal: openAlarmModal }] = useModal();

  const go = useGo();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload, getDataSource }] = useTable({
    title: '',
    api: eventTriggerPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 240,
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
      filename: `设备报警记录列表_${new Date().getTime()}.xls`,
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
    openAlarmModal(true, {
      isUpdate: false,
    });

    // openEventTriggerConfirmModal(true, {
    //   isUpdate: false,
    // });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openAlarmModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 甲方确认
   *
   * @param record
   */
  function handleFirstPartyConfirm(record: Recordable) {
    console.log('------------------------使用方------------------', record);

    eventTriggerAddToEvent({ deviceAlarmId: record.id, apReceiveFlag: '000' });
  }

  /**
   * 乙方确认
   *
   * @param record
   */
  function handleSecondPartyConfirm(record: Recordable) {
    console.log('----------------维护放-----------------', record);

    eventTriggerAddToEvent({ deviceAlarmId: record.id, bpReceiveFlag: '050' });
  }

  function navigateToAnalysis(record: Recordable) {
    go('/event-trigger/analysis/' + record.id);
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await eventTriggerDelete(record);
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

<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
