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
          <a-form-item :label-col="{ lg: 5 }" label="附件">
            <BasicUpload
              :maxSize="20"
              :maxNumber="10"
              :showPreviewNumber="false"
              :emptyHidePreview="true"
              :multiple="false"
              @change="handleUploadChange"
              :api="uploadApi"
              :value="fileList"
            />
          </a-form-item>
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { useRoute } from 'vue-router';
  import { FormItem as AFormItem } from 'ant-design-vue';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  import { BasicUpload } from '/@/components/Upload';

  // 接口
  import {
    sensorResumeForm,
    sensorResumeAdd,
    sensorResumeUpdate,
  } from '/@/api/manage/sensorResume';
  import { uploadApi } from '/@/api/sys/upload';

  // data
  import { isUpdate, idRef, inputFormSchemas, record } from './sensorResume.data';
  import { reactive } from 'vue';
  const okAuth = ref(['manage:sensor-resume:add']);
  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();
  const route = useRoute();

  type FileData = {
    sensorId?: string;
    traceId?: string;
    attPath?: string;
  };

  const fileData = reactive<FileData[]>([]);
  const fileList = ref<string[]>([]);

  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 120,
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

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await sensorResumeForm({
        id: data?.record?.id,
      })) || {}) as Recordable;

      idRef.value = data.record.id;

      if (record.value?.list.length > 0) {
        record.value.list.forEach((item) => {
          fileList.value = item.attPath.split(',');
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
        await sensorResumeUpdate({
          ...values,
          id: idRef.value,
          sensorId: route?.params?.id,
          list: fileData,
        });
      } else {
        await sensorResumeAdd({ ...values, sensorId: route?.params?.id, list: fileData });
      }
      notification.success({ message: `执行成功` });
      closeModal();
      emit('success');
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  /**
   * 文件上传 - 保存按钮事件
   *
   * @param list 文件名数组
   */
  function handleUploadChange(list: string[]) {
    const filterList = list.filter((item) => item !== undefined || item !== '');

    fileData.push({
      traceId: idRef.value,
      sensorId: route?.params?.id as string,
      attPath: filterList.toString(),
    });
  }

  /**
   * 标题
   */
  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
</script>
