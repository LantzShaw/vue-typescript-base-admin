<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    :showOkBtn="true"
    :show-cancel-btn="true"
    :okAuth="'manage:event-trigger:add'"
    title="事件触发确认"
    okType="primary"
    ok-text="是否通知监管方"
    :centered="true"
    @ok="handleSubmitAll"
  >
    <!-- 通知监管方 -->
    <div style="padding-left: 10px; padding-right: 10px">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
        autocomplete="off"
      >
        <a-tabs v-model:active-key="activeKey">
          <a-tab-pane key="0" tab="信息核实">
            <!-- 信息核实 -->

            <a-row>
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">信息核实</div>
                <a-form-item label="说明内容" name="stepOneRemark">
                  <a-textarea
                    :readonly="isReadOnly(record.stepOneStatus)"
                    :rows="4"
                    v-model:value="formState.stepOneRemark"
                    placeholder="请填写信息核实内容..."
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
                  name="信息核实"
                  :current-step="record.stepOneStatus"
                  :commit-id="record.stepOneEnterpriseId"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="1" tab="查找原因">
            <!-- 查找原因 -->
            <a-row>
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">查找原因</div>
                <a-form-item label="说明内容" name="stepTwoRemark">
                  <a-textarea
                    :readonly="isReadOnly(record.stepTwoStatus)"
                    :rows="4"
                    v-model:value="formState.stepTwoRemark"
                    placeholder="请填写查找原因内容..."
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
                  name="查找原因"
                  :current-step="record.stepTwoStatus"
                  :commit-id="record.stepTwoEnterpriseId"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="应对措施">
            <!-- 应对措施 -->
            <a-row>
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">应对措施</div>
                <a-form-item label="说明内容" name="stepThreeRemark">
                  <a-textarea
                    :readonly="isReadOnly(record.stepThreeStatus)"
                    :rows="4"
                    v-model:value="formState.stepThreeRemark"
                    placeholder="请填写应对措施内容..."
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
                  name="应对措施"
                  :current-step="record.stepThreeStatus"
                  :commit-id="record.stepThreeEnterpriseId"
                />
              </a-col>
            </a-row>
          </a-tab-pane>

          <a-tab-pane key="3" tab="措施落实">
            <!-- 措施落实 -->
            <a-row>
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">措施落实</div>
                <a-form-item label="说明内容" name="stepFourRemark">
                  <a-textarea
                    :readonly="isReadOnly(record.stepFourStatus)"
                    :rows="4"
                    v-model:value="formState.stepFourRemark"
                    placeholder="请填写措施落实内容..."
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
                    :disabled="isReadOnly(record.stepFourStatus)"
                    @change="handleUploadChange('450', $event)"
                    :api="uploadApi"
                    :value="fileList.fileFour"
                  />
                </a-form-item>
              </a-col>
              <a-col span="24">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :status="['400', '450', '500']"
                  name="措施落实"
                  :current-step="record.stepFourStatus"
                  :commit-id="record.stepFourEnterpriseId"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="4" tab="原因分析">
            <!-- 原因分析 -->
            <a-row>
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">原因分析</div>
                <a-form-item label="说明内容" name="stepFiveRemark">
                  <a-textarea
                    :readonly="isReadOnly(record.stepFiveStatus)"
                    :rows="4"
                    v-model:value="formState.stepFiveRemark"
                    placeholder="请填写原因分析内容..."
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
                    :multiple="false"
                    :disabled="isReadOnly(record.stepFiveStatus)"
                    @change="handleUploadChange('550', $event)"
                    :api="uploadApi"
                    :value="fileList.fileFive"
                  />
                </a-form-item>
              </a-col>
              <a-col span="24">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :status="['500', '550', '600']"
                  name="原因分析"
                  :current-step="record.stepFiveStatus"
                  :commit-id="record.stepFiveEnterpriseId"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="5" tab="举一反三">
            <!-- 举一反三 -->
            <a-row>
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">举一反三</div>
                <a-form-item label="说明内容" name="stepSixRemark">
                  <a-textarea
                    :readonly="isReadOnly(record.stepSixStatus)"
                    :rows="4"
                    v-model:value="formState.stepSixRemark"
                    placeholder="请填写举一反三相关内容..."
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
                    :multiple="false"
                    :disabled="isReadOnly(record.stepSixStatus)"
                    @change="handleUploadChange('650', $event)"
                    :api="uploadApi"
                    :value="fileList.fileSix"
                  />
                </a-form-item>
              </a-col>
              <a-col span="24">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :status="['600', '650', '700']"
                  name="举一反三"
                  :current-step="record.stepSixStatus"
                  :commit-id="record.stepSixEnterpriseId"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="6" tab="结果确认">
            <a-row>
              <!-- 结果确认 -->
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">结果确认</div>
                <a-form-item label="说明内容" name="stepSevenRemark">
                  <a-textarea
                    :readonly="isReadOnly(record.stepSevenStatus)"
                    :rows="4"
                    v-model:value="formState.stepSevenRemark"
                    placeholder="请填写结果确认内容..."
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
                    :multiple="false"
                    :disabled="isReadOnly(record.stepSevenStatus)"
                    @change="handleUploadChange('750', $event)"
                    :api="uploadApi"
                    :value="fileList.fileSeven"
                  />
                </a-form-item>
              </a-col>
              <a-col span="24">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :status="['700', '750', '800']"
                  confirm-action-text=""
                  name="结果确认"
                  :current-step="record.stepSevenStatus"
                  :commit-id="record.stepSevenEnterpriseId"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="7" tab="形成报告">
            <a-row>
              <!-- 形成报告 -->
              <a-col :span="24">
                <div class="ml-2 mb-2 text-md text-black font-bold">形成报告</div>
                <a-form-item label="说明内容" name="stepEightRemark">
                  <a-textarea
                    :readonly="isReadOnly(record.stepEightStatus)"
                    :rows="4"
                    v-model:value="formState.stepEightRemark"
                    placeholder="请填写形成报告说明内容..."
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
                    :multiple="false"
                    :disabled="isReadOnly(record.stepEightStatus)"
                    @change="handleUploadChange('850', $event)"
                    :api="uploadApi"
                    :value="fileList.fileEight"
                  />
                </a-form-item>
              </a-col>
              <a-col span="24">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :status="['800', '850', '900']"
                  name="形成报告"
                  :current-step="record.stepEightStatus"
                  :commit-id="record.stepEightEnterpriseId"
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
  import { isUpdate, idRef, record } from './eventTrigger.data';

  import { BasicUpload } from '/@/components/Upload';

  import { StepAction } from '/@/components/StepAction';

  import { uploadApi } from '/@/api/sys/upload';

  import { eventTriggerUpdateState, eventTriggerEventDetail } from '/@/api/manage/eventTrigger';

  type FileList = {
    processStep?: string;
    attPath?: string;
  };

  type FormState = {
    stepOneRemark: string;
    stepTwoRemark: string;
    stepThreeRemark: string;
    stepFourRemark: string;
    stepFiveRemark: string;
    stepSixRemark: string;
    stepSevenRemark: string;
    stepEightRemark: string;
    list: FileList[];
  };

  const emit = defineEmits(['success', 'register']);

  const activeKey = ref('0');
  // const fileOne = ref<string[]>([]);
  // const fileTwo = ref<string[]>([]);
  // const fileThree = ref<string[]>([]);
  // const fileFour = ref<string[]>([]);
  // const fileFive = ref<string[]>([]);
  // const fileSix = ref<string[]>([]);
  // const fileSeven = ref<string[]>([]);
  // const fileEight = ref<string[]>([]);

  const fileList = ref(fileState());

  const { notification } = useMessage();

  const formState = reactive<FormState>({
    stepOneRemark: '',
    stepTwoRemark: '',
    stepThreeRemark: '',
    stepFourRemark: '',
    stepFiveRemark: '',
    stepSixRemark: '',
    stepSevenRemark: '',
    stepEightRemark: '',
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
      fileFour: [],
      fileFive: [],
      fileSix: [],
      fileSeven: [],
      fileEight: [],
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
      record.value = ((await eventTriggerEventDetail({ id: data?.record?.dealRecordId })) ||
        {}) as Recordable;
      idRef.value = data.record.dealRecordId;
    } else {
      idRef.value = '';
    }

    activeKey.value = '0';

    formState.stepOneRemark = record.value.stepOneRemark;
    formState.stepTwoRemark = record.value.stepTwoRemark;
    formState.stepThreeRemark = record.value.stepThreeRemark;
    formState.stepFourRemark = record.value.stepFourRemark;
    formState.stepFiveRemark = record.value.stepFiveRemark;
    formState.stepSixRemark = record.value.stepSixRemark;
    formState.stepSevenRemark = record.value.stepSevenRemark;
    formState.stepEightRemark = record.value.stepEightRemark;

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
          case '450':
            fileList.value.fileFour = item.attPath.split(',');
            break;
          case '550':
            fileList.value.fileSix = item.attPath.split(',');
            break;
          case '650':
            fileList.value.fileSeven = item.attPath.split(',');
            break;
          case '750':
            fileList.value.fileEight = item.attPath.split(',');
            break;
        }
      });
    }

    setModalProps({ loading: false, confirmLoading: false });
  });

  /**
   * 保存按钮事件
   *
   * 150 - 信息核实，250 - 查找原因，350 - 应对措施
   * 450 - 措施落实，550 - 原因分析，650 - 举一反三
   * 750 - 结果确认，850 - 形成报告
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

    // await eventTriggerUpdateState({
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
    console.log('提交', status);

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
      case '450':
        params['stepFourRemark'] = formState.stepFourRemark;
        params['stepFourStatus'] = '150';

        break;
      case '550':
        params['stepFiveRemark'] = formState.stepFiveRemark;
        params['stepFiveStatus'] = '150';

        break;
      case '650':
        params['stepSixRemark'] = formState.stepSixRemark;
        params['stepSixStatus'] = '150';

        break;
      case '750':
        params['stepSevenRemark'] = formState.stepSevenRemark;
        params['stepSevenStatus'] = '150';

        break;
      case '850':
        params['stepEightRemark'] = formState.stepEightRemark;
        params['stepEightStatus'] = '150';

        break;
    }

    await eventTriggerUpdateState({
      id: idRef.value,
      processStep: status,
      ...params,
      list: formState.list,
    });

    record.value = await eventTriggerEventDetail({ id: idRef.value });

    formState.stepOneRemark = record.value.stepOneRemark;
    formState.stepTwoRemark = record.value.stepTwoRemark;
    formState.stepThreeRemark = record.value.stepThreeRemark;
    formState.stepFourRemark = record.value.stepFourRemark;
    formState.stepFiveRemark = record.value.stepFiveRemark;
    formState.stepSixRemark = record.value.stepSixRemark;
    formState.stepSevenRemark = record.value.stepSevenRemark;
    formState.stepEightRemark = record.value.stepEightRemark;
  }

  /**
   * 流程驳回
   */
  async function onRejectHandler(status) {
    console.log('驳回', status, formState);

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
      case '450':
        params['stepFourStatus'] = '100';

        break;
      case '550':
        params['stepFiveStatus'] = '100';

        break;
      case '650':
        params['stepSixStatus'] = '100';

        break;
      case '750':
        params['stepSevenStatus'] = '100';

        break;
      case '850':
        params['stepEightStatus'] = '100';

        break;
    }

    await eventTriggerUpdateState({ id: idRef.value, processStep: status, ...params });

    record.value = await eventTriggerEventDetail({ id: idRef.value });
  }

  /**
   * 流程确认
   */
  async function onConfirmHandler(status) {
    console.log('确认', status, formState);

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
      case '450':
        params['stepFourStatus'] = '200';

        break;
      case '550':
        params['stepFiveStatus'] = '200';

        break;
      case '650':
        params['stepSixStatus'] = '200';

        break;
      case '750':
        params['stepSevenStatus'] = '200';

        break;
      case '850':
        params['stepEightStatus'] = '200';

        break;
    }

    await eventTriggerUpdateState({ id: idRef.value, processStep: status, ...params });

    record.value = await eventTriggerEventDetail({ id: idRef.value });
  }
</script>
