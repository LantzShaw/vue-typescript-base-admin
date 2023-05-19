<template>
  <PageWrapper
    dense
    :title="`履历信息`"
    contentFullHeight
    :contentBackground="false"
    @back="goBack"
  >
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
      <!-- <template #toolbar>
        <a-button
          v-auth="'manage:sensor-resume:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template> -->
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'cvSource'">
          <dict-label :options="cvSourceOptions" :value="record.cvSource" />
        </template>
        <template v-if="column.key === 'taskType'">
          <dict-label
            :options="maintenanceTaskTypeOptions"
            :value="record.bizWorkflowDeviceMaintRecord?.taskType"
          />
        </template>

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '删除',
                color: 'error',
                auth: 'manage:sensor-resume:delete',
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
    <SensorCvModal @register="registerModal" @success="handleSuccess" />
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
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import SensorCvModal from './SensorCvModal.vue';

  // 接口
  import { sensorForm } from '/@/api/biz/sensor';
  import { sensorCvPage, sensorCvDelete } from '/@/api/biz/sensorCv';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    cvSourceOptions,
    maintenanceTaskTypeOptions,
    onlineStatusOptions,
    sensorTypeOptions,
    planPeriodTypeOptions,
    searchForm,
    tableColumns,
    sensorId,
  } from './sensorCv.data';

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

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: sensorCvPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    beforeFetch: (params) => {
      params.sensorId = sensorId.value || '';
      return params;
    },

    canResize: false,
    showTableSetting: true,
    showIndexColumn: true,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      // fixed: undefined,
      // auth: 'system:application:operation',
    },
  });

  /**
   * 返回报表总览页面
   */
  function goBack() {
    const path = unref(currentRoute).path;
    var paths = path.split('/sensor/');
    closeCurrent();
    go(paths[0]);
  }

  /**
   * 新增
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
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
    await sensorCvDelete({ id: record.id });
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
    const { cv_source, maintenance_task_type, online_status, sensor_type, plan_period_type } =
      await optionsListBatchApi([
        'cv_source',
        'maintenance_task_type',
        'online_status',
        'sensor_type',
        'plan_period_type',
      ]);
    cvSourceOptions.value = cv_source || [];
    maintenanceTaskTypeOptions.value = maintenance_task_type || [];
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
