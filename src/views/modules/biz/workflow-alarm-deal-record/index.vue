<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'manage:event:export'"
          :loading="isExportLoading"
          preIcon="ant-design:download-outlined"
          @click="handleExport"
        >
          导出
        </a-button>
      </template>

      <!-- <template #expandedRowRender="{ record }">
        <template v-if="record.bizDeviceAlarmList">
          <div
            v-for="(item, index) in record.bizDeviceAlarmList"
            :key="index"
            style="width: 100%; height: 100px; margin: 2px; padding: 2px; border: 1px solid black"
          >
            <a-row type="flex">
              <a-col flex="1"> {{ item.dtuipTriggerDate }} </a-col>
              <a-col flex="1">触发值: {{ item.dtuipTriggerVal }} </a-col>
              <a-col flex="3"><span v-html="item.dtuipTriggerContent"></span></a-col>
            </a-row>
          </div>
        </template>
      </template> -->

      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'alarmSnNo'">
          <a @click="handleViewDeviceAlarm(record)" :title="'点击查看触发记录'">
            {{ record.alarmSnNo }}
          </a>
        </template>
        <template v-else-if="column.key === 'bizEnterprise'">
          <a-tooltip placement="top">
            <template #title>
              <span
                >[{{ record.bizDeviceSensor?.bizEnterprise?.enterpriseNo }}]
                {{ record.bizDeviceSensor?.bizEnterprise?.enterpriseName }}</span
              >
            </template>
            <span v-if="record.bizDeviceSensor?.bizEnterprise?.enterpriseNo">
              [{{ record.bizDeviceSensor?.bizEnterprise?.enterpriseNo }}]
              {{ record.bizDeviceSensor?.bizEnterprise?.enterpriseName }}
            </span>
          </a-tooltip>
        </template>
        <template v-else-if="column.key === 'bizInstallRegion'">
          <a
            v-if="record.bizDeviceSensor?.bizInstallRegion"
            @click="navigateToAnalysis(record)"
            :title="'点击查看报警分析'"
          >
            {{ record.bizDeviceSensor?.bizInstallRegion?.regionName }}
          </a>
        </template>
        <template v-else-if="column.key === 'installLocation'">
          <span v-if="record.bizDeviceSensor">
            {{ record.bizDeviceSensor?.installLocation }}
          </span>
        </template>
        <template v-else-if="column.key === 'locationNo'">
          <span v-if="record.bizDeviceSensor">
            {{ record.bizDeviceSensor?.locationNo }}
          </span>
        </template>
        <template v-else-if="column.key === 'gasType'">
          <span v-if="record.bizDeviceSensor">
            <dict-label :options="gasTypeOptions" :value="record.bizDeviceSensor?.gasType" />
          </span>
        </template>
        <template v-else-if="column.key === 'gasName'">
          <span v-if="record.bizDeviceSensor">
            {{ record.bizDeviceSensor?.gasName }}
          </span>
        </template>

        <template v-else-if="column.key === 'eventStatus'">
          <dict-label :options="eventTriggerStatusOptions" :value="record.eventStatus" />
        </template>

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              // 甲方 - 使用方接受确认
              {
                label: '接收确认',
                onClick: handleFirstPartyConfirm.bind(null, record),
                auth: 'manage:event:receive-user',
                disabled: record.apReceiveFlag === '1',
                ifShow: record.eventStatus === '0',
              },
              // 乙方 - 维护方接受确认
              {
                label: '接收确认',
                onClick: handleSecondPartyConfirm.bind(null, record),
                auth: 'manage:event:receive-maintainer',
                disabled: record.bpReceiveFlag === '1',
                ifShow: record.eventStatus === '0',
              },
              // 维护方、使用方流程处理
              {
                label: '流程处理',
                onClick: handleOpenConfirmModal.bind(null, record),
                auth: 'manage:event:process',
                ifShow: record.eventStatus === '1',
              },
              {
                label: '形成报告',
                onClick: navigateToReport.bind(null, record),
                auth: 'manage:event:report',
                ifShow: record.eventStatus === '2',
              },
              // {
              //   label: '报警分析',
              //   onClick: navigateToAnalysis.bind(null, record),
              //   auth: 'manage:event:analysis',
              //   ifShow: true,
              // },
              {
                label: '作废',
                color: 'error',
                auth: 'manage:event:delete',
                popConfirm: {
                  title: '是否确认作废',
                  confirm: handleDelete.bind(null, record),
                },
                ifShow: record.eventStatus === '0' || record.eventStatus === '1',
              },
            ]"
          />
          <!-- :dropDownActions="[
              {
                label: record?.isNotice === '1' ? `已通知监管方` : '通知监管方',
                auth: 'manage:event:notify',
                ifShow: true,
                disabled: record.eventStatus === '0' || record?.isNotice === '1',
                popConfirm: {
                  title: '是否要通知监管方',
                  confirm: handleNotify.bind(null, record),
                },
              },
              {
                label: '删除',
                color: 'error',
                auth: 'manage:event:delete',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]" -->
        </template>
      </template>
    </BasicTable>
    <EventTriggerModal @register="registerEventTriggerModal" @success="handleSuccess" />
    <EventTriggerConfirmModal
      @register="registerEventTriggerConfirmModal"
      @success="handleSuccess"
    />
    <DeviceAlarmPageModal @register="registerDeviceAlarmPageModal" @success="handleSuccess" />
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
  import EventTriggerModal from './EventTriggerModal.vue';
  import EventTriggerConfirmModal from './EventTriggerConfirmModal.vue';
  import DeviceAlarmPageModal from './DeviceAlarmPageModal.vue';

  // 接口
  import { eventTriggerSend } from '/@/api/manage/eventTrigger';

  import {
    workflowAlarmDealRecordPage,
    workflowAlarmDealRecordInvalid,
    workflowAlarmDealRecordExport,
  } from '/@/api/biz/workflowAlarmDealRecord';

  import {
    alarmDealRecordApReceive,
    alarmDealRecordBpReceive,
  } from '/@/api/manage/alarmDealRecord';

  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    sensorTypeOptions,
    eventTriggerStatusOptions,
    gasTypeOptions,
    searchForm,
    tableColumns,
  } from './eventTrigger.data';
  import { downloadByData } from '/@/utils/file/download';

  const go = useGo();
  const { currentRoute } = useRouter();
  const isExportLoading = ref<boolean>(false);

  const { createMessage, notification } = useMessage();
  const { info } = createMessage;
  /**
   * 构建registerModal
   */
  // 编辑
  const [registerEventTriggerModal, { openModal: openEventTriggerModal }] = useModal();

  // 流程确认框
  const [registerEventTriggerConfirmModal, { openModal: openEventTriggerConfirmModal }] =
    useModal();
  const [registerDeviceAlarmPageModal, { openModal: openDeviceAlarmPageModal }] = useModal();
  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: workflowAlarmDealRecordPage,
    defSort: {
      field: 'dtuipTriggerDate',
      order: 'ascend',
    },
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: true,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'manage:event:operation',
    },
  });

  /**
   * 导出
   */
  function handleExport() {
    isExportLoading.value = true;

    workflowAlarmDealRecordExport({})
      .then((response) => {
        downloadByData(response, `事件触发_${new Date().getTime()}.xlsx`);
      })
      .finally(() => {
        isExportLoading.value = false;
      });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openEventTriggerModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 通知监管方
   *
   * @param record
   */
  async function handleNotify(record: Recordable) {
    await eventTriggerSend({ id: record.id });

    await reload();
  }

  /**
   * 甲方使用方确认
   *
   * @param record
   */
  async function handleFirstPartyConfirm(record: Recordable) {
    console.log('------------------------使用方------------------', record);

    await alarmDealRecordApReceive({
      id: record.id,
    });

    await reload();
  }

  /**
   * 乙方维护方确认
   *
   * @param record
   */
  async function handleSecondPartyConfirm(record: Recordable) {
    console.log('----------------维护放-----------------', record);

    await alarmDealRecordBpReceive({
      id: record.id,
    });

    await reload();
  }

  /**
   * 跳转至报警分析
   *
   * @param record
   */
  function navigateToAnalysis(record: Recordable) {
    const regionId = record.bizDeviceSensor?.regionId;
    if (regionId) {
      const path = unref(currentRoute).path;
      go(`${path}/analysis/${record.id}?regionId=${regionId}&sensorId=${record.sensorId}`);
    } else {
      info('未配置区域');
    }
  }

  // go(`/event-trigger/analysis/${record.sensorId}?deviceName=${record.dtuipDeviceName}`);

  /**
   * 弹出流程处理框
   *
   * @param record
   */
  function handleOpenConfirmModal(record: Recordable) {
    openEventTriggerConfirmModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 形成报告跳转
   *
   * @param record
   */
  function navigateToReport(record: Recordable) {
    const path = unref(currentRoute).path;
    go(`${path}/report/${record.id}`);
  }

  function handleViewDeviceAlarm(record: Recordable) {
    openDeviceAlarmPageModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await workflowAlarmDealRecordInvalid({ id: record.id });
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
      event_trigger_status,
      gas_type,
    } = await optionsListBatchApi([
      'alarm_status',
      'delete_status',
      'online_status',
      'sensor_type',
      'event_trigger_status',
      'gas_type',
    ]);

    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
    sensorTypeOptions.value = sensor_type || [];
    eventTriggerStatusOptions.value = event_trigger_status || [];
    gasTypeOptions.value = gas_type || [];
  }

  onMounted(() => {
    initDict();
  });
</script>

<script lang="ts">
  export default defineComponent({
    // 需要和路由的name一致
    name: 'WorkflowAlarmDealRecordPage',
  });
</script>
<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
