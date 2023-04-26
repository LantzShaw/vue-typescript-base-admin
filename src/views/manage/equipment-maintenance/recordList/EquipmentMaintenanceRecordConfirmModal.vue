<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    :showOkBtn="false"
    :show-cancel-btn="true"
    :okAuth="okAuth"
    title="维护记录流程处理"
    okType="primary"
    ok-text="全部提交"
    :centered="true"
    @ok="handleSubmitAll"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
        autocomplete="off"
        :rules="rules"
      >
        <a-tabs v-model:active-key="activeKey">
          <a-tab-pane key="0" tab="基础信息">
            <!-- 基础信息 -->
            <a-row :gutter="20" style="height: 350px">
              <a-col :span="12">
                <a-form-item label="公司名称" :label-col="{ span: 5 }" name="apReceiveName">
                  <a-input
                    disabled
                    v-model:value="formState.apReceiveName"
                    placeholder="请输入甲方公司名称"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label-col="{ span: 5 }" label="服务类型" name="taskType">
                  <a-select
                    placeholder="请选择服务类型"
                    :params="['maintenance_task_type']"
                    v-model:value="formState.taskType"
                    :options="maintenanceTaskTypeOptions"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label-col="{ span: 5 }" label="计划时间" name="startDate">
                  <a-date-picker
                    style="width: 100%"
                    v-model:value="formState.startDate"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label-col="{ span: 5 }" label="预计时长" name="duration">
                  <a-input-number
                    placeholder="请输入预计时长"
                    v-model:value="formState.duration"
                    :min="0"
                    addon-after="天"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label-col="{ span: 5 }" name="implementationUser">
                  <template #label>
                    <a-tooltip>
                      <template #title>多个实施人员可使用分号“;”分割</template>
                      <Icon icon="ant-design:question-circle-outlined" />
                    </a-tooltip>

                    <span>实施人员</span>
                  </template>
                  <a-input
                    v-model:value="formState.implementationUser"
                    placeholder="请输入实施人员姓名"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label-col="{ span: 5 }" name="accompanyUser">
                  <template #label>
                    <a-tooltip>
                      <template #title>多个陪同人员可使用分号“;”分割</template>
                      <Icon icon="ant-design:question-circle-outlined" />
                    </a-tooltip>
                    <span>陪同人员</span>
                  </template>
                  <a-input
                    v-model:value="formState.accompanyUser"
                    placeholder="请输入陪同人员姓名"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="联系人" :label-col="{ span: 5 }" name="apReceiveContacts">
                  <a-input v-model:value="formState.apReceiveContacts" placeholder="请输入联系人" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="服务协议" :label-col="{ span: 5 }" name="agreement">
                  <a-input v-model:value="formState.agreement" placeholder="请输入协议内容" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item :label-col="{ span: 2 }" label="备注说明" name="remark">
                  <a-textarea
                    :rows="2"
                    v-model:value="formState.remark"
                    placeholder="请填写备注说明..."
                  />
                </a-form-item>
              </a-col>
              <a-col :offset="2">
                <a-space>
                  <a-button
                    preIcon="ant-design:download-outlined"
                    :loading="isExportLoading"
                    @click="handleReportDownload"
                    >生成当前工作单</a-button
                  >
                  <a-button :loading="isSaveLoading" type="primary" @click="handleSaveInformation"
                    >保存基本信息</a-button
                  >
                </a-space>
              </a-col>
            </a-row>
          </a-tab-pane>

          <a-tab-pane key="1" tab="工单实施">
            <!-- 工单实施 -->
            <a-row style="height: 350px">
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">工单实施</div>

                <a-form-item
                  label="说明内容"
                  name="stepOneRemark"
                  :rules="[{ required: true, message: '工单实施说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepOneStatus, record.stepOneEnterpriseId)"
                    :rows="4"
                    v-model:value="formState.stepOneRemark"
                    placeholder="请填写工单实施内容..."
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="附件" name="list">
                  <BasicUpload
                    :maxSize="20"
                    :maxNumber="10"
                    :showPreviewNumber="false"
                    :emptyHidePreview="true"
                    :multiple="true"
                    :disabled="isReadOnly(record.stepOneStatus, record.stepOneEnterpriseId)"
                    @change="handleUploadChange('150', $event)"
                    :api="uploadApi"
                    :value="fileList.fileOne"
                  />
                </a-form-item>
              </a-col>
              <a-col span="24">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :submitLoading="isSubmitLoading"
                  :rejectLoading="isRejectLoading"
                  :confirmLoading="isConfirmLoading"
                  :isDisabledCommit="!formState.stepOneRemark"
                  :status="['100', '150', '200']"
                  name="工单实施"
                  :current-step="record.stepOneStatus"
                  :commit-id="record.stepOneEnterpriseId"
                  :commit-date="record.stepOneSubmitDate"
                  :commit-person="record.stepOneBy"
                  :confirm-date="record.stepOneAffirmDate"
                  :confirm-person="record.stepOneAffirmBy"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="实施成果">
            <!-- 实施成果 -->
            <a-row style="height: 350px">
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">实施成果</div>
                <a-form-item
                  label="说明内容"
                  name="stepTwoRemark"
                  :rules="[{ required: true, message: '实施成果说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepTwoStatus, record.stepTwoEnterpriseId)"
                    :rows="4"
                    v-model:value="formState.stepTwoRemark"
                    placeholder="请填写实施成果内容..."
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="附件" name="username">
                  <BasicUpload
                    :maxSize="20"
                    :maxNumber="10"
                    :showPreviewNumber="false"
                    :emptyHidePreview="true"
                    :multiple="true"
                    :disabled="isReadOnly(record.stepTwoStatus, record.stepTwoEnterpriseId)"
                    @change="handleUploadChange('250', $event)"
                    :api="uploadApi"
                    :value="fileList.fileTwo"
                  />
                </a-form-item>
              </a-col>
              <a-col span="24">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :submitLoading="isSubmitLoading"
                  :rejectLoading="isRejectLoading"
                  :confirmLoading="isConfirmLoading"
                  :isDisabledCommit="!formState.stepTwoRemark"
                  :status="['200', '250', '300']"
                  name="实施成果"
                  :current-step="record.stepTwoStatus"
                  :commit-id="record.stepTwoEnterpriseId"
                  :commit-date="record.stepTwoSubmitDate"
                  :commit-person="record.stepTwoBy"
                  :confirm-date="record.stepTwoAffirmDate"
                  :confirm-person="record.stepTwoAffirmBy"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="3" tab="完工单">
            <!-- 完工单 -->
            <a-row style="height: 350px">
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">完工单</div>
                <a-form-item
                  label="说明内容"
                  name="stepThreeRemark"
                  :rules="[{ required: true, message: '完工单说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepThreeStatus, record.stepThreeEnterpriseId)"
                    :rows="4"
                    v-model:value="formState.stepThreeRemark"
                    placeholder="请填写完工单内容..."
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="附件" name="username">
                  <BasicUpload
                    :maxSize="20"
                    :maxNumber="10"
                    :showPreviewNumber="false"
                    :emptyHidePreview="true"
                    :multiple="true"
                    :disabled="isReadOnly(record.stepThreeStatus, record.stepThreeEnterpriseId)"
                    @change="handleUploadChange('350', $event)"
                    :api="uploadApi"
                    :value="fileList.fileThree"
                  />
                </a-form-item>
              </a-col>
              <a-col span="24">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :submitLoading="isSubmitLoading"
                  :rejectLoading="isRejectLoading"
                  :confirmLoading="isConfirmLoading"
                  :isDisabledCommit="!formState.stepThreeRemark"
                  :isDisabledConfirm="!isDisabledConfirm(record)"
                  :status="['300', '350', '400']"
                  name="完工单"
                  :current-step="record.stepThreeStatus"
                  :commit-id="record.stepThreeEnterpriseId"
                  :commit-date="record.stepThreeSubmitDate"
                  :commit-person="record.stepThreeBy"
                  :confirm-date="record.stepThreeAffirmDate"
                  :confirm-person="record.stepThreeAffirmBy"
                  :show-tips="true"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </div>
  </BasicModal>

  <ReportModal v-if="idRef" :id="idRef" @register="registerReportModal" @success="handleSuccess" />
