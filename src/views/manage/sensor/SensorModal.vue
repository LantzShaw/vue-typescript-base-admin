<template>
  <BasicModal
    width="74%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :okAuth="okAuth"
    :title="getTitle"
    :centered="true"
    @ok="handleSubmit"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <BasicForm autoFocusFirstItem @register="registerForm">
        <!-- <template #organizationId>
          <a-form-item
            :wrapper-col="{ span: 24 }"
            :label-col="{ lg: 5, md: 24 }"
            name="organizationId"
            label="使用单位"
          >
            <a-select
              disabled
              placeholder="请选择使用单位"
              v-model:value="formState.organizationId"
              @change="handleEnterpriseChange"
              :options="enterpriseOptions"
            />
          </a-form-item>
        </template> -->

        <template #regionId="{ model, field }">
          <a-select
            placeholder="请选择所属区域"
            :loading="isRegionSelectLoading"
            :disabled="isRegionSelectLoading"
            v-model:value="model[field]"
            :options="regionOptions"
          />
        </template>

        <!-- colSlot -->
        <!-- <template #regionId>
          <a-form-item
            :wrapper-col="{ span: 24 }"
            :label-col="{ lg: 5, md: 24 }"
            name="organizationId"
            label="所属区域"
          >
            <a-select
              placeholder="请选择所属区域"
              :loading="isRegionSelectLoading"
              :disabled="isRegionSelectLoading"
              v-model:value="formState.regionId"
              :options="regionOptions"
            />
          </a-form-item>
        </template> -->
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, reactive, ref, unref } from 'vue';
  import { FormItem as AFormItem, Select as ASelect } from 'ant-design-vue';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import { sensorForm, sensorAdd, sensorUpdate } from '/@/api/manage/sensor';
  // data
  import {
    isUpdate,
    idRef,
    record,
    inputFormSchemas,
    enterpriseOptions,
    regionOptions,
  } from './sensor.data';
  import { companyPage } from '/@/api/manage/company';
  import { installRegionPage } from '/@/api/manage/installRegion';

  const okAuth = ref(['manage:sensor:add']);
  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  const formState = reactive({
    organizationId: undefined,
    regionId: undefined,
  });

  const isRegionSelectLoading = ref<boolean>(false);

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 140,
    schemas: inputFormSchemas,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    // 请求数据
    await getEnterpriseList();

    record.value = ((await sensorForm({
      id: data?.record?.id,
    })) || {}) as Recordable;
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      idRef.value = data.record.id;

      formState.organizationId = data.record.organizationId;
      formState.regionId = data.record.regionId;

      // NOTE: 由于后端反的是number类型，将其转成字符串
      record.value.dtuipSensorTypeId = record.value.dtuipSensorTypeId?.toString();
      // record.value.dtuipId = record.value.dtuipId?.toString();
    } else {
      idRef.value = '';
    }

    await getRegionList();

    setFieldsValue({
      ...record.value,
    });

    setModalProps({ loading: false, confirmLoading: false });
  });

  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      const values = await validate();

      setModalProps({ loading: true, confirmLoading: true });
      if (unref(isUpdate)) {
        await sensorUpdate({ ...values, id: idRef.value, ...formState });
      } else {
        await sensorAdd({ ...values });
      }
      notification.success({ message: `执行成功` });
      closeModal();
      emit('success');
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
  /**
   * 标题
   */
  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  const handleEnterpriseChange = () => {
    formState.regionId = undefined;

    getRegionList();
  };

  // TODO: 企业
  // const getEnterpriseOptions = computed(() => {
  //   return unref(enterpriseOptions).map((company) => {
  //     return {
  //       label: company.enterpriseName,
  //       value: company.id,
  //     };
  //   });
  // });

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
</script>
