<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          :loading="isExportLoading"
          v-auth="'manage:sensor:export'"
          preIcon="ant-design:download-outlined"
          @click="handleExport"
        >
          导出
        </a-button>
        <a-button
          v-auth="'manage:sensor:import'"
          type="default"
          preIcon="ant-design:upload-outlined"
          @click="handleImport"
        >
          导入
        </a-button>
        <a-button
          v-auth="'manage:sensor:import'"
          type="default"
          preIcon="ant-design:upload-outlined"
          @click="handleImportTrace"
        >
          导入溯源
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
        <template v-else-if="column.key === 'dtuipValue'">
          {{ record.dtuipValue + record.dtuipUnit }}
        </template>
        <template v-else-if="column.key === 'organizationId'">
          <span
            v-if="record.bizEnterprise?.enterpriseNo"
            style="text-overflow: ellipsis"
            :title="`[${record.bizEnterprise?.enterpriseNo}]${record.bizEnterprise?.enterpriseName}`"
          >
            [{{ record.bizEnterprise?.enterpriseNo }}] {{ record.bizEnterprise?.enterpriseName }}
          </span>
        </template>
        <template v-else-if="column.key === 'regionId'">
          {{ record?.bizInstallRegion?.regionName }}
        </template>

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'manage:sensor:edit',
              },
              {
                label: '溯源',
                onClick: handleViewTraceability.bind(null, record),
                auth: 'manage:sensor:view-traceability',
              },
              {
                label: '履历',
                onClick: handleViewResume.bind(null, record),
                auth: 'manage:sensor:view-resume',
              },
              {
                label: '删除',
                color: 'error',
                auth: 'manage:sensor:delete',
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
    <SensorModal @register="registerModal" @success="handleSuccess" />
    <SensorImportModal @register="registerSensorImportModal" @success="handleSuccess" />
    <SensorImportTraceModal @register="registerSensorImportTraceModal" @success="handleSuccess" />
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
  import SensorModal from './SensorModal.vue';
  import SensorImportModal from './SensorImportModal.vue';
  import SensorImportTraceModal from './SensorImportTraceModal.vue';

  // 接口
  import { sensorPage, sensorDelete, sensorExport, sensorImport } from '/@/api/manage/sensor';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    sensorTypeOptions,
    deviceOptions,
    searchForm,
    tableColumns,
  } from './sensor.data';
  import { downloadByData } from '/@/utils/file/download';
  import { devicePage } from '/@/api/manage/device';
  import { useGo } from '/@/hooks/web/usePage';

  const { notification } = useMessage();
  const go = useGo();

  const isExportLoading = ref<boolean>(false);

  /**
   * 构建registerModal
   */
  const [registerModal, { openModal }] = useModal();
  /**
   * 构建registerModal
   */
  const [registerSensorImportModal, { openModal: openSensorImportModal }] = useModal();
  /**
   * 构建registerModal
   */
  const [registerSensorImportTraceModal, { openModal: openSensorImportTraceModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: sensorPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  /**
   * 跳转至至溯源信息页面
   */
  function handleViewTraceability(record: Recordable) {
    go(`/sensor/traceability/${record.id}?sensorName=${record.sensorName}`);
  }

  /**
   * 跳转至至履历信息页面
   */
  function handleViewResume(record: Recordable) {
    go(`/sensor/resume/${record.id}?sensorName=${record.sensorName}`);
  }

  /**
   * 导出
   */
  function handleExport() {
    isExportLoading.value = true;

    sensorExport({})
      .then((response) => {
        downloadByData(response, `事件触发_${new Date().getTime()}.xlsx`);
      })
      .finally(() => {
        isExportLoading.value = false;
      });
  }

  /**
   * 导入
   */
  function handleImport() {
    openSensorImportModal(true, {});
  }

  /**
   * 导入溯源
   */
  function handleImportTrace() {
    openSensorImportTraceModal(true, {});
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await sensorDelete({ id: record.id });
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
   * 获取设备列表
   */
  async function getDeviceList() {
    const response = await devicePage({ pageIndex: 1, pageSize: 100000 });

    deviceOptions.value = response.records.map((device) => {
      return {
        label: device.deviceName,
        value: device.id,
      };
    });
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
    getDeviceList();
  });
</script>

<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