</template>
<script lang="ts" setup>
  import {
    Row as ARow,
    Col as ACol,
    Form as AForm,
    FormItem as AFormItem,
    Textarea as ATextarea,
    Tabs as ATabs,
    TabPane as ATabPane,
    DatePicker as ADatePicker,
    InputNumber as AInputNumber,
    Space as ASpace,
    Select as ASelect,
    Tooltip as ATooltip,
  } from 'ant-design-vue';

  import { unref, ref, reactive, computed, onMounted } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import Icon from '/@/components/Icon/Icon.vue';
  import ReportModal from './components/ReportModal.vue';

  // data
  import {
    isUpdate,
    idRef,
    record,
    maintenanceTaskTypeOptions,
  } from './equipmentMaintenanceRecord.data';

  import { BasicUpload } from '/@/components/Upload';

  import { StepAction } from '/@/components/StepAction';

  import { uploadApi } from '/@/api/sys/upload';

  import {
    equipmentMaintenanceRecordForm,
    equipmentMaintenanceRecordUpdateState,
  } from '/@/api/manage/equipmentMaintenanceRecord';
  import { getOrganizationId } from '/@/utils/auth';
  import { optionsListBatchApi } from '/@/api/sys/dict';

  type FileList = {
    processStep?: string;
    attPath?: string;
  };

  type FormState = {
    stepOneRemark: string;
    stepTwoRemark: string;
    stepThreeRemark: string;
    remark?: string;
    taskType?: string;
    implementationUser?: string;
    accompanyUser?: string;
    startDate?: string;
    duration?: string;
    apReceiveContacts?: string;
    agreement?: string;
    apReceiveName?: string;
    list: FileList[];
  };
  const okAuth = ref(['manage:maintenance-record:process']);
  const emit = defineEmits(['success', 'register']);

  const activeKey = ref('0');
  const reportRef = ref(null);

  const isSubmitLoading = ref<boolean>(false);
  const isRejectLoading = ref<boolean>(false);
  const isConfirmLoading = ref<boolean>(false);
  const isSaveLoading = ref<boolean>(false);
  const isExportLoading = ref<boolean>(false);

  const fileList = ref(fileState());

  const { notification } = useMessage();

  const organizationId = getOrganizationId() as string;

  const rules = {};

  const formState = reactive<FormState>({
    stepOneRemark: '',
    stepTwoRemark: '',
    stepThreeRemark: '',
    implementationUser: '',
    accompanyUser: '',
    startDate: '',
    duration: '0',
    taskType: undefined,
    remark: '',
    apReceiveContacts: '',
    agreement: '',
    apReceiveName: '',
    list: [],
  });

  /**
   * 初始化文件列表数据
   */
  function resetForm() {
    fileList.value = fileState();
  }

  function fileState() {
    return {
      fileOne: [],
      fileTwo: [],
      fileThree: [],
    };
  }

  // 查看设备
  const [registerReportModal, { openModal }] = useModal();

  /**
   * 构建Modal
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    resetForm();

    // resetFields();
    setModalProps({ loading: true, confirmLoading: true });

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await equipmentMaintenanceRecordForm({ id: data?.record?.id })) ||
        {}) as Recordable;
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }

    const { stepOneStatus, stepTwoStatus, stepThreeStatus } = record.value;

    const tempArr = [stepOneStatus, stepTwoStatus, stepThreeStatus];

    const index = tempArr.findIndex(
      (item) => item === undefined || item === '100' || item === '150',
    );

    if (index !== -1) {
      activeKey.value = `${index + 1}`;
    }

    formState.stepOneRemark = record.value.stepOneRemark;
    formState.stepTwoRemark = record.value.stepTwoRemark;
    formState.stepThreeRemark = record.value.stepThreeRemark;
    formState.taskType = record.value.taskType;
    formState.accompanyUser = record.value.accompanyUser;
    formState.duration = record.value.duration;
    formState.remark = record.value.remark;
    formState.startDate = record.value.startDate;
    formState.implementationUser = record.value.implementationUser;

    formState.apReceiveContacts = record.value.apReceiveContacts;
    formState.agreement = record.value.agreement;
    // formState.apReceiveName = record.value.apReceiveName;
    formState.apReceiveName = data.record.orgName;

    console.log('-----------list------------', record.value.list);

    if (record.value?.list.length > 0) {
      record.value.list.forEach((item) => {
        switch (item.processStep) {
          case '150':
            // TODO: 是否需要考虑item.attPath为空的情况
            // fileOne.value = ''.split(',');
            fileList.value.fileOne = item.attPath.split(',');
            break;
          case '250':
            fileList.value.fileTwo = item.attPath.split(',');
            break;
          case '350':
            fileList.value.fileThree = item.attPath.split(',');
            break;
        }
      });
    }

    setModalProps({ loading: false, confirmLoading: false });
  });

  /**
   * 执行成功
   */
  function handleSuccess() {
    // reload();
  }

  /**
   * 保存按钮事件
   *
   * 150 - 工单实施，250 - 实施成果，350 - 完工单
   *
   * @param flag 对应的流程
   * @param list 文件名数组
   */
  function handleUploadChange(flag: string, list: string[]) {
    const filterList = list.filter((item) => item !== undefined || item !== '');

    formState.list.push({
      processStep: flag,
      attPath: filterList.toString(),
    });
  }

  // 文本框、按钮是否只读
  const isReadOnly = computed(() => {
    return (status, commitId) => {
      if (commitId) {
        return status === '150' || status === '200' || commitId !== organizationId;
      }

      return status === '200' || status === '150';
    };
  });

  // 最后一步结果确认，只有前面几个步骤都已完成，方可点击
  const isDisabledConfirm = computed(() => {
    return (record) => {
      return record.stepOneStatus === '200' && record.stepTwoStatus === '200';
    };
  });

  function handleReportDownload() {
    console.log('reportRef.value', reportRef.value);

    // reportRef.value.getDataSource();
    // reportRef.value.exportAsPDF();

    openModal(true, {
      // record,
      // isUpdate: true,
    });
  }

  async function handleSaveInformation() {
    isSaveLoading.value = true;
    console.log(formState);

    await equipmentMaintenanceRecordUpdateState({
      id: idRef.value,
      remark: formState.remark,
      taskType: formState.taskType,
      implementationUser: formState.implementationUser,
      accompanyUser: formState.accompanyUser,
      startDate: formState.startDate,
      duration: formState.duration,
      apReceiveContacts: formState.apReceiveContacts,
      agreement: formState.agreement,
      apReceiveName: formState.apReceiveName,
      // list: formState.list,
      apReceiveFlag: record.value.apReceiveFlag,
      bpReceiveFlag: record.value.bpReceiveFlag,
    });

    notification.success({ message: `保存成功!` });

    isSaveLoading.value = false;
  }

  /**
   * 提交表单
   */
  async function handleSubmitAll() {
    console.log(formState);

    console.log('handleSubmitAll', formState);

    // await equipmentMaintenanceRecordUpdate({
    //   id: idRef.value,
    //   stepOneStatus: '150',
    //   stepTwoStatus: '150',
    //   stepThreeStatus: '150',
    //   stepFourStatus: '150',
    //   stepFiveStatus: '150',
    //   stepSixStatus: '150',
    //   stepSevenStatus: '150',
    //   stepEightStatus: '150',
    //   ...formState,
    // });

    // record.value = await eventTriggerEventDetail({ id: idRef.value });
  }

  /**
   * 流程提交
   */
  async function onSubmitHandler(status: string) {
    isSubmitLoading.value = true;

    let params = {
      id: idRef.value,
      processStep: status,
      list: formState.list,
      apReceiveFlag: record.value.apReceiveFlag,
      bpReceiveFlag: record.value.bpReceiveFlag,
    };

    switch (status) {
      case '150':
        params['stepOneRemark'] = formState.stepOneRemark;
        params['stepOneStatus'] = '150';
        break;
      case '250':
        params['stepTwoRemark'] = formState.stepTwoRemark;
        params['stepTwoStatus'] = '150';
        break;
      case '350':
        params['stepThreeRemark'] = formState.stepThreeRemark;
        params['stepThreeStatus'] = '150';
        break;
    }

    await equipmentMaintenanceRecordUpdateState({
      ...params,
    });

    record.value = await equipmentMaintenanceRecordForm({ id: idRef.value });

    formState.stepOneRemark = record.value.stepOneRemark;
    formState.stepTwoRemark = record.value.stepTwoRemark;
    formState.stepThreeRemark = record.value.stepThreeRemark;

    emit('success');

    notification.success({ message: `信息提交成功!` });

    isSubmitLoading.value = false;
  }

  /**
   * 流程驳回
   */
  async function onRejectHandler(status: string) {
    isRejectLoading.value = true;
    const params = {};

    switch (status) {
      case '150':
        params['stepOneStatus'] = '100';
        break;
      case '250':
        params['stepTwoStatus'] = '100';
        break;
      case '350':
        params['stepThreeStatus'] = '100';
        break;
    }

    await equipmentMaintenanceRecordUpdateState({
      id: idRef.value,
      processStep: status,
      ...params,
      apReceiveFlag: record.value.apReceiveFlag,
      bpReceiveFlag: record.value.bpReceiveFlag,
    });

    emit('success');

    record.value = await equipmentMaintenanceRecordForm({ id: idRef.value });

    notification.success({ message: `驳回提交成功!` });

    isRejectLoading.value = false;
  }

  /**
   * 流程确认
   */
  async function onConfirmHandler(status: string) {
    isConfirmLoading.value = true;

    const params = {
      id: idRef.value,
      processStep: status,
      apReceiveFlag: record.value.apReceiveFlag,
      bpReceiveFlag: record.value.bpReceiveFlag,
    };

    switch (status) {
      case '100':
        params['stepOneStatus'] = '200';

        break;
      case '200':
        params['stepTwoStatus'] = '200';

        break;
      case '300':
        params['stepThreeStatus'] = '200';

        break;
    }

    await equipmentMaintenanceRecordUpdateState({
      ...params,
    });

    emit('success');

    record.value = await equipmentMaintenanceRecordForm({ id: idRef.value });

    notification.success({ message: `确认成功!` });

    isConfirmLoading.value = false;
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { maintenance_task_type } = await optionsListBatchApi(['maintenance_task_type']);
    maintenanceTaskTypeOptions.value = maintenance_task_type || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
