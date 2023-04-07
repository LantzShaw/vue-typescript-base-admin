<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    :showOkBtn="true"
    :show-cancel-btn="true"
    :okAuth="'manage:maintenance-record:process'"
    title="维护记录流程确认"
    okType="primary"
    ok-text="全部提交"
    :centered="true"
    @ok="handleSubmitAll"
  >
    <div style="padding-left: 10px; padding-right: 10px">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
        autocomplete="off"
        :rules="rules"
      >
        <a-tabs v-model:active-key="activeKey">
          <a-tab-pane key="0" tab="工单实施">
            <!-- 工单实施 -->
            <a-row>
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">工单实施</div>

                <a-form-item
                  label="说明内容"
                  name="stepOneRemark"
                  :rules="[{ required: true, message: '工单实施说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepOneStatus)"
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
                    :disabled="isReadOnly(record.stepOneStatus)"
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
                  :status="['100', '150', '200']"
                  name="工单实施"
                  :current-step="record.stepOneStatus"
                  :commit-id="record.stepOneEnterpriseId"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="1" tab="实施成果">
            <!-- 实施成果 -->
            <a-row>
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">实施成果</div>

                <a-form-item
                  label="说明内容"
                  name="stepTwoRemark"
                  :rules="[{ required: true, message: '实施成果说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepTwoStatus)"
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
                    :disabled="isReadOnly(record.stepTwoStatus)"
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
                  :status="['200', '250', '300']"
                  name="实施成果"
                  :current-step="record.stepTwoStatus"
                  :commit-id="record.stepTwoEnterpriseId"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="完工单">
            <!-- 完工单 -->
            <a-row>
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">完工单</div>
                <a-form-item
                  label="说明内容"
                  name="stepThreeRemark"
                  :rules="[{ required: true, message: '完工单说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepThreeStatus)"
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
                    :disabled="isReadOnly(record.stepThreeStatus)"
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
                  :status="['300', '350', '400']"
                  name="完工单"
                  :current-step="record.stepThreeStatus"
                  :commit-id="record.stepThreeEnterpriseId"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </div>
  </BasicModal>
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
  } from 'ant-design-vue';

  import { unref, ref, reactive, computed } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // data
  import { isUpdate, idRef, record } from './equipmentMaintenancePlan.data';

  import { BasicUpload } from '/@/components/Upload';

  import { StepAction } from '/@/components/StepAction';

  import { uploadApi } from '/@/api/sys/upload';

  import {
    equipmentMaintenanceRecordUpdate,
    equipmentMaintenanceRecordForm,
  } from '/@/api/manage/equipmentMaintenance';

  type FileList = {
    processStep?: string;
    attPath?: string;
  };

  type FormState = {
    stepOneRemark: string;
    stepTwoRemark: string;
    stepThreeRemark: string;
    list: FileList[];
  };

  const emit = defineEmits(['success', 'register']);

  const activeKey = ref('0');

  const fileList = ref(fileState());

  const { notification } = useMessage();

  const rules = {};

  const formState = reactive<FormState>({
    stepOneRemark: '',
    stepTwoRemark: '',
    stepThreeRemark: '',
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

  /**
   * 构建Modal
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetForm();

    // resetFields();
    setModalProps({ loading: true, confirmLoading: true });

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await equipmentMaintenanceRecordForm({ id: data?.record?.deviceMaintId })) ||
        {}) as Recordable;
      idRef.value = data.record.deviceMaintId;
    } else {
      idRef.value = '';
    }

    activeKey.value = '0';

    formState.stepOneRemark = record.value.stepOneRemark;
    formState.stepTwoRemark = record.value.stepTwoRemark;
    formState.stepThreeRemark = record.value.stepThreeRemark;

    console.log('-----------list------------', record.value.list);

    if (record.value?.list.length > 0) {
      record.value.list.forEach((item) => {
        switch (item.processStep) {
          case '150':
            fileList.value.fileOne = item.attPath.split(',');

            // TODO: 是否需要考虑item.attPath为空的情况
            // fileOne.value = ''.split(',');
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

    console.log('form state', formState.list, filterList);
  }

  // 文本框、按钮是否只读
  const isReadOnly = computed(() => {
    return (status) => {
      return status === '200' || status === '150';
    };
  });

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
  async function onSubmitHandler(status) {
    let params = {};

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

    await equipmentMaintenanceRecordUpdate({
      id: idRef.value,
      processStep: status,
      ...params,
      list: formState.list,
    });

    record.value = await equipmentMaintenanceRecordForm({ id: idRef.value });

    formState.stepOneRemark = record.value.stepOneRemark;
    formState.stepTwoRemark = record.value.stepTwoRemark;
    formState.stepThreeRemark = record.value.stepThreeRemark;

    notification.success({ message: `信息提交成功!` });
  }

  /**
   * 流程驳回
   */
  async function onRejectHandler(status) {
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

    await equipmentMaintenanceRecordUpdate({ id: idRef.value, processStep: status, ...params });

    record.value = await equipmentMaintenanceRecordForm({ id: idRef.value });

    notification.success({ message: `驳回提交成功!` });
  }

  /**
   * 流程确认
   */
  async function onConfirmHandler(status) {
    const params = {};

    switch (status) {
      case '150':
        params['stepOneStatus'] = '200';
        break;
      case '250':
        params['stepTwoStatus'] = '200';
        break;
      case '350':
        params['stepThreeStatus'] = '200';

        break;
    }

    await equipmentMaintenanceRecordUpdate({ id: idRef.value, processStep: status, ...params });

    record.value = await equipmentMaintenanceRecordForm({ id: idRef.value });

    notification.success({ message: `确认成功!` });
  }
</script>
