<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :okAuth="okAuth"
    :title="getTitle"
    :centered="true"
    @ok="handleSubmit"
  >
    <div style=" padding-right: 10px;padding-left: 10px">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item
          label="设备组名称"
          :label-style="{ fontWeight: 'bold', color: '#777' }"
        >
          {{ record.groupName }}
        </a-descriptions-item>
        <a-descriptions-item label="设备名称" :label-style="{ fontWeight: 'bold', color: '#777' }">
          {{ record.deviceName }}
        </a-descriptions-item>
        <a-descriptions-item label="设备编号" :label-style="{ fontWeight: 'bold', color: '#777' }">
          {{ record.deviceNo }}
        </a-descriptions-item>
        <a-descriptions-item label="协议类型" :label-style="{ fontWeight: 'bold', color: '#777' }">
          {{ record.dtuipLinktype }}
        </a-descriptions-item>
        <a-descriptions-item label="是否在线" :label-style="{ fontWeight: 'bold', color: '#777' }">
          <dict-label :options="onlineStatusOptions" :value="record.dtuipIsLine" />
        </a-descriptions-item>
        <a-descriptions-item label="是否报警" :label-style="{ fontWeight: 'bold', color: '#777' }">
          <dict-label :options="alarmStatusOptions" :value="record.dtuipIsAlarms" />
        </a-descriptions-item>
        <a-descriptions-item label="启用状态" :label-style="{ fontWeight: 'bold', color: '#777' }">
          <dict-label :options="dataItemStatusOptions" :value="record.status" />
        </a-descriptions-item>
        <a-descriptions-item label="是否删除" :label-style="{ fontWeight: 'bold', color: '#777' }">
          <dict-label :options="deleteStatusOptions" :value="record.dtuipIsDelete" />
        </a-descriptions-item>
      </a-descriptions>
      <div class="mt-4">
        <BasicForm autoFocusFirstItem @register="registerForm" />
      </div>

      <AMapSearch v-model:position="currentPosition" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, watch, computed, unref, onUnmounted, onMounted } from 'vue';
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
  } from 'ant-design-vue';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { DictLabel } from '/@/components/DictLabel/index';

  import { AMapSearch } from '/@/components/AMap';
  // 接口
  import { deviceForm, deviceAdd, deviceUpdate } from '/@/api/manage/device';
  // data
  import {
    isUpdate,
    idRef,
    record,
    inputFormSchemas,
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    dataItemStatusOptions,
  } from './device.data';
  import { optionsListBatchApi } from '/@/api/sys/dict';

  const okAuth = ref(['system:device:add']);
  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  const currentPosition = ref<string[]>(['1', '2']);

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 50,
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

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    record.value = [];

    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await deviceForm({ id: data?.record?.id })) || {}) as Recordable;
      idRef.value = data.record.id;

      const { dtuipLng, dtuipLat } = record.value;

      currentPosition.value = [dtuipLng, dtuipLat];

      console.log(currentPosition.value);
    } else {
      idRef.value = '';
    }
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
        await deviceUpdate({ ...values, id: idRef.value });
      } else {
        await deviceAdd({ ...values });
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

  watch(
    currentPosition,
    (newValue) => {
      setFieldsValue({
        dtuipLng: newValue[0],
        dtuipLat: newValue[1],
      });
    },
    // {
    //   deep: true,
    //   immediate: true,
    // },
  );

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { alarm_status, delete_status, online_status, data_item_status } =
      await optionsListBatchApi([
        'alarm_status',
        'delete_status',
        'online_status',
        'data_item_status',
      ]);
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
    dataItemStatusOptions.value = data_item_status || [];
  }

  onMounted(() => {
    initDict();
  });

  onUnmounted(() => {
    console.log('modal onUnmounted');
  });
</script>
