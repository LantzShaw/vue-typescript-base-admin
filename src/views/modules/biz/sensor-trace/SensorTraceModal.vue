<template>
  <BasicModal
    width="50%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :title="getTitle"
    :centered="true"
    @ok="handleSubmit"
    :okAuth="okAuth"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <BasicForm autoFocusFirstItem @register="registerForm">
        <template #list>
          <BasicUpload
            :accept="['.pdf']"
            :maxSize="20"
            :showPreviewNumber="false"
            :emptyHidePreview="true"
            :multiple="false"
            @change="handleUploadChange"
            :api="uploadApi"
            :value="fileList"
            :fileNames="fileNameList"
          />
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  import { BasicUpload } from '/@/components/Upload';

  // 接口
  import { sensorTraceForm, sensorTraceAdd, sensorTraceUpdate } from '/@/api/biz/sensorTrace';
  import { uploadApi } from '/@/api/sys/upload';

  // data
  import { isUpdate, idRef, inputFormSchemas, record, sensorId } from './sensorTrace.data';

  const okAuth = ref(['manage:sensor-traceability:add']);
  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  type FileData = {
    sensorId?: string;
    traceId?: string;
    attPath?: string;
    fileName?: string;
  };

  const fileData = ref<FileData[]>([]);
  const fileList = ref<string[]>([]);
  const fileNameList = ref<string[]>([]);

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: inputFormSchemas,
    showActionButtonGroup: false,
    baseColProps: { lg: 24, md: 24 },
  });

  /**
   * 构建Modal
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });

    fileList.value = [];
    fileNameList.value = [];

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    sensorId.value = data?.sensorId;

    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await sensorTraceForm({
        id: data?.record?.id,
      })) || {}) as Recordable;

      idRef.value = data.record.id;

      if (record.value?.bizDeviceSensorTraceAttList?.length > 0) {
        record.value.bizDeviceSensorTraceAttList.forEach((item) => {
          fileList.value.push(item.attPath);

          fileNameList.value.push(item.fileName);
        });
      }
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
        await sensorTraceUpdate({
          ...values,
          id: idRef.value,
          sensorId: sensorId.value,
          bizDeviceSensorTraceAttList: fileData.value,
        });
      } else {
        await sensorTraceAdd({
          ...values,
          sensorId: sensorId.value,
          bizDeviceSensorTraceAttList: fileData.value,
        });
      }
      notification.success({ message: `执行成功` });
      closeModal();
      emit('success');
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

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
  function handleUploadChange(list: string[], fileNames: string[]) {
    console.log('list', fileNames);

    const filterList = list.filter((item) => item !== undefined || item !== '');
    const filterFileNameList = fileNames.filter((item) => item !== undefined || item !== '');

    fileData.value = filterList.map((item, index) => {
      return {
        attPath: item,
        sensorId: sensorId.value,
        traceId: idRef.value,
        fileName: filterFileNameList[index],
      };
    });
  }

  /**
   * 标题
   */
  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
</script>
