<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    title="新增关联设备"
    :centered="true"
    @ok="handleSubmit"
    :okAuth="okAuth"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <BasicTable @register="registerTable" :selectedRowKeys="checkedKeys">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'dtuipSensorTypeId'">
            <dict-label :options="sensorTypeOptions" :value="record.dtuipSensorTypeId" />
          </template>
          <template v-else-if="column.key === 'installRegion'">
            {{ record.bizInstallRegion?.regionName }}
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
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';

  // 接口
  import { associationDeviceAdd, associationDevicePage } from '/@/api/manage/associationDevice';
  // data
  import {
    isUpdate,
    record,
    sensorSearchForm,
    sensorTableColumns,
    sensorTypeOptions,
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    enterpriseOptions,
    regionOptions,
    organizationId,
  } from './associationDevice.data';
  import { sensorPage } from '/@/api/manage/sensor';
  import { companyPage } from '/@/api/manage/company';
  import { installRegionPage } from '/@/api/manage/installRegion';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  import { useRoute } from 'vue-router';

  const okAuth = ref(['manage:maintenance-record:add']);
  const emit = defineEmits(['success', 'register']);

  const route = useRoute();

  const { notification } = useMessage();
  const checkedKeys = ref<Array<string | number>>([]);
  const deviceIds = ref<Array<string | number>>([]);

  const isRegionSelectLoading = ref<boolean>(false);

  organizationId.value = route?.query.organizationId as string;

  /**
   * 构建registerTable
   */
  const [registerTable, { reload, getForm }] = useTable({
    title: '',
    api: sensorPage,
    // fetchSetting: {
    //   sizeField: '100000',
    // },
    pagination: true,
    columns: sensorTableColumns,
    formConfig: sensorSearchForm,
    searchInfo: {
      organizationId: route?.query.organizationId,
    },
    useSearchForm: true,
    canResize: false,
    showTableSetting: false,
    showIndexColumn: false,
    rowKey: 'id',
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: checkedKeys.value,
      onSelect: onSelect,
      onSelectAll: onSelectAll,
    },
  });

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });

    checkedKeys.value = [];
    deviceIds.value = [];
    getForm().resetFields();

    getEnterpriseList();
    getRegionList();
    getSelectedSensor();

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    record.value = [];

    setModalProps({ loading: false, confirmLoading: false });
  });

  /**
   * 选择事件
   *
   * @param record
   * @param selected
   */
  function onSelect(record, selected) {
    if (selected) {
      deviceIds.value = [...deviceIds.value, record.dtuipDeviceId];
      checkedKeys.value = [...checkedKeys.value, record.id];
    } else {
      deviceIds.value = deviceIds.value.filter((id) => id !== record.id);
      checkedKeys.value = checkedKeys.value.filter((id) => id !== record.id);
    }
  }

  /**
   * 全部选中
   *
   * @param record
   */
  function onSelectAll(selected, selectedRows, changeRows) {
    const changeIds = changeRows.map((item) => item.id);
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, ...changeIds];
    } else {
      checkedKeys.value = checkedKeys.value.filter((id) => {
        return !changeIds.includes(id);
      });
    }
  }

  /**
   * 获取所属区域列表
   */
  async function getRegionList() {
    regionOptions.value = [];
    isRegionSelectLoading.value = true;

    const response = await installRegionPage({
      organizationId: route?.query?.organizationId,
      pageIndex: 1,
      pageSize: 100000,
    });

    regionOptions.value = response?.records?.map((region) => {
      return {
        label: region.regionName,
        value: region.id,
      };
    });

    isRegionSelectLoading.value = false;
  }

  /**
   * 获取所有企业列表
   */
  async function getEnterpriseList() {
    const response = await companyPage({ pageIndex: 1, pageSize: 100000 });

    enterpriseOptions.value = response?.records?.map((company) => {
      return {
        label: company.enterpriseName,
        value: company.id,
      };
    });
  }

  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });

      await associationDeviceAdd({
        planId: route?.params?.id,
        ids: checkedKeys.value,
      });
      notification.success({ message: `执行成功` });
      closeModal();
      emit('success');
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  /**
   * 获取选中的传感器 - 选中已选的传感器
   */
  async function getSelectedSensor() {
    const response = await associationDevicePage({
      pageIndex: 1,
      pageSize: 10000,
      planId: route?.params?.id,
    });

    checkedKeys.value = response.records.map((item) => item.sensorId);
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
      'maintenance_status',
      'maintenance_work_order_type',
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
