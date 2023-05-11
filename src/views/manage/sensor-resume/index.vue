<template>
  <PageWrapper dense :title="pageTitle" contentFullHeight :contentBackground="false" @back="goBack">
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
        <!-- 表格按钮 -->
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              // {
              //   label: '编辑',
              //   onClick: handleEdit.bind(null, record),
              //   auth: 'manage:sensor-resume:edit',
              // },
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
    <SensorResumeModal @register="registerSensorResumeModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import SensorResumeModal from './SensorResumeModal.vue';

  // 接口
  import { sensorResumePage, sensorResumeDelete } from '/@/api/manage/sensorResume';
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
  } from './sensorResume.data';
  import { useRoute } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';

  const go = useGo();
  const route = useRoute();
  const { closeCurrent } = useTabs();

  const { notification } = useMessage();

  const sensorId = route?.params?.id as string;

  const pageTitle = ref<string>(`${route?.query?.sensorName}传感器`);

  /**
   * 构建registerModal
   */
  // 编辑
  const [registerSensorResumeModal, { openModal: openSensorResumeModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: sensorResumePage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    searchInfo: {
      sensorId,
      // sensorId: '1635874470806687744',
    },
    canResize: false,
    showTableSetting: true,
    showIndexColumn: true,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: 'right',
      // fixed: undefined,
      // auth: 'system:application:operation',
    },
  });

  /**
   * 返回报表总览页面
   */
  function goBack() {
    closeCurrent();

    go('/sensor/list');
  }

  /**
   * 新增
   */
  function handleCreate() {
    openSensorResumeModal(true, {
      isUpdate: false,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openSensorResumeModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await sensorResumeDelete({ id: record.id });
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
