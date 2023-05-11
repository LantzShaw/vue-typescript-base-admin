<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'manage:plan:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
        <!-- <a-button preIcon="ant-design:download-outlined" @click="handleExport"> 导出 </a-button>
        <a-button type="default" preIcon="ant-design:upload-outlined" @click="handleImport">
          导入
        </a-button> -->
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'planNo'">
          <a @click="handleEdit(record)" :title="record.planNo">
            {{ record.planNo }}
          </a>
        </template>

        <template v-else-if="column.key === 'bizEnterprise'">
          <span v-if="record.bizEnterprise?.enterpriseNo">
            [{{ record.bizEnterprise?.enterpriseNo }}] {{ record.bizEnterprise?.enterpriseName }}
          </span>
        </template>
        <template v-else-if="column.key === 'planStartDate'">
          {{ record.planStartDate }}
          -
          {{ record.planEndDate }}
        </template>

        <template v-else-if="column.key === 'planCycle'">
          {{ record.planCycleArgument }}
          <dict-label :options="planCycleOptions" :value="record.planCycle" />
        </template>

        <template v-else-if="column.key === 'status'">
          <dict-label :options="dataItemStatusOptions" :value="record.status" />
        </template>

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'manage:plan:edit',
              },
              {
                label: '关联设备',
                onClick: navigateToAssociationDevice.bind(null, record),
                auth: 'manage:plan:association-device',
              },
              {
                label: '删除',
                color: 'error',
                auth: 'manage:plan:delete',
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
  import { jsonToSheetXlsx } from '/@/components/Excel';

  // 接口
  import {
    equipmentMaintenancePlanPage,
    equipmentMaintenancePlanDelete,
  } from '/@/api/manage/equipmentMaintenance';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    planCycleOptions,
    dataItemStatusOptions,
    searchForm,
    tableColumns,
  } from './equipmentMaintenancePlan.data';

  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();

  const { notification } = useMessage();

  /**
   * 构建registerModal
   */
  // 编辑
  const [registerEquipmentMaintenancePlanModal, { openModal: openEquipmentMaintenanceModal }] =
    useModal();

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
   * 跳转至关联设备
   */
  function navigateToAssociationDevice(record: Recordable) {
    go(`/association/device/${record.id}`);
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
    const { plan_cycle, data_item_status } = await optionsListBatchApi([
      'plan_cycle',
      'data_item_status',
    ]);

    planCycleOptions.value = plan_cycle || [];
    dataItemStatusOptions.value = data_item_status || [];
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
