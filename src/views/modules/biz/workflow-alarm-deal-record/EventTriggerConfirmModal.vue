<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    @cancel="handleCancel"
    :showOkBtn="false"
    :show-cancel-btn="true"
    :okAuth="okAuth"
    title="事件触发流程处理"
    cancel-text="关闭"
    okType="primary"
    ok-text="全部提交"
    :centered="true"
    @ok="handleSubmitAll"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <div class="h-6 font-bold">当前传感器信息</div>
      <div style="display: flex">
        <div class="cell">
          <span class="mr-2">状态:</span>
          <dict-label
            style="display: inline-block"
            :options="onlineStatusOptions"
            :value="sensorRealInformation.isLine"
          />
        </div>
        <div class="cell ml-4">
          <span class="mr-2">当前值:</span>
          <span>{{
            sensorRealInformation.value
              ? `${sensorRealInformation.value} ${sensorRealInformation.unit}`
              : '--'
          }}</span>
        </div>
      </div>
      <a-divider />
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        :colon="false"
        :rules="rules"
      >
        <a-tabs v-model:active-key="activeKey">
          <a-tab-pane key="0" tab="信息核实">
            <!-- 信息核实 -->
            <a-row style="height: 390px; padding-top: 10px">
              <a-col :span="24">
                <a-form-item
                  label="说明内容"
                  name="stepOneRemark"
                  :rules="[{ required: true, message: '信息核实说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepOneStatus, record.stepOneEnterpriseId)"
                    :rows="4"
                    v-model:value="formState.stepOneRemark"
                    placeholder="请填写信息核实内容..."
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }"
                  label="通知监管方"
                  name="stepOneNoticeFlag"
                >
                  <a-radio-group v-model:value="formState.stepOneNoticeFlag" button-style="solid">
                    <a-radio value="0">否</a-radio>
                    <a-radio value="1">是</a-radio>
                  </a-radio-group>
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

              <a-col span="23">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :submitLoading="isSubmitLoading"
                  :rejectLoading="isRejectLoading"
                  :confirmLoading="isConfirmLoading"
                  :isDisabledCommit="!formState.stepOneRemark"
                  :status="['100', '150', '200']"
                  name="信息核实"
                  :current-step="record.stepOneStatus"
                  :commit-id="record.stepOneEnterpriseId"
                  :confirm-id="record.stepOneAffirmEnterpriseId"
                  :commit-date="record.stepOneSubmitDate"
                  :commit-person="record.stepOneByUser?.nickName"
                  :confirm-date="record.stepOneAffirmDate"
                  :confirm-person="record.stepOneAffirmByUser?.nickName"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="1" tab="查找原因">
            <!-- 查找原因 -->
            <a-row style="height: 390px; padding-top: 10px">
              <a-col :span="24">
                <a-form-item
                  label="说明内容"
                  name="stepTwoRemark"
                  :rules="[{ required: true, message: '查找原因说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepTwoStatus, record.stepTwoEnterpriseId)"
                    :rows="4"
                    v-model:value="formState.stepTwoRemark"
                    placeholder="请填写查找原因内容..."
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }"
                  label="通知监管方"
                  name="stepTwoNoticeFlag"
                >
                  <a-radio-group v-model:value="formState.stepTwoNoticeFlag" button-style="solid">
                    <a-radio value="0">否</a-radio>
                    <a-radio value="1">是</a-radio>
                  </a-radio-group>
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

              <a-col span="23">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :submitLoading="isSubmitLoading"
                  :rejectLoading="isRejectLoading"
                  :confirmLoading="isConfirmLoading"
                  :isDisabledCommit="!formState.stepTwoRemark"
                  :status="['200', '250', '300']"
                  name="查找原因"
                  :current-step="record.stepTwoStatus"
                  :commit-id="record.stepTwoEnterpriseId"
                  :confirm-id="record.stepTwoAffirmEnterpriseId"
                  :commit-date="record.stepTwoSubmitDate"
                  :commit-person="record.stepTwoByUser?.nickName"
                  :confirm-date="record.stepTwoAffirmDate"
                  :confirm-person="record.stepTwoAffirmByUser?.nickName"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="应对措施">
            <!-- 应对措施 -->
            <a-row style="height: 390px; padding-top: 10px">
              <a-col :span="24">
                <a-form-item
                  label="说明内容"
                  name="stepThreeRemark"
                  :rules="[{ required: true, message: '应对措施说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepThreeStatus, record.stepThreeEnterpriseId)"
                    :rows="4"
                    v-model:value="formState.stepThreeRemark"
                    placeholder="请填写应对措施内容..."
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }"
                  label="通知监管方"
                  name="stepThreeNoticeFlag"
                >
                  <a-radio-group v-model:value="formState.stepThreeNoticeFlag" button-style="solid">
                    <a-radio value="0">否</a-radio>
                    <a-radio value="1">是</a-radio>
                  </a-radio-group>
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

              <a-col span="23">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :submitLoading="isSubmitLoading"
                  :rejectLoading="isRejectLoading"
                  :confirmLoading="isConfirmLoading"
                  :isDisabledCommit="!formState.stepThreeRemark"
                  :status="['300', '350', '400']"
                  name="应对措施"
                  :current-step="record.stepThreeStatus"
                  :commit-id="record.stepThreeEnterpriseId"
                  :confirm-id="record.stepThreeAffirmEnterpriseId"
                  :commit-date="record.stepThreeSubmitDate"
                  :commit-person="record.stepThreeByUser?.nickName"
                  :confirm-date="record.stepThreeAffirmDate"
                  :confirm-person="record.stepThreeAffirmByUser?.nickName"
                />
              </a-col>
            </a-row>
          </a-tab-pane>

          <a-tab-pane key="3" tab="措施落实">
            <!-- 措施落实 -->
            <a-row style="height: 390px; padding-top: 10px">
              <a-col :span="24">
                <a-form-item
                  label="说明内容"
                  name="stepFourRemark"
                  :rules="[{ required: true, message: '措施落实说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepFourStatus, record.stepFourEnterpriseId)"
                    :rows="4"
                    v-model:value="formState.stepFourRemark"
                    placeholder="请填写措施落实内容..."
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }"
                  label="通知监管方"
                  name="stepFourNoticeFlag"
                >
                  <a-radio-group v-model:value="formState.stepFourNoticeFlag" button-style="solid">
                    <a-radio value="0">否</a-radio>
                    <a-radio value="1">是</a-radio>
                  </a-radio-group>
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
                    :disabled="isReadOnly(record.stepFourStatus, record.stepFourEnterpriseId)"
                    @change="handleUploadChange('450', $event)"
                    :api="uploadApi"
                    :value="fileList.fileFour"
                  />
                </a-form-item>
              </a-col>

              <a-col span="23">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :submitLoading="isSubmitLoading"
                  :rejectLoading="isRejectLoading"
                  :confirmLoading="isConfirmLoading"
                  :isDisabledCommit="!formState.stepFourRemark"
                  :status="['400', '450', '500']"
                  name="措施落实"
                  :current-step="record.stepFourStatus"
                  :commit-id="record.stepFourEnterpriseId"
                  :confirm-id="record.stepFourAffirmEnterpriseId"
                  :commit-date="record.stepFourSubmitDate"
                  :commit-person="record.stepFourByUser?.nickName"
                  :confirm-date="record.stepFourAffirmDate"
                  :confirm-person="record.stepFourAffirmByUser?.nickName"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="4" tab="原因分析">
            <!-- 原因分析 -->
            <a-row style="height: 390px; padding-top: 10px">
              <a-col :span="24">
                <a-form-item
                  label="说明内容"
                  name="stepFiveRemark"
                  :rules="[{ required: true, message: '原因分析说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepFiveStatus, record.stepFiveEnterpriseId)"
                    :rows="4"
                    v-model:value="formState.stepFiveRemark"
                    placeholder="请填写原因分析内容..."
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }"
                  label="通知监管方"
                  name="stepFiveNoticeFlag"
                >
                  <a-radio-group v-model:value="formState.stepFiveNoticeFlag" button-style="solid">
                    <a-radio value="0">否</a-radio>
                    <a-radio value="1">是</a-radio>
                  </a-radio-group>
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
                    :disabled="isReadOnly(record.stepFiveStatus, record.stepFiveEnterpriseId)"
                    @change="handleUploadChange('550', $event)"
                    :api="uploadApi"
                    :value="fileList.fileFive"
                  />
                </a-form-item>
              </a-col>

              <a-col span="23">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :submitLoading="isSubmitLoading"
                  :rejectLoading="isRejectLoading"
                  :confirmLoading="isConfirmLoading"
                  :isDisabledCommit="!formState.stepFiveRemark"
                  :status="['500', '550', '600']"
                  name="原因分析"
                  :current-step="record.stepFiveStatus"
                  :commit-id="record.stepFiveEnterpriseId"
                  :confirm-id="record.stepFiveAffirmEnterpriseId"
                  :commit-date="record.stepFiveSubmitDate"
                  :commit-person="record.stepFiveByUser?.nickName"
                  :confirm-date="record.stepFiveAffirmDate"
                  :confirm-person="record.stepFiveAffirmByUser?.nickName"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="5" tab="举一反三">
            <!-- 举一反三 -->
            <a-row style="height: 390px; padding-top: 10px">
              <a-col :span="24">
                <a-form-item
                  label="说明内容"
                  name="stepSixRemark"
                  :rules="[{ required: true, message: '举一反三说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepSixStatus, record.stepSixEnterpriseId)"
                    :rows="4"
                    v-model:value="formState.stepSixRemark"
                    placeholder="请填写举一反三相关内容..."
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }"
                  label="通知监管方"
                  name="stepSixNoticeFlag"
                >
                  <a-radio-group v-model:value="formState.stepSixNoticeFlag" button-style="solid">
                    <a-radio value="0">否</a-radio>
                    <a-radio value="1">是</a-radio>
                  </a-radio-group>
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
                    :disabled="isReadOnly(record.stepSixStatus, record.stepSixEnterpriseId)"
                    @change="handleUploadChange('650', $event)"
                    :api="uploadApi"
                    :value="fileList.fileSix"
                  />
                </a-form-item>
              </a-col>

              <a-col span="23">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :submitLoading="isSubmitLoading"
                  :rejectLoading="isRejectLoading"
                  :confirmLoading="isConfirmLoading"
                  :isDisabledCommit="!formState.stepSixRemark"
                  :status="['600', '650', '700']"
                  name="举一反三"
                  :current-step="record.stepSixStatus"
                  :commit-id="record.stepSixEnterpriseId"
                  :confirm-id="record.stepSixAffirmEnterpriseId"
                  :commit-date="record.stepSixSubmitDate"
                  :commit-person="record.stepSixByUser?.nickName"
                  :confirm-date="record.stepSixAffirmDate"
                  :confirm-person="record.stepSixAffirmByUser?.nickName"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="6" tab="结果确认">
            <a-row style="height: 390px; padding-top: 10px">
              <!-- 结果确认 -->
              <a-col :span="24">
                <a-form-item
                  label="说明内容"
                  name="stepSevenRemark"
                  :rules="[{ required: true, message: '结果确认说明内容不能为空!' }]"
                >
                  <a-textarea
                    :readonly="isReadOnly(record.stepSevenStatus, record.stepSevenEnterpriseId)"
                    :rows="4"
                    v-model:value="formState.stepSevenRemark"
                    placeholder="请填写结果确认内容..."
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24" v-auth="'manage:event:process-result'">
                <a-form-item
                  label="处理结果"
                  name="processResult"
                  :rules="[{ required: true, message: '处理结果不能为空!' }]"
                >
                  <a-radio-group name="processResult" v-model:value="formState.processResult">
                    <a-radio value="1"> 确认正常 </a-radio>
                    <a-radio value="2"> 转维保工单 </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }"
                  label="通知监管方"
                  name="stepSevenNoticeFlag"
                >
                  <a-radio-group v-model:value="formState.stepSevenNoticeFlag" button-style="solid">
                    <a-radio value="0">否</a-radio>
                    <a-radio value="1">是</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="24" :wrapper-col="{ span: 5 }">
                <a-form-item label="附件" name="username">
                  <BasicUpload
                    :maxSize="20"
                    :maxNumber="10"
                    :showPreviewNumber="false"
                    :emptyHidePreview="true"
                    :multiple="false"
                    :disabled="isReadOnly(record.stepSevenStatus, record.stepSevenEnterpriseId)"
                    @change="handleUploadChange('750', $event)"
                    :api="uploadApi"
                    :value="fileList.fileSeven"
                  />
                </a-form-item>
              </a-col>

              <a-col span="23">
                <StepAction
                  @onSubmit="onSubmitHandler"
                  @onReject="onRejectHandler"
                  @onConfirm="onConfirmHandler"
                  :submitLoading="isSubmitLoading"
                  :rejectLoading="isRejectLoading"
                  :confirmLoading="isConfirmLoading"
                  :isDisabledCommit="!formState.stepSevenRemark"
                  :status="['700', '750', '800']"
                  confirm-action-text=""
                  name="结果确认"
                  :current-step="record.stepSevenStatus"
                  :commit-id="record.stepSevenEnterpriseId"
                  :confirm-id="record.stepSevenAffirmEnterpriseId"
                  :commit-date="record.stepSevenSubmitDate"
                  :commit-person="record.stepSevenByUser?.nickName"
                  :confirm-date="record.stepSevenAffirmDate"
                  :confirm-person="record.stepSevenAffirmByUser?.nickName"
                  :showTips="false"
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
    Radio as ARadio,
    RadioGroup as ARadioGroup,
    Divider as ADivider,
  } from 'ant-design-vue';

  import { unref, ref, reactive, computed, onMounted } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicUpload } from '/@/components/Upload';
  import { StepAction } from '/@/components/StepAction';
  import { DictLabel } from '/@/components/DictLabel/index';

  // data
  import { isUpdate, idRef, record, onlineStatusOptions } from './eventTrigger.data';

  import { uploadApi } from '/@/api/sys/upload';
  import { optionsListBatchApi } from '/@/api/sys/dict';

  import { sensorRealtimeData } from '/@/api/manage/sensor';
  import {
    eventTriggerStepOneSubmit,
    eventTriggerStepOneAffirm,
    eventTriggerStepTwoSubmit,
    eventTriggerStepTwoAffirm,
    eventTriggerStepThreeSubmit,
    eventTriggerStepThreeAffirm,
    eventTriggerStepFourSubmit,
    eventTriggerStepFourAffirm,
    eventTriggerStepFiveSubmit,
    eventTriggerStepFiveAffirm,
    eventTriggerStepSixSubmit,
    eventTriggerStepSixAffirm,
    eventTriggerStepSevenSubmit,
    eventTriggerStepSevenAffirm,
    eventTriggerEventDetail,
  } from '/@/api/manage/alarmDealRecord';
  import { useUserStore } from '/@/store/modules/user';

  type SensorRealInformation = {
    sensorName?: string;
    isAlarms?: string;
    isLine?: string;
    value?: string;
    unit?: string;
    updateDate?: string;
  };

  type FileList = {
    processStep?: string;
    attPath?: string; // 文件名
    recordId?: string; // 处置单id
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
    stepOneBizWorkflowAlarmDealRecordAttList: FileList[];
    stepTwoBizWorkflowAlarmDealRecordAttList: FileList[];
    stepThreeBizWorkflowAlarmDealRecordAttList: FileList[];
    stepFourBizWorkflowAlarmDealRecordAttList: FileList[];
    stepFiveBizWorkflowAlarmDealRecordAttList: FileList[];
    stepSixBizWorkflowAlarmDealRecordAttList: FileList[];
    stepSevenBizWorkflowAlarmDealRecordAttList: FileList[];
    stepOneNoticeFlag: string;
    stepTwoNoticeFlag: string;
    stepThreeNoticeFlag: string;
    stepFourNoticeFlag: string;
    stepFiveNoticeFlag: string;
    stepSixNoticeFlag: string;
    stepSevenNoticeFlag: string;
    processResult: string;
  };

  const emit = defineEmits(['success', 'register']);

  const userStore = useUserStore();
  const activeKey = ref('0');

  const organizationId = ref('');

  const isSubmitLoading = ref<boolean>(false);
  const isRejectLoading = ref<boolean>(false);
  const isConfirmLoading = ref<boolean>(false);
  const isCardLoading = ref<boolean>(false);

  const sensorRealInformation = reactive<SensorRealInformation>({});

  const fileList = ref(fileState());

  const { notification } = useMessage();

  const rules = {};

  const okAuth = ['manage:event:process'];

  const formState = reactive<FormState>({
    stepOneRemark: '',
    stepTwoRemark: '',
    stepThreeRemark: '',
    stepFourRemark: '',
    stepFiveRemark: '',
    stepSixRemark: '',
    stepSevenRemark: '',
    stepEightRemark: '',
    stepOneBizWorkflowAlarmDealRecordAttList: [],
    stepTwoBizWorkflowAlarmDealRecordAttList: [],
    stepThreeBizWorkflowAlarmDealRecordAttList: [],
    stepFourBizWorkflowAlarmDealRecordAttList: [],
    stepFiveBizWorkflowAlarmDealRecordAttList: [],
    stepSixBizWorkflowAlarmDealRecordAttList: [],
    stepSevenBizWorkflowAlarmDealRecordAttList: [],
    stepOneNoticeFlag: '0',
    stepTwoNoticeFlag: '0',
    stepThreeNoticeFlag: '0',
    stepFourNoticeFlag: '0',
    stepFiveNoticeFlag: '0',
    stepSixNoticeFlag: '0',
    stepSevenNoticeFlag: '0',
    processResult: '1',
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
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    resetForm();
    isSubmitLoading.value = false;
    isRejectLoading.value = false;
    isConfirmLoading.value = false;
    isCardLoading.value = true;

    setModalProps({ loading: true, confirmLoading: true });
    organizationId.value = userStore.getOrganizationId;

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await eventTriggerEventDetail({
        id: data?.record?.id,
      })) || {}) as any;
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }

    sensorRealtimeData({ id: data?.record?.sensorId })
      .then((res) => {
        console.log('res', res);

        const { sensorName, isAlarms, isLine, value, unit, updateDate } = res;
        sensorRealInformation.sensorName = sensorName;
        sensorRealInformation.isAlarms = isAlarms;
        sensorRealInformation.isLine = isLine;
        sensorRealInformation.value = value;
        sensorRealInformation.unit = unit;
        sensorRealInformation.updateDate = updateDate;
      })
      .catch((err) => {})
      .finally(() => {
        isCardLoading.value = false;
      });

    const {
      stepOneStatus,
      stepTwoStatus,
      stepThreeStatus,
      stepFourStatus,
      stepFiveStatus,
      stepSixStatus,
      stepSevenStatus,
    } = record.value;

    const tempArr = [
      stepOneStatus,
      stepTwoStatus,
      stepThreeStatus,
      stepFourStatus,
      stepFiveStatus,
      stepSixStatus,
      stepSevenStatus,
    ];

    // 根据状态 - 默认选中tab页
    const index = tempArr.findIndex((item) => item === '1000' || item === '50' || item === '150');
    if (index !== -1) {
      activeKey.value = index + '';
    }

    formState.stepOneRemark = record.value.stepOneRemark;
    formState.stepTwoRemark = record.value.stepTwoRemark;
    formState.stepThreeRemark = record.value.stepThreeRemark;
    formState.stepFourRemark = record.value.stepFourRemark;
    formState.stepFiveRemark = record.value.stepFiveRemark;
    formState.stepSixRemark = record.value.stepSixRemark;
    formState.stepSevenRemark = record.value.stepSevenRemark;
    formState.stepEightRemark = record.value.stepEightRemark;

    formState.stepOneNoticeFlag = record.value.stepOneNoticeFlag;
    formState.stepTwoNoticeFlag = record.value.stepTwoNoticeFlag;
    formState.stepThreeNoticeFlag = record.value.stepThreeNoticeFlag;
    formState.stepFourNoticeFlag = record.value.stepFourNoticeFlag;
    formState.stepFiveNoticeFlag = record.value.stepFiveNoticeFlag;
    formState.stepSixNoticeFlag = record.value.stepSixNoticeFlag;
    formState.stepSevenNoticeFlag = record.value.stepSevenNoticeFlag;

    formState.processResult = record.value.processResult;

    fileList.value.fileOne = record.value?.stepOneBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );
    fileList.value.fileTwo = record.value?.stepTwoBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );
    fileList.value.fileThree = record.value?.stepThreeBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );
    fileList.value.fileFour = record.value?.stepFourBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );
    fileList.value.fileFive = record.value?.stepFiveBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );
    fileList.value.fileSix = record.value?.stepSixBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );
    fileList.value.fileSeven = record.value?.stepSevenBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );

    setModalProps({ loading: false, confirmLoading: false });
  });

  function handleCancel() {
    emit('success');
  }

  /**
   * 保存按钮事件
   *
   * 150 - 信息核实，250 - 查找原因，350 - 应对措施
   * 450 - 措施落实，550 - 原因分析，650 - 举一反三
   * 750 - 结果确认
   *
   * @param flag 对应的流程
   * @param list 文件名数组
   */
  function handleUploadChange(flag: string, list: string[]) {
    const filterList = list.filter((item) => item !== undefined || item !== '');

    switch (flag) {
      case '150':
        formState.stepOneBizWorkflowAlarmDealRecordAttList = filterList.map((item) => {
          return {
            attPath: item,
            recordId: idRef.value,
          };
        });

        break;
      case '250':
        formState.stepTwoBizWorkflowAlarmDealRecordAttList = filterList.map((item) => {
          return {
            attPath: item,
            recordId: idRef.value,
          };
        });

        break;
      case '350':
        formState.stepThreeBizWorkflowAlarmDealRecordAttList = filterList.map((item) => {
          return {
            attPath: item,
            recordId: idRef.value,
          };
        });

        break;
      case '450':
        formState.stepFourBizWorkflowAlarmDealRecordAttList = filterList.map((item) => {
          return {
            attPath: item,
            recordId: idRef.value,
          };
        });

        break;
      case '550':
        formState.stepFiveBizWorkflowAlarmDealRecordAttList = filterList.map((item) => {
          return {
            attPath: item,
            recordId: idRef.value,
          };
        });

        break;
      case '650':
        formState.stepSixBizWorkflowAlarmDealRecordAttList = filterList.map((item) => {
          return {
            attPath: item,
            recordId: idRef.value,
          };
        });

        break;
      case '750':
        formState.stepSevenBizWorkflowAlarmDealRecordAttList = filterList.map((item) => {
          return {
            attPath: item,
            recordId: idRef.value,
          };
        });

        break;
    }
  }

  // 文本框、按钮是否只读
  const isReadOnly = computed(() => {
    return (status, commitId) => {
      if (commitId) {
        return status === '50' || status === '100' || commitId !== organizationId.value;
      }

      return status === '50' || status === '100';
    };
  });

  // 最后一步结果确认，只有前面几个步骤都已完成，方可点击
  // const isDisabledConfirm = computed(() => {
  //   return (record) => {
  //     return (
  //       record.stepOneStatus === '100' &&
  //       record.stepTwoStatus === '100' &&
  //       record.stepThreeStatus === '100' &&
  //       record.stepFourStatus === '100' &&
  //       record.stepFiveStatus === '100' &&
  //       record.stepSixStatus === '100'
  //     );
  //   };
  // });

  /**
   * TODO:
   *
   * 提交表单
   */
  async function handleSubmitAll() {
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
    isSubmitLoading.value = true;

    let params = {
      id: idRef.value,
      processStep: status,
      apReceiveFlag: record.value.apReceiveFlag,
      bpReceiveFlag: record.value.bpReceiveFlag,
    };

    switch (status) {
      case '150':
        params['stepOneRemark'] = formState.stepOneRemark;
        params['stepOneNoticeFlag'] = formState.stepOneNoticeFlag;
        params['stepOneStatus'] = '50';
        params['stepOneBizWorkflowAlarmDealRecordAttList'] =
          formState.stepOneBizWorkflowAlarmDealRecordAttList;

        await eventTriggerStepOneSubmit({
          ...params,
        });

        break;
      case '250':
        params['stepTwoRemark'] = formState.stepTwoRemark;
        params['stepTwoNoticeFlag'] = formState.stepTwoNoticeFlag;
        params['stepTwoStatus'] = '50';
        params['stepTwoBizWorkflowAlarmDealRecordAttList'] =
          formState.stepTwoBizWorkflowAlarmDealRecordAttList;

        await eventTriggerStepTwoSubmit({
          ...params,
        });

        break;
      case '350':
        params['stepThreeRemark'] = formState.stepThreeRemark;
        params['stepThreeNoticeFlag'] = formState.stepThreeNoticeFlag;
        params['stepThreeStatus'] = '50';
        params['stepThreeBizWorkflowAlarmDealRecordAttList'] =
          formState.stepThreeBizWorkflowAlarmDealRecordAttList;

        await eventTriggerStepThreeSubmit({
          ...params,
        });

        break;
      case '450':
        params['stepFourRemark'] = formState.stepFourRemark;
        params['stepFourNoticeFlag'] = formState.stepFourNoticeFlag;
        params['stepFourStatus'] = '50';
        params['stepFourBizWorkflowAlarmDealRecordAttList'] =
          formState.stepFourBizWorkflowAlarmDealRecordAttList;

        await eventTriggerStepFourSubmit({
          ...params,
        });

        break;
      case '550':
        params['stepFiveRemark'] = formState.stepFiveRemark;
        params['stepFiveNoticeFlag'] = formState.stepFiveNoticeFlag;
        params['stepFiveStatus'] = '50';
        params['stepFiveBizWorkflowAlarmDealRecordAttList'] =
          formState.stepFiveBizWorkflowAlarmDealRecordAttList;

        await eventTriggerStepFiveSubmit({
          ...params,
        });

        break;
      case '650':
        params['stepSixRemark'] = formState.stepSixRemark;
        params['stepSixNoticeFlag'] = formState.stepSixNoticeFlag;
        params['stepSixStatus'] = '50';
        params['stepSixBizWorkflowAlarmDealRecordAttList'] =
          formState.stepSixBizWorkflowAlarmDealRecordAttList;

        await eventTriggerStepSixSubmit({
          ...params,
        });

        break;
      case '750':
        params['stepSevenRemark'] = formState.stepSevenRemark;
        params['stepSevenNoticeFlag'] = formState.stepSevenNoticeFlag;
        params['stepSevenStatus'] = '50';
        params['stepSevenBizWorkflowAlarmDealRecordAttList'] =
          formState.stepSevenBizWorkflowAlarmDealRecordAttList;
        params['processResult'] = formState.processResult;
        await eventTriggerStepSevenSubmit({
          ...params,
        });

        break;
    }

    // TODO: 这边逻辑可以抽离出去
    record.value = await eventTriggerEventDetail({ id: idRef.value });

    formState.stepOneRemark = record.value.stepOneRemark;
    formState.stepTwoRemark = record.value.stepTwoRemark;
    formState.stepThreeRemark = record.value.stepThreeRemark;
    formState.stepFourRemark = record.value.stepFourRemark;
    formState.stepFiveRemark = record.value.stepFiveRemark;
    formState.stepSixRemark = record.value.stepSixRemark;
    formState.stepSevenRemark = record.value.stepSevenRemark;
    formState.stepEightRemark = record.value.stepEightRemark;

    formState.stepOneNoticeFlag = record.value.stepOneNoticeFlag;
    formState.stepTwoNoticeFlag = record.value.stepTwoNoticeFlag;
    formState.stepThreeNoticeFlag = record.value.stepThreeNoticeFlag;
    formState.stepFourNoticeFlag = record.value.stepFourNoticeFlag;
    formState.stepFiveNoticeFlag = record.value.stepFiveNoticeFlag;
    formState.stepSixNoticeFlag = record.value.stepSixNoticeFlag;
    formState.stepSevenNoticeFlag = record.value.stepSevenNoticeFlag;

    formState.processResult = record.value.processResult;

    notification.success({ message: `信息提交成功!` });

    isSubmitLoading.value = false;
  }

  /**
   * 流程驳回
   */
  async function onRejectHandler(status) {
    isRejectLoading.value = true;

    const params = {
      id: idRef.value,
      processStep: status,
      apReceiveFlag: record.value.apReceiveFlag,
      bpReceiveFlag: record.value.bpReceiveFlag,
    };

    switch (status) {
      case '150':
        params['stepOneStatus'] = '150';

        await eventTriggerStepOneAffirm({
          ...params,
        });

        break;
      case '250':
        params['stepTwoStatus'] = '150';

        await eventTriggerStepTwoAffirm({
          ...params,
        });

        break;
      case '350':
        params['stepThreeStatus'] = '150';

        await eventTriggerStepThreeAffirm({
          ...params,
        });

        break;
      case '450':
        params['stepFourStatus'] = '150';

        await eventTriggerStepFourAffirm({
          ...params,
        });

        break;
      case '550':
        params['stepFiveStatus'] = '150';

        await eventTriggerStepFiveAffirm({
          ...params,
        });

        break;
      case '650':
        params['stepSixStatus'] = '150';

        await eventTriggerStepSixAffirm({
          ...params,
        });

        break;
      case '750':
        params['stepSevenStatus'] = '150';
        params['processResult'] = formState.processResult;

        await eventTriggerStepSevenAffirm({
          ...params,
        });

        break;
    }

    record.value = await eventTriggerEventDetail({ id: idRef.value });

    notification.success({ message: `驳回提交成功!` });

    isRejectLoading.value = false;
  }

  /**
   * 流程确认
   */
  async function onConfirmHandler(status) {
    isConfirmLoading.value = true;

    const params = {
      id: idRef.value,
      processStep: status,
      apReceiveFlag: record.value.apReceiveFlag,
      bpReceiveFlag: record.value.bpReceiveFlag,
    };

    switch (status) {
      case '100':
        params['stepOneStatus'] = '100';

        await eventTriggerStepOneAffirm({
          ...params,
        });

        break;
      case '200':
        params['stepTwoStatus'] = '100';

        await eventTriggerStepTwoAffirm({
          ...params,
        });

        break;
      case '300':
        params['stepThreeStatus'] = '100';

        await eventTriggerStepThreeAffirm({
          ...params,
        });

        break;
      case '400':
        params['stepFourStatus'] = '100';

        await eventTriggerStepFourAffirm({
          ...params,
        });

        break;
      case '500':
        params['stepFiveStatus'] = '100';

        await eventTriggerStepFiveAffirm({
          ...params,
        });

        break;
      case '600':
        params['stepSixStatus'] = '100';

        await eventTriggerStepSixAffirm({
          ...params,
        });

        break;
      case '700':
        params['stepSevenStatus'] = '100';
        params['processResult'] = formState.processResult;

        await eventTriggerStepSevenAffirm({
          ...params,
        });

        break;
    }

    record.value = await eventTriggerEventDetail({ id: idRef.value });

    notification.success({ message: `确认成功!` });

    isConfirmLoading.value = false;
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { online_status } = await optionsListBatchApi(['online_status']);
    onlineStatusOptions.value = online_status || [];
  }

  onMounted(() => {
    initDict();
  });
</script>

<style scoped lang="less">
  .cell {
    height: 32px;
    line-height: 32px;
  }
</style>
