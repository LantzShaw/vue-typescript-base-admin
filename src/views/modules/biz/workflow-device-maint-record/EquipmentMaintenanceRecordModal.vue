<template>
  <BasicModal
    width="100%"
    v-bind="$attrs"
    :default-fullscreen="true"
    :can-fullscreen="false"
    @register="registerModal"
    showFooter
    title="新增维护"
    :centered="true"
    @ok="handleSubmit"
    :okAuth="okAuth"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <a-alert
        message="温馨提示: 选择的不同公司的设备，将生成不同的维护工单"
        :show-icon="true"
        type="warning"
        banner
      />
      <a-row>
        <a-col :span="12">
          <BasicTable :clickToRowSelect="false" @register="registerTable">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'dtuipSensorTypeId'">
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
              <template v-else-if="column.key === 'regionName'">
                {{ record?.bizInstallRegion?.regionName }}
              </template>
              <template v-else-if="column.key === 'enterpriseName'">
                [{{ record.bizEnterprise?.enterpriseNo }}]
                {{ record?.bizEnterprise?.enterpriseName }}
              </template>
            </template>
          </BasicTable>
        </a-col>
        <a-col :span="12">
          <div class="pl-4 h-10 leading-10">
            <span class="font-bold">已选中传感器: </span>
            <span class="font-bold text-green-500">{{ selectedTableData.length }}个</span>
          </div>
          <BasicTable
            :actionColumn="{
              width: 100,
              title: '操作',
              dataIndex: 'action',
              fixed: 'right',
            }"
            :pagination="false"
            :data-source="selectedTableData"
            :columns="selectedSensorTableColumns"
            @edit-end="handleEditEnd"
            @edit-cancel="handleEditCancel"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <TableAction
                  stopButtonPropagation
                  :actions="[
                    {
                      label: '移除',
                      onClick: removeCheckedKeys.bind(null, record),
                    },
                  ]"
                />
              </template>
              <template v-else-if="column.key === 'regionName'">
                {{ record?.bizInstallRegion?.regionName }}
              </template>
              <template v-else-if="column.key === 'enterpriseName'">
                [{{ record.bizEnterprise?.enterpriseNo }}]
                {{ record?.bizEnterprise?.enterpriseName }}
              </template>
            </template>
          </BasicTable>
        </a-col>
      </a-row>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, unref } from 'vue';

  import {
    Row as ARow,
    Col as ACol,
    Alert as AAlert,
    Radio as ARadio,
    RadioGroup as ARadioGroup,
  } from 'ant-design-vue';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';

  // 接口
  import {
    equipmentMaintenanceRecordAdd,
    equipmentMaintenanceRecordForm,
  } from '/@/api/manage/equipmentMaintenanceRecord';
  // data
  import {
    isUpdate,
    idRef,
    record,
    sensorTableColumns,
    selectedSensorTableColumns,
    sensorTypeOptions,
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    enterpriseOptions,
    regionOptions,
  } from './equipmentMaintenanceRecord.data';
  import { sensorPage } from '/@/api/manage/sensor';
  import { companyPage } from '/@/api/manage/company';
  import { installRegionPage } from '/@/api/manage/installRegion';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  import { t } from '/@/hooks/web/useI18n';
  import { enterpriseSelect } from '/@/api/manage/enterprise';

  type Key = string | number;
  type Sensor = {
    id?: string;
    sensorName?: string;
  };
  const okAuth = ref(['manage:maintenance-record:add']);
  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();
  const checkedKeys = ref<Key[]>([]);
  const deviceIds = ref<Array<string | number>>([]);

  const selectedTableData = ref<any[]>([]);

  const isRegionSelectLoading = ref<boolean>(false);
  const formState = reactive({
    organizationId: undefined,
    regionId: '1',
  });

  /**
   * 构建registerTable
   */
  const [registerTable, { getForm, clearSelectedRowKeys, setSelectedRowKeys }] = useTable({
    title: '',
    api: sensorPage,
    // fetchSetting: {
    //   sizeField: '100000',
    // },
    // parmas: {
    //   flag: '0',
    // },
    pagination: true,
    columns: sensorTableColumns,
    // formConfig: sensorSearchForm,
    formConfig: {
      baseColProps: { lg: 12, md: 8 },
      labelWidth: 80,
      schemas: [
        {
          label: t('关联企业'),
          field: 'organizationId',
          component: 'ApiSelect',
          defaultValue: '请选择所属单位',
          componentProps: {
            showSearch: true,
            optionFilterProp: 'label',
            api: enterpriseSelect,
            onChange: (e) => {
              formState.organizationId = e;

              getRegionList();
            },
            getPopupContainer: () => document.body,
          },
        },
        // {
        //   label: t('所属单位'),
        //   field: 'organizationId',
        //   component: 'Select',
        //   defaultValue: '请选择所属单位',
        //   componentProps: {
        //     allowClear: false,
        //     placeholder: '请选择所属单位',
        //     options: enterpriseOptions,
        //     onChange: (e) => {
        //       formState.organizationId = e;

        //       getRegionList();
        //     },
        //   },
        // },
        {
          label: t('所属区域'),
          field: 'regionId',
          component: 'Select',
          // defaultValue: formState.regionId,
          // colSlot: 'regionId',
          componentProps: {
            placeholder: '请选择所属区域',
            options: regionOptions,
          },
        },
      ],
    },
    // NOTE: 这里调用setSelectedRowKeys方法后 - table 不更新
    // afterFetch: (v) => {
    //   console.log('v', v);

    //   console.log('dd');
    //   setSelectedRowKeys(checkedKeys.value as string[]);
    //   console.log('dd2');

    //   // setTableData(v);
    //   // reload();

    //   return false;

    //   // reload();
    // },
    // afterFetch: () => setSelectedRowKeys(checkedKeys.value as string[]),
    useSearchForm: true,
    // searchInfo: {
    //   flag: undefined,
    // },
    canResize: false,
    showTableSetting: false,
    showIndexColumn: false,
    rowKey: 'id',
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: checkedKeys,
      onSelect: onSelect,
      onSelectAll: onSelectAll,
    },
  });

  const sensorOptions = ref<Sensor[]>([]);

  const tableData = ref<any>([]);

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });

    // NOTE: 重置查询字段
    await getForm().resetFields();

    tableData.value = [];
    sensorOptions.value = [];

    checkedKeys.value = [];
    deviceIds.value = [];
    selectedTableData.value = [];

    // TODO:
    // clearSelectedRowKeys();

    await getEnterpriseList();

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    record.value = [];

    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await equipmentMaintenanceRecordForm({ id: data?.record?.id })) ||
        {}) as Recordable;
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }

    setModalProps({ loading: false, confirmLoading: false });
  });

  function onSelect(record, selected) {
    if (selected) {
      deviceIds.value = [...deviceIds.value, record.dtuipDeviceId];
      checkedKeys.value = [...checkedKeys.value, record.id];

      selectedTableData.value = [...selectedTableData.value, record];
    } else {
      deviceIds.value = deviceIds.value.filter((id) => id !== record.id);
      checkedKeys.value = checkedKeys.value.filter((id) => id !== record.id);

      selectedTableData.value = selectedTableData.value.filter((item) => item.id !== record.id);
    }

    // setSelectedRowKeys(checkedKeys.value as string[]);
  }

  function onSelectAll(selected, selectedRows, changeRows) {
    const changeIds = changeRows.map((item) => item.id);
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, ...changeIds];

      selectedTableData.value = [...selectedTableData.value, ...changeRows];
    } else {
      checkedKeys.value = checkedKeys.value.filter((id) => {
        return !changeIds.includes(id);
      });

      selectedTableData.value = selectedTableData.value.filter(
        (item) => !changeIds.includes(item.id),
      );
    }
  }

  function removeCheckedKeys(record) {
    deviceIds.value = deviceIds.value.filter((id) => id !== record.id);
    checkedKeys.value = checkedKeys.value.filter((id) => id !== record.id);

    selectedTableData.value = selectedTableData.value.filter((item) => item.id !== record.id);

    // TODO:
    setSelectedRowKeys(checkedKeys.value as string[]);
  }

  /**
   * 获取所属区域列表
   */
  async function getRegionList() {
    regionOptions.value = [];
    isRegionSelectLoading.value = true;

    const response = await installRegionPage({
      organizationId: formState.organizationId,
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
    const bizWorkflowDeviceMaintSensorList = checkedKeys.value.map((key, index) => {
      return {
        sensorId: key,
        organizationId: formState.organizationId,
        deviceId: deviceIds.value[index],
        specification: selectedTableData.value[index]?.specification,
      };
    });

    console.log('bizWorkflowDeviceMaintSensorList', bizWorkflowDeviceMaintSensorList);

    try {
      setModalProps({ loading: true, confirmLoading: true });

      await equipmentMaintenanceRecordAdd({
        organizationId: formState.organizationId,
        bizWorkflowDeviceMaintSensorList,
      });
      notification.success({ message: `执行成功` });
      closeModal();
      emit('success');
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  function handleEditEnd({ record, index, key, value }: Recordable) {
    console.log(record, index, key, value);

    selectedTableData.value[index].specification = value;

    return false;
  }

  function handleEditCancel() {
    console.log('cancel');

    return false;
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
