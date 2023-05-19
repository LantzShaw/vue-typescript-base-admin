<template>
  <PageWrapper :title="`溯源信息`" contentFullHeight dense @back="goBack">
    <template #headerContent>
      <a-descriptions :column="2">
        <a-descriptions-item label="传感器名称">
          {{ bizDeviceSensor?.sensorName }}
        </a-descriptions-item>
        <a-descriptions-item label="位号">
          {{ bizDeviceSensor?.locationNo }}
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'manage:sensor-traceability:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
        <a-button
          v-auth="'manage:sensor-traceability:import'"
          type="default"
          preIcon="ant-design:upload-outlined"
          @click="handleImport"
        >
          导入
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <!-- 表格按钮 -->
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              // {
              //   label: '查看附件',
              //   onClick: handleView.bind(null, record),
              //   auth: 'manage:sensor-traceability:view',
              // },
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'manage:sensor-traceability:edit',
              },
              {
                label: '删除',
                color: 'error',
                auth: 'manage:sensor-traceability:delete',
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
    <SensorTraceModal @register="registerModal" @success="handleSuccess" />
    <SensorTraceViewModal @register="registerSensorTraceViewModal" @success="handleSuccess" />
    <SensorTraceImportModal @register="registerSensorTraceImportModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  // hooks
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { Descriptions } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import SensorTraceModal from './SensorTraceModal.vue';
  import SensorTraceImportModal from './SensorTraceImportModal.vue';
  import SensorTraceViewModal from './SensorTraceViewModal.vue';

  // 接口
  import { sensorTracePage, sensorTraceDelete } from '/@/api/biz/sensorTrace';
  import { sensorForm } from '/@/api/biz/sensor';
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
    sensorId,
  } from './sensorTrace.data';

  const ADescriptions = Descriptions;
  const ADescriptionsItem = Descriptions.Item;

  const route = useRoute();

  const { notification } = useMessage();
  const go = useGo();
  const { closeCurrent } = useTabs();
  const { currentRoute } = useRouter();

  const bizDeviceSensor = ref<Recordable>({});

  sensorId.value = route?.params?.sensorId as string;

  /**
   * 构建registerModal
   */
  // 编辑
  const [registerModal, { openModal }] = useModal();

  const [registerSensorTraceViewModal, { openModal: openSensorTraceViewModal }] = useModal();

  const [registerSensorTraceImportModal, { openModal: openSensorTraceImportModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: sensorTracePage,
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
    },
  });

  /**
   * 返回事件触发列表页面
   */
  function goBack() {
    const path = unref(currentRoute).path;
    var paths = path.split('/sensor/');
    go(paths[0]);
    closeCurrent();
  }

  /**
   * 新增
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      sensorId: sensorId.value,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      sensorId: sensorId.value,
    });
  }

  /**
   * 查看附件
   */
  function handleView(record: Recordable) {
    openSensorTraceViewModal(true, {
      record,
      isUpdate: true,
      sensorId: sensorId.value,
    });
  }

  /**
   * 导入
   */
  async function handleImport() {
    openSensorTraceImportModal(true, {});
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await sensorTraceDelete({ id: record.id });
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

    bizDeviceSensor.value = ((await sensorForm({
      id: sensorId.value,
    })) || {}) as Recordable;
  }

  onMounted(() => {
    initDict();
  });
</script>

<style lang="less" scoped></style>
