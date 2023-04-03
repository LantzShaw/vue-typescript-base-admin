<template>
  <BasicModal
    width="50%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :title="getTitle"
    :centered="true"
    @ok="handleSubmit"
  >
    <div style="padding-left: 10px; padding-right: 10px">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
      >
        <a-form-item label="设备" name="deviceId">
          <a-select
            v-model:value="formState.deviceId"
            style="width: 100%"
            placeholder="请选择设备"
            :options="getDeviceOptions"
            @change="handleDeviceChange"
          ></a-select>
        </a-form-item>
        <a-form-item label="传感器" name="sensorId">
          <a-select
            v-model:value="formState.sensorId"
            style="width: 100%"
            placeholder="请选择传感器"
            :options="getSensorOptions"
          ></a-select>
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, onMounted, reactive, ref, unref } from 'vue';

  import { Form as AForm, FormItem as AFormItem, Select as ASelect } from 'ant-design-vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import {
    associationDeviceAdd,
    associationDeviceUpdate,
    associationDeviceForm,
  } from '/@/api/manage/equipmentMaintenance';
  // data
  import { isUpdate, idRef, record } from './associationDevice.data';
  import { sensorPage } from '/@/api/manage/sensor';
  import { devicePage } from '/@/api/manage/device';

  import { useRoute } from 'vue-router';

  const route = useRoute();

  type FormState = {
    deviceId?: string;
    sensorId?: string;
  };

  type Device = {
    id?: string;
    deviceName?: string;
  };

  type Sensor = {
    id?: string;
    sensorName?: string;
  };

  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  const formState = reactive<FormState>({});

  const deviceOptions = ref<Device[]>([]);
  const sensorOptions = ref<Sensor[]>([]);

  /**
   * 构建Modal
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });

    // 初始化值
    formState.deviceId = undefined;
    formState.sensorId = undefined;
    sensorOptions.value = [];

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    record.value = [];

    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await associationDeviceForm({ id: data?.record?.id })) || {}) as Recordable;
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }

    setModalProps({ loading: false, confirmLoading: false });
  });

  /**
   * 设备 - 选择事件
   */
  function handleDeviceChange() {
    formState.sensorId = undefined;

    getSensorList();
  }

  /**
   * 获取设备列表
   */
  async function getDeviceList() {
    const response = await devicePage({ pageIndex: 1, pageSize: 100000 });

    console.log('----------response------------', response);

    deviceOptions.value = response.records;
  }

  /**
   * 获取传感器列表
   */
  async function getSensorList() {
    const response = await sensorPage({
      pageIndex: 1,
      pageSize: 100000,
      deviceId: formState.deviceId,
    });

    sensorOptions.value = response.records;

    console.log('----------response------------', response);
  }

  // 设备
  const getDeviceOptions = computed(() => {
    return unref(deviceOptions).map((device) => {
      return {
        label: device.deviceName,
        value: device.id,
      };
    });
  });

  // 传感器
  const getSensorOptions = computed(() => {
    return unref(sensorOptions).map((sensor) => {
      return {
        label: sensor.sensorName,
        value: sensor.id,
      };
    });
  });

  /**
   * 提交表单
   */
  async function handleSubmit() {
    console.log('form state', formState);

    try {
      setModalProps({ loading: true, confirmLoading: true });
      if (unref(isUpdate)) {
        await associationDeviceUpdate({});
      } else {
        await associationDeviceAdd({ ...formState, planId: route?.params?.id });
      }
      notification.success({ message: `执行成功` });
      closeModal();
      emit('success');
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  onMounted(() => {
    getDeviceList();
  });

  /**
   * 标题
   */
  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
</script>
