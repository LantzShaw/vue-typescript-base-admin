<template>
  <PageWrapper :title="`配置关联设备`" contentFullHeight dense @back="goBack">
    <template #headerContent>
      <a-descriptions :column="2">
        <a-descriptions-item label="计划编号">
          {{ bizWorkflowDeviceMaintPlan.planNo }}
        </a-descriptions-item>
        <a-descriptions-item label="关联企业">
          {{ bizEnterprise.enterpriseName }}
        </a-descriptions-item>
        <a-descriptions-item label="生效日期">
          {{ bizWorkflowDeviceMaintPlan.planStartDate }}
          -
          {{ bizWorkflowDeviceMaintPlan.planEndDate }}
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
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <!-- 表格按钮 -->
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '删除',
                color: 'error',
                auth: 'manage:association-device:delete',
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
    <AssociationDeviceModal @register="registerAssociationDeviceModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, unref, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { Descriptions } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import AssociationDeviceModal from './AssociationDeviceModal.vue';

  // 接口
  import { companyForm } from '/@/api/manage/company';
  import { workflowDeviceMaintPlanForm } from '/@/api/manage/workflowDeviceMaintPlan';
  import { associationDevicePage, associationDeviceDelete } from '/@/api/manage/associationDevice';
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
  } from './associationDevice.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';

  const ADescriptions = Descriptions;
  const ADescriptionsItem = Descriptions.Item;
  const go = useGo();
  const { closeCurrent } = useTabs();
  const { currentRoute } = useRouter();

  const bizWorkflowDeviceMaintPlan = ref<Recordable>({});
  const bizEnterprise = ref<Recordable>({});
  const { notification } = useMessage();

  const planId = unref(currentRoute).params?.id ?? '';
  const organizationId = unref(currentRoute).query?.organizationId ?? '';
  /**
   * 构建registerModal
   */
  // 编辑
  const [registerAssociationDeviceModal, { openModal: openAssociationDeviceModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: associationDevicePage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: true,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      // auth: 'system:application:operation',
    },
  });

  /**
   * 新增
   */
  function handleCreate() {
    openAssociationDeviceModal(true, {
      isUpdate: false,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await associationDeviceDelete({ id: record.id });
    notification.success({ message: `执行成功` });
    handleSuccess();
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

    bizEnterprise.value = ((await companyForm({
      id: organizationId,
    })) || {}) as Recordable;
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

<style lang="less" scoped>
  // .dict-label {
  //   :deep(.ant-tag) {
  //     margin: 4px;
  //   }
  // }
</style>
