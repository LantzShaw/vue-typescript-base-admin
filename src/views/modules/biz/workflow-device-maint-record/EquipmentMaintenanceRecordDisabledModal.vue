<template>
  <BasicModal
    width="100%"
    v-bind="$attrs"
    :default-fullscreen="true"
    :can-fullscreen="false"
    @register="registerModal"
    :showOkBtn="false"
    :showCancelBtn="false"
    showFooter
    title="设置停用传感器"
    :centered="true"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <a-row>
        <a-col :span="12">
          <BasicTable :clickToRowSelect="false" @register="registerNormalTable">
            <template #toolbar>
              <a-button
                :disabled="normalCheckedKeys.length === 0"
                @click="handleBatchDisabled"
                type="danger"
                >批量停用</a-button
              >
            </template>
          </BasicTable>
        </a-col>
        <a-col :span="12">
          <div style="display: flex; justify-content: space-between">
            <div class="pl-4 h-10 leading-10">
              <span class="font-bold">停用传感器</span>
              <!-- <span class="font-bold text-green-500">{{ disabledSensorAmount }}个</span> -->
            </div>
            <div class="pr-4 h-10 leading-10">
              <a-button
                @click="handleBatchRemoveDisabled"
                :disabled="disabledCheckedKeys.length === 0"
                type="danger"
                >批量移除</a-button
              >
            </div>
          </div>

          <BasicTable :clickToRowSelect="false" @register="registerDisabledTable">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <TableAction
                  stopButtonPropagation
                  :actions="[
                    {
                      label: '移除',
                      color: 'error',
                      onClick: removeCheckedKeys.bind(null, record),
                    },
                  ]"
                />
              </template>
            </template>
          </BasicTable>
        </a-col>
      </a-row>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';

  import { Row as ARow, Col as ACol } from 'ant-design-vue';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';

  // 接口
  import { equipmentMaintenanceRecordForm } from '/@/api/manage/equipmentMaintenanceRecord';

  import {
    workflowDeviceMaintRecordHandleStop,
    workflowDeviceMaintRecordHandleNormal,
  } from '/@/api/biz/workflowDeviceMaintRecord';

  import { workflowDeviceMaintSensorPage } from '/@/api/biz/workflowDeviceMaintSensor';

  // data
  import {
    isUpdate,
    idRef,
    record,
    sensorResultTableColumns,
  } from './equipmentMaintenanceRecord.data';
  import { t } from '/@/hooks/web/useI18n';

  type Props = {
    id?: string;
  };
  type Key = string | number;
  type Sensor = {
    id?: string;
    sensorName?: string;
  };

  const props = withDefaults(defineProps<Props>(), {});

  const { notification } = useMessage();
  const normalCheckedKeys = ref<Key[]>([]);
  const disabledCheckedKeys = ref<Key[]>([]);

  const disabledSensorAmount = ref<number>(0);

  const sensorOptions = ref<Sensor[]>([]);

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });

    // NOTE: 重置查询字段
    await getForm().resetFields();

    sensorOptions.value = [];

    normalCheckedKeys.value = [];
    disabledCheckedKeys.value = [];

    setModalProps({ loading: false, confirmLoading: false });
  });

  /**
   * 正常传感器列表 - 表格构建
   *
   * registerNormalTable
   */
  const [registerNormalTable, { reload: reloadNormalTable, getForm }] = useTable({
    title: '',
    api: workflowDeviceMaintSensorPage,
    beforeFetch: (parmas) => {
      return {
        ...parmas,
        recordId: props.id,
        neProcessResult: '2',
      };
    },
    pagination: true,
    columns: sensorResultTableColumns,
    formConfig: {
      baseColProps: { lg: 12, md: 8 },
      labelWidth: 80,
      schemas: [
        {
          label: t('位号'),
          field: 'locationNo',
          component: 'Input',
          componentProps: {
            placeholder: '请输入位号',
          },
        },
      ],
    },
    useSearchForm: true,
    canResize: false,
    showTableSetting: false,
    showIndexColumn: false,
    rowKey: 'id',
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: normalCheckedKeys,
      onSelect: onNormalSelect,
      onSelectAll: onNormalSelectAll,
    },
  });

  /**
   * 停用传感器 - 表格构建
   *
   *  registerDisabledTable
   */
  const [registerDisabledTable, { reload: reloadDisabledTable }] = useTable({
    title: '',
    api: workflowDeviceMaintSensorPage,
    beforeFetch: (parmas) => {
      return {
        ...parmas,
        recordId: props.id,
        processResult: '2',
      };
    },
    afterFetch: (data) => {
      disabledSensorAmount.value = data.length ?? 0;
    },
    pagination: true,
    columns: sensorResultTableColumns,
    useSearchForm: false,
    canResize: false,
    showTableSetting: false,
    showIndexColumn: false,
    rowKey: 'id',
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: disabledCheckedKeys,
      onSelect: onDisabledSelect,
      onSelectAll: onDisabledSelectAll,
    },
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  /**
   * 正常传感器列表 - 批量停用
   */
  async function handleBatchDisabled() {
    const bizWorkflowDeviceMaintSensorList = normalCheckedKeys.value.map((key) => {
      return {
        id: key,
      };
    });

    await workflowDeviceMaintRecordHandleStop({
      id: props.id,
      bizWorkflowDeviceMaintSensorList,
    });

    normalCheckedKeys.value = [];

    onReload();

    notification.success({ message: `操作成功!` });
  }

  /**
   * 停用传感器列表 - 批量移除
   */
  async function handleBatchRemoveDisabled() {
    const bizWorkflowDeviceMaintSensorList = disabledCheckedKeys.value.map((key) => {
      return {
        id: key,
      };
    });

    await workflowDeviceMaintRecordHandleNormal({
      id: props.id,
      bizWorkflowDeviceMaintSensorList,
    });

    disabledCheckedKeys.value = [];

    onReload();

    notification.success({ message: `操作成功!` });
  }

  /**
   * 表格刷新
   */
  async function onReload() {
    await reloadNormalTable();
    await reloadDisabledTable();
  }

  /**
   * 正常传感器列表 - 表格选中
   *
   * @param record
   * @param selected
   */
  function onNormalSelect(record, selected) {
    if (selected) {
      normalCheckedKeys.value = [...normalCheckedKeys.value, record.id];
    } else {
      normalCheckedKeys.value = normalCheckedKeys.value.filter((id) => id !== record.id);
    }
  }

  /**
   * 正常传感器列表 - 表格全选
   *
   * @param selected
   * @param selectedRows
   * @param changeRows
   */
  function onNormalSelectAll(selected, selectedRows, changeRows) {
    const changeIds = changeRows.map((item) => item.id);
    if (selected) {
      normalCheckedKeys.value = [...normalCheckedKeys.value, ...changeIds];
    } else {
      normalCheckedKeys.value = normalCheckedKeys.value.filter((id) => {
        return !changeIds.includes(id);
      });
    }
  }

  /**
   * 停用传感器列表 - 表格选中
   *
   * @param record
   * @param selected
   */
  function onDisabledSelect(record, selected) {
    if (selected) {
      disabledCheckedKeys.value = [...disabledCheckedKeys.value, record.id];
    } else {
      disabledCheckedKeys.value = disabledCheckedKeys.value.filter((id) => id !== record.id);
    }
  }

  /**
   * 停用传感器列表 - 表格全选
   *
   * @param selected
   * @param selectedRows
   * @param changeRows
   */
  function onDisabledSelectAll(selected, selectedRows, changeRows) {
    const changeIds = changeRows.map((item) => item.id);
    if (selected) {
      disabledCheckedKeys.value = [...disabledCheckedKeys.value, ...changeIds];
    } else {
      disabledCheckedKeys.value = disabledCheckedKeys.value.filter((id) => {
        return !changeIds.includes(id);
      });
    }
  }

  /**
   * 停用传感器列表 - 单个移除
   *
   * @param record
   */
  async function removeCheckedKeys(record) {
    await workflowDeviceMaintRecordHandleNormal({
      id: props.id,
      bizWorkflowDeviceMaintSensorList: [
        {
          id: record.id,
        },
      ],
    });

    disabledCheckedKeys.value = [];

    onReload();

    notification.success({ message: `操作成功!` });
  }
</script>
