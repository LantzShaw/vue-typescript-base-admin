<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    @cancel="handleCancel"
    :showFooter="false"
    :showCancelBtn="false"
    :showOkBtn="false"
    title="基本信息填写"
    :centered="true"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
        autocomplete="off"
        :rules="rules"
        @finish="handleSaveInformation"
      >
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
              <!-- :rules="[{ required: true, message: '请选择服务类型!' }]" -->
              <a-select
                placeholder="请选择服务类型"
                :params="['maintenance_task_type']"
                v-model:value="formState.taskType"
                :options="maintenanceTaskTypeOptions"
                :disabled="isReadOnly"
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
                :disabled="isReadOnly"
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
                :disabled="isReadOnly"
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
                :disabled="!hasMaintainerPermission"
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
                :disabled="!hasUserPermission"
                v-model:value="formState.accompanyUser"
                placeholder="请输入陪同人员姓名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人/电话" :label-col="{ span: 5 }" name="apReceiveContacts">
              <a-input
                :disabled="!hasUserPermission"
                v-model:value="formState.apReceiveContacts"
                placeholder="请输入联系人+联系电话"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="服务协议" :label-col="{ span: 5 }" name="agreement">
              <a-input
                :disabled="isReadOnly"
                v-model:value="formState.agreement"
                placeholder="协议编号或标题简写"
              />
            </a-form-item>
          </a-col>
          <a-col :span="20">
            <a-form-item :label-col="{ span: 3 }" label="备注说明" name="remark">
              <a-textarea
                :rows="2"
                v-model:value="formState.remark"
                placeholder="请填写备注说明..."
              />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 21, offset: 3 }">
              <a-space>
                <a-button html-type="submit" :loading="isSaveLoading" type="primary"
                  >保存基本信息</a-button
                >
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="h-14 leading-14">
        <span class="font-bold">
          <Icon icon="ant-design:exclamation-circle-outlined" /> 温馨提示:
        </span>
        <span>信息提交后，将无法进行修改，</span>
        <span class="font-bold text-gray-500">请您确认信息无误后提交</span>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import {
    Row as ARow,
    Col as ACol,
    Form as AForm,
    FormItem as AFormItem,
    Textarea as ATextarea,
    DatePicker as ADatePicker,
    InputNumber as AInputNumber,
    Select as ASelect,
    Tooltip as ATooltip,
    Space as ASpace,
  } from 'ant-design-vue';

  // 组件
  import Icon from '/@/components/Icon/Icon.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { usePermission } from '/@/hooks/web/usePermission';

  // 接口
  import {
    equipmentMaintenanceRecordForm,
    equipmentMaintenanceRecordApReceive,
    equipmentMaintenanceRecordBpReceive,
  } from '/@/api/manage/equipmentMaintenanceRecord';
  import { optionsListBatchApi } from '/@/api/sys/dict';

  // data
  import {
    isUpdate,
    idRef,
    record,
    maintenanceTaskTypeOptions,
  } from './equipmentMaintenanceRecord.data';

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
    processResult?: string;
    initiatingOrganizationId?: string;
  };

  const rules = {};
  const { notification, createWarningModal } = useMessage();
  const userStore = useUserStore();
  const { hasPermission } = usePermission();

  const emit = defineEmits(['success', 'register']);

  const isSaveLoading = ref<boolean>(false);

  const actionType = ref<string>('0');
  const organizationId = ref<string>('');

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
    processResult: '1',
    initiatingOrganizationId: '',
  });

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });

    actionType.value = data.type;
    organizationId.value = userStore.getOrganizationId;

    // 请求数据
    record.value = ((await equipmentMaintenanceRecordForm({ id: data?.record?.id })) ||
      {}) as Recordable;
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;

    idRef.value = data.record.id;

    formState.taskType = record.value.taskType;
    formState.accompanyUser = record.value.accompanyUser;
    formState.duration = record.value.duration;
    formState.remark = record.value.remark;
    formState.startDate = record.value.startDate;
    formState.implementationUser = record.value.implementationUser;
    formState.processResult = record.value.processResult;

    formState.apReceiveContacts = record.value.apReceiveContacts;
    formState.agreement = record.value.agreement;
    formState.apReceiveName = data.record.bizEnterprise.enterpriseName;

    formState.initiatingOrganizationId = record.value.initiatingOrganizationId;

    setModalProps({ loading: false, confirmLoading: false });
  });

  // 文本框、按钮是否只读
  const isReadOnly = computed(() => {
    return formState.initiatingOrganizationId !== organizationId.value;
  });

  // 是否使用方权限
  const hasUserPermission = computed(() => {
    return hasPermission('manage:maintenance-record:generate-user');
  });

  // 是否维护方权限
  const hasMaintainerPermission = computed(() => {
    return hasPermission('manage:maintenance-record:generate-maintainer');
  });

  /**
   * 保存基本信息
   */
  function handleSaveInformation() {
    isSaveLoading.value = true;

    if (actionType.value === '0') {
      if (!formState.accompanyUser || !formState.apReceiveContacts) {
        notification.warning({ message: `陪同人员与联系人不能为空!` });

        isSaveLoading.value = false;

        return;
      }
    } else if (actionType.value === '1') {
      if (!formState.implementationUser) {
        notification.warning({ message: `实施人员不能为空!` });

        isSaveLoading.value = false;

        return;
      }
    }

    createWarningModal({
      title: '温馨提醒',
      content: '是否确认提交信息',
      onOk: async () => {
        if (actionType.value === '0') {
          // 使用方
          await equipmentMaintenanceRecordApReceive({
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
            apReceiveFlag: record.value.apReceiveFlag,
            bpReceiveFlag: record.value.bpReceiveFlag,
          });
        } else if (actionType.value === '1') {
          // 维护方
          await equipmentMaintenanceRecordBpReceive({
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
            apReceiveFlag: record.value.apReceiveFlag,
            bpReceiveFlag: record.value.bpReceiveFlag,
          });
        }

        closeModal();

        emit('success');

        notification.success({ message: `保存成功!` });
      },
      cancelText: '取消',
      closable: true,
      onCancel: () => {},
    });

    isSaveLoading.value = false;
  }

  /**
   * 关闭弹框
   */
  function handleCancel() {
    emit('success');
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
