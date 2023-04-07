<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <!-- <a-button
          v-auth="'manage:device:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button> -->
        <a-button
          :loading="isExportLoading"
          v-auth="'manage:device:export'"
          preIcon="ant-design:download-outlined"
          @click="handleExport"
        >
          导出
        </a-button>
        <ImpExcel
          v-auth="'manage:device:import'"
          @success="handleImport"
          :isReturnFile="true"
          dateFormat="YYYY-MM-DD"
        >
          <a-button preIcon="ant-design:upload-outlined"> 导入 </a-button>
        </ImpExcel>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'deviceName'">
          <a @click="handleEdit(record)" :title="record.deviceName">
            {{ record.deviceName }}
          </a>
        </template>
        <template v-else-if="column.key === 'status'">
          <!-- <dict-label :options="alarmStatusOptions" :value="record.dtuipIsAlarms" /> -->
          <!-- <dict-label :options="dataItemStatusOptions" :value="record.status" /> -->
          <a-switch
            :checked="record.status === '0'"
            checked-children="启用"
            un-checked-children="禁用"
            @change="handleSwitchChange(record)"
          />
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
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'manage:device:edit',
              },
              // {
              //   label: '删除',
              //   color: 'error',
              //   auth: 'manage:device:delete',
              //   popConfirm: {
              //     title: '是否确认删除',
              //     confirm: handleDelete.bind(null, record),
              //   },
              // },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <DeviceModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Switch as ASwitch } from 'ant-design-vue';

  import { onMounted, ref } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';

  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import DeviceModal from './DeviceModal.vue';
  import { ImpExcel } from '/@/components/Excel';

  // 接口
  import {
    devicePage,
    deviceDelete,
    deviceUpdate,
    deviceExport,
    deviceImport,
  } from '/@/api/manage/device';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    dataItemStatusOptions,
    searchForm,
    tableColumns,
  } from './device.data';
  import { downloadByData } from '/@/utils/file/download';

  const { notification } = useMessage();

  /**
   * 构建registerModal
   */
  const [registerModal, { openModal }] = useModal();

  const isExportLoading = ref<boolean>(false);

  /**
   * 构建registerTable
   */
  const [registerTable, { reload, getDataSource }] = useTable({
    title: '',
    api: devicePage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: 'right',
      // fixed: undefined,
      // auth: 'system:application:operation',
    },
  });

  // const loadDataSuccess = (rawFile) => {
  //   console.log(rawFile);
  // };

  /**
   * 启用、禁用 - 切换事件
   *
   * @param record 表格行数据
   */
  async function handleSwitchChange(record) {
    await deviceUpdate({ id: record.id, status: record.status === '0' ? '1' : '0' });

    reload();
  }

  /**
   * 导出
   */
  function handleExport() {
    isExportLoading.value = true;

    deviceExport({})
      .then((response) => {
        downloadByData(response, `设备_${new Date().getTime()}.xlsx`);
      })
      .finally(() => {
        isExportLoading.value = false;
      });
  }

  /**
   * 导入
   */
  async function handleImport(rawFile) {
    try {
      const response = await deviceImport({ file: rawFile });

      if (response.status === 200) {
        notification.success({ message: '导入成功!' });
      } else {
        notification.error({ message: '导入失败!' });
      }
    } catch (error) {
      console.log(error);
    }
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
    await deviceDelete({ id: record.id });
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
    const { alarm_status, delete_status, online_status, data_item_status } =
      await optionsListBatchApi([
        'alarm_status',
        'delete_status',
        'online_status',
        'data_item_status',
      ]);
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
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
