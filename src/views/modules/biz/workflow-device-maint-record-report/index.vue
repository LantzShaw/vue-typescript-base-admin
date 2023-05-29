<template>
  <PageWrapper dense title="" contentFullHeight :contentBackground="false" @back="goBack">
    <div class="m-2">
      <div
        class="bg-light-50 pt-6 pr-4 text-right flex pl-4"
        style="justify-content: space-between"
      >
        <div>
          <a-button
            v-auth="'manage:maintenance-record:report-show-back'"
            preIcon="ant-design:left"
            @click="goBack"
            >返回</a-button
          >
        </div>

        <div>
          <a-space>
            <a-button
              :loading="isExportLoading"
              v-auth="'manage:maintenance-record:report'"
              preIcon="ant-design:download-outlined"
              @click="handleExport"
            >
              导出工作记录表单
            </a-button>
            <a-button
              v-auth="'manage:maintenance-record:report'"
              preIcon="ant-design:eye-outlined"
              @click="handleFeedbackReportPreview"
            >
              工作反馈报告
            </a-button>
          </a-space>
        </div>
      </div>
      <div class="h-20 leading-20 text-center font-bold text-2xl bg-light-100">
        {{ enterpriseName ?? '--' }}工作记录表单
      </div>
      <BasicTable
        @register="registerTable"
        @edit-end="handleEditEnd"
        @edit-cancel="handleEditCancel"
        :on-edit-cancel="false"
      >
        <!-- 按钮工具栏 -->
        <template #toolbar>
          <a-form layout="inline" :model="formState" @finish="handleFinish">
            <a-row :gutter="[12, 12]">
              <a-col :span="8">
                <a-form-item label="开始日期" name="startDate">
                  <a-date-picker
                    :disabled="isReadonly"
                    style="width: 100%"
                    v-model:value="formState.startDate"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="完工日期" name="endDate">
                  <a-date-picker
                    :disabled="isReadonly"
                    style="width: 100%"
                    v-model:value="formState.endDate"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="环境温度">
                  <a-input
                    :disabled="isReadonly"
                    placeholder="请输入环境温度"
                    v-model:value="formState.temperature"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="环境湿度">
                  <a-input
                    :disabled="isReadonly"
                    placeholder="请输入环境湿度"
                    v-model:value="formState.humidity"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8" v-auth="'manage:maintenance-record:report-edit'">
                <a-form-item>
                  <a-button html-type="submit" type="primary">保存</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
        <!-- 表格内容 -->
        <template #bodyCell="{ column, record }">
          <!-- <template v-if="column.key === 'sensorName'">
            <a @click="handleEdit(record)" :title="record.sensorName">
              {{ record.sensorName }}
            </a>
          </template> -->
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
            <TableAction stopButtonPropagation :actions="createActions(record, column)" />
          </template>
        </template>
      </BasicTable>
    </div>

    <FeedbackReportModal @register="registerFeedbackReportModal" @success="handleSuccess" />
    <!-- <SensorModal @register="registerModal" @success="handleSuccess" /> -->
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, ref, unref, reactive, computed } from 'vue';
  import {
    Space as ASpace,
    Form as AForm,
    FormItem as AFormItem,
    DatePicker as ADatePicker,
    Row as ARow,
    Col as ACol,
  } from 'ant-design-vue';
  import { useRouter } from 'vue-router';

  import { cloneDeep } from 'lodash-es';

  // hooks
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';

  // 组件
  import { PageWrapper } from '/@/components/Page';
  import {
    BasicTable,
    TableAction,
    useTable,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';

  import FeedbackReportModal from './FeedbackReportModal.vue';

  // 接口
  import { optionsListBatchApi } from '/@/api/sys/dict';
  import {
    workflowDeviceMaintSensorPage,
    workflowDeviceMaintSensorUpdate,
    workflowDeviceMaintSensorExport,
  } from '/@/api/biz/workflowDeviceMaintSensor';

  import { workflowDeviceMaintRecordUpdate } from '/@/api/biz/workflowDeviceMaintRecord';

  import { equipmentMaintenanceRecordForm } from '/@/api/manage/equipmentMaintenanceRecord';

  // data
  import {
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    sensorTypeOptions,
    acoustoOpticAlarmStatusOptions,
    appearanceControllerStatusOptions,
    registrationErrorStatusOptions,
    searchForm,
    tableColumns,
  } from './workflowDeviceMaintRecordReport.data';
  import { downloadByData } from '/@/utils/file/download';

  interface FormState {
    user?: string;
    password?: string;
    startDate?: string;
    endDate?: string;
    temperature?: string;
    humidity?: string;
  }

  const go = useGo();
  const { closeCurrent } = useTabs();

  const { currentRoute } = useRouter();

  const { notification } = useMessage();

  const isExportLoading = ref<boolean>(false);
  const enterpriseName = ref<string>('');
  const recordId = ref<string>(unref(currentRoute).params?.id as string);

  const formState = reactive<FormState>({});
  const currentEditKeyRef = ref('');

  const { createMessage: msg } = useMessage();
  const { hasPermission } = usePermission();

  const isReadonly = computed(() => {
    return !hasPermission('manage:maintenance-record:report-edit');
  });

  /**
   * 构建registerModal
   */
  const [registerFeedbackReportModal, { openModal: openFeedbackReportModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: workflowDeviceMaintSensorPage,
    beforeFetch: (params) => {
      params.recordId = recordId.value;
      return params;
    },
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: false,
    canResize: false,
    showTableSetting: false,
    showIndexColumn: true,
    actionColumn: {
      ifShow: true,
      width: 200,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'manage:maintenance-record:report-edit',
    },
  });

  /**
   * 导出
   */
  function handleExport() {
    isExportLoading.value = true;

    workflowDeviceMaintSensorExport({
      id: recordId.value,
      str: `${enterpriseName.value}工作记录表单`,
    })
      .then((response) => {
        downloadByData(response, `${enterpriseName.value}工作记录表单.xlsx`);
      })
      .finally(() => {
        isExportLoading.value = false;
      });
  }

  async function handleFinish() {
    await workflowDeviceMaintRecordUpdate({
      id: recordId.value,
      sheetStartDate: formState.startDate,
      sheetEndDate: formState.endDate,
      sheetTempValue: formState.temperature,
      sheetHumidityValue: formState.humidity,
    });

    await getEquipmentMaintenanceRecord();

    notification.success({ message: `执行成功` });
  }

  async function handleEditEnd({ record, index, key, value }: Recordable) {
    console.log(record, index, key, value);

    await workflowDeviceMaintSensorUpdate({ id: record.id, [`${key}`]: value });

    reload();

    return false;
  }

  function handleEditCancel() {
    console.log('cancel');
  }

  /**
   * 编辑
   */
  // function handleEdit(record: Recordable) {
  //   openModal(true, {
  //     record,
  //     isUpdate: true,
  //   });
  // }

  /**
   * 工作反馈报告 - 预览
   */
  function handleFeedbackReportPreview() {
    openFeedbackReportModal(true, {});
  }

  function handleEdit(record: EditRecordRow) {
    currentEditKeyRef.value = record.key;
    record.onEdit?.(true);
  }

  function handleCancel(record: EditRecordRow) {
    currentEditKeyRef.value = '';
    record.onEdit?.(false, false);
  }

  async function handleSave(record: EditRecordRow) {
    // 校验
    msg.loading({ content: '正在保存...', duration: 0, key: 'saving' });
    const valid = await record.onValid?.();
    if (valid) {
      try {
        const data = cloneDeep(record.editValueRefs);
        console.log(data);
        //TODO 此处将数据提交给服务器保存
        // ...
        await workflowDeviceMaintSensorUpdate({ id: record.id, ...data });

        // 保存之后提交编辑状态
        const pass = await record.onEdit?.(false, true);
        if (pass) {
          currentEditKeyRef.value = '';
        }
        msg.success({ content: '数据已保存', key: 'saving' });
      } catch (error) {
        msg.error({ content: '保存失败', key: 'saving' });
      }
    } else {
      msg.error({ content: '请填写正确的数据', key: 'saving' });
    }
  }

  function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: '编辑',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          onClick: handleEdit.bind(null, record),
        },
      ];
    }
    return [
      {
        label: '保存',
        onClick: handleSave.bind(null, record, column),
      },
      {
        label: '取消',
        popConfirm: {
          title: '是否取消编辑',
          confirm: handleCancel.bind(null, record, column),
        },
      },
    ];
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    reload();
  }

  /**
   * 返回报表总览页面
   */
  function goBack() {
    closeCurrent();

    go('/biz/maint-management/record');
  }

  async function getEquipmentMaintenanceRecord() {
    const response = await equipmentMaintenanceRecordForm({ id: recordId.value });

    enterpriseName.value = response?.bizEnterprise?.enterpriseName;

    formState.startDate = response?.sheetStartDate;
    formState.endDate = response?.sheetEndDate;
    formState.temperature = response?.sheetTempValue;
    formState.humidity = response?.sheetHumidityValue;
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const {
      alarm_status,
      delete_status,
      online_status,
      acousto_optic_alarm_status,
      appearance_controller_status,
      registration_error_status,
    } = await optionsListBatchApi([
      'alarm_status',
      'delete_status',
      'online_status',
      'sensor_type',
      'acousto_optic_alarm_status',
      'appearance_controller_status',
      'registration_error_status',
    ]);
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];

    appearanceControllerStatusOptions.value = appearance_controller_status;
    acoustoOpticAlarmStatusOptions.value = acousto_optic_alarm_status;
    registrationErrorStatusOptions.value = registration_error_status;
  }

  onMounted(() => {
    initDict();

    getEquipmentMaintenanceRecord();
  });
</script>

<style lang="less" scoped>
  // .dict-label {
  //   :deep(.ant-tag) {
  //     margin: 4px;
  //   }
  // }
</style>
