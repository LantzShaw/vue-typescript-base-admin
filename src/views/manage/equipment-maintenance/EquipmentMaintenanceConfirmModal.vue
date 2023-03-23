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
    :ok-text="'通知监管方'"
    :centered="true"
    @ok="handleSubmit"
  >
    <div style="padding-left: 10px; padding-right: 10px">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
        autocomplete="off"
      >
        <a-row>
          <!-- 信息核实 -->
          <a-col :span="24">
            <div class="ml-2 mb-2 text-md text-black font-bold">信息核实</div>
            <a-form-item label="说明内容" name="stepOneRemark">
              <a-textarea :rows="4" placeholder="请填写信息核实内容..." />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" name="list">
              <BasicUpload />
            </a-form-item>
          </a-col>
          <a-col span="24">
            <StepAction
              @onSubmit="onSubmitHandler"
              @onReject="onRejectHandler"
              @onConfirm="onConfirmHandler"
              :status="['100', '150']"
              name="信息核实"
              :current-step="processStep"
            />
          </a-col>

          <!-- 查找原因 -->
          <a-col :span="24">
            <div class="ml-2 mb-2 text-md text-black font-bold">查找原因</div>
            <a-form-item label="说明内容" name="stepTwoRemark">
              <a-textarea :rows="4" placeholder="请填写查找原因内容..." />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" name="username">
              <BasicUpload />
            </a-form-item>
          </a-col>
          <a-col span="24">
            <StepAction
              @onSubmit="onSubmitHandler"
              @onReject="onRejectHandler"
              @onConfirm="onConfirmHandler"
              :status="['200', '250', '300']"
              name="查找原因"
              :current-step="processStep"
            />
          </a-col>

          <!-- 应对措施 -->
          <a-col :span="24">
            <div class="ml-2 mb-2 text-md text-black font-bold">应对措施</div>
            <a-form-item label="说明内容" name="stepThreeRemark">
              <a-textarea :rows="4" placeholder="请填写应对措施内容..." />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" name="username">
              <BasicUpload />
            </a-form-item>
          </a-col>
          <a-col span="24">
            <StepAction
              @onSubmit="onSubmitHandler"
              @onReject="onRejectHandler"
              @onConfirm="onConfirmHandler"
              :status="['300', '350', '400']"
              name="应对措施"
              :current-step="processStep"
            />
          </a-col>

          <!-- 措施落实 -->
          <a-col :span="24">
            <div class="ml-2 mb-2 text-md text-black font-bold">措施落实</div>
            <a-form-item label="说明内容" name="stepFourRemark">
              <a-textarea :rows="4" placeholder="请填写措施落实内容..." />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" name="username">
              <BasicUpload />
            </a-form-item>
          </a-col>
          <a-col span="24">
            <StepAction
              @onSubmit="onSubmitHandler"
              @onReject="onRejectHandler"
              @onConfirm="onConfirmHandler"
              :status="['400', '450', '500']"
              name="措施落实"
              :current-step="processStep"
            />
          </a-col>

          <!-- 原因分析 -->
          <a-col :span="24">
            <div class="ml-2 mb-2 text-md text-black font-bold">原因分析</div>
            <a-form-item label="说明内容" name="stepFiveRemark">
              <a-textarea :rows="4" placeholder="请填写原因分析内容..." />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" name="username">
              <BasicUpload />
            </a-form-item>
          </a-col>
          <a-col span="24">
            <StepAction
              @onSubmit="onSubmitHandler"
              @onReject="onRejectHandler"
              @onConfirm="onConfirmHandler"
              :status="['500', '550', '600']"
              name="原因分析"
              :current-step="processStep"
            />
          </a-col>

          <!-- 举一反三 -->
          <a-col :span="24">
            <div class="ml-2 mb-2 text-md text-black font-bold">举一反三</div>
            <a-form-item label="说明内容" name="stepSixRemark">
              <a-textarea :rows="4" placeholder="请填写举一反三相关内容..." />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" name="username">
              <BasicUpload />
            </a-form-item>
          </a-col>
          <a-col span="24">
            <StepAction :status="['600', '650']" name="举一反三" :current-step="processStep" />
          </a-col>

          <!-- 结果确认 -->
          <a-col :span="24">
            <div class="ml-2 mb-2 text-md text-black font-bold">结果确认</div>
            <a-form-item label="说明内容" name="stepSevenRemark">
              <a-textarea :rows="4" placeholder="请填写结果确认内容..." />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" name="username">
              <BasicUpload />
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
              :current-step="processStep"
            />
          </a-col>

          <!-- 形成报告 -->
          <a-col :span="24">
            <div class="ml-2 mb-2 text-md text-black font-bold">形成报告</div>
            <a-form-item label="说明内容" name="stepEightRemark">
              <a-textarea :rows="4" placeholder="请填写形成报告说明内容..." />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" name="username">
              <BasicUpload />
            </a-form-item>
          </a-col>
          <a-col span="24">
            <StepAction
              @onSubmit="onSubmitHandler"
              @onReject="onRejectHandler"
              @onConfirm="onConfirmHandler"
              :status="['800', '850', '900']"
              confirm-action-text=""
              name="形成报告"
              :current-step="processStep"
            />
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  // 获取当前账号的role
  // 该条数据的status 以及最后更改该条记录状态的role

  // const showOkBtn = (currentRole[0] === record.role) && status === '150'

  // (currentRole[0] === record.role) && status === '150'

  // // 乙方
  // const apReceiveFlag = '000';

  // // 甲方
  // const bpReceiveFlag = '020';

  // const originationId = '1';

  import {
    Row as ARow,
    Col as ACol,
    Form as AForm,
    FormItem as AFormItem,
    Textarea as ATextarea,
  } from 'ant-design-vue';

  import { unref } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import { eventTriggerForm } from '/@/api/manage/eventTrigger';
  // data
  import { isUpdate, idRef, record } from './equipmentMaintenance.data';

  import { BasicUpload } from '/@/components/Upload';

  import { StepAction } from '/@/components/StepAction';

  import { EquipmentMaintenanceUpdateState } from '/@/api/manage/equipmentMaintenance';

  const emit = defineEmits(['success', 'register']);

  const userStore = useUserStore();

  console.log(userStore.getRoleList[0]);

  const { notification } = useMessage();

  const formState = {
    stepOneRemark: '',
    stepTwoRemark: '',
    stepThreeRemark: '',
    stepFourRemark: '',
    stepFiveRemark: '',
    stepSixRemark: '',
    stepSevenRemark: '',
    stepEightRemark: '',
  };

  const processStep = '750';

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    // resetFields();
    setModalProps({ loading: true, confirmLoading: true });

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await eventTriggerForm({ id: data?.record?.id })) || {}) as Recordable;
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }

    setModalProps({ loading: false, confirmLoading: false });
  });

  /**
   * 提交表单
   */
  async function handleSubmit() {
    console.log(formState);
  }

  /**
   * 信息核实提交
   */
  async function onSubmitHandler(status) {
    console.log('提交', status);

    let params = {};

    switch (status) {
      case '150':
        params['stepOneRemark'] = formState.stepOneRemark;
        break;
      case '250':
        params['stepTwoRemark'] = formState.stepTwoRemark;
        break;
      case '350':
        params['stepThreeRemark'] = formState.stepThreeRemark;
        break;
      case '450':
        params['stepFourRemark'] = formState.stepFourRemark;
        break;
      case '550':
        params['stepFiveRemark'] = formState.stepFiveRemark;
        break;
      case '650':
        params['stepSixRemark'] = formState.stepSixRemark;
        break;
      case '750':
        params['stepSevenRemark'] = formState.stepSevenRemark;
        break;
      case '850':
        params['stepEightRemark'] = formState.stepEightRemark;
        break;
    }

    // await equipmentMaintenanceUpdateState({ deviceAlarmId: '', processStep: status, {...params} });
  }

  /**
   * 信息核实驳回
   */
  function onRejectHandler(status) {
    console.log('驳回', status);

    // await equipmentMaintenanceUpdateState({ deviceAlarmId: '', processStep: status });
  }

  /**
   * 信息核实确认
   */
  function onConfirmHandler(status) {
    console.log('确认', status);

    // await equipmentMaintenanceUpdateState({deviceAlarmId: '', processStep: status });
  }
</script>
