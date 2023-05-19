<template>
  <BasicModal
    width="100%"
    v-bind="$attrs"
    @register="registerModal"
    :showFooter="false"
    :showOkBtn="false"
    :showCancelBtn="false"
    :canFullscreen="true"
    :defaultFullscreen="true"
    title="附件预览"
    :centered="true"
    :okAuth="okAuth"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <!-- <PDFViewer page-scale="page-fit" theme="dark" :src="PDFSrc" @loaded="onLoaded" /> -->
      <PDFViewer page-scale="page-fit" theme="dark" :src="PDFSrc" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive } from 'vue';

  import PDFViewer from './PDFViewer.vue';

  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';

  // 接口
  import { sensorTraceForm, sensorTraceAtt } from '/@/api/biz/sensorTrace';

  // data
  import { isUpdate, idRef, record, sensorId } from './sensorTrace.data';

  const okAuth = ref(['manage:sensor-traceability:view']);

  const PDFSrc = ref(
    'https://cdn.jsdelivr.net/gh/themusecatcher/static-resources@0.0.2/Markdown.pdf',
  );

  type FileData = {
    sensorId?: string;
    traceId?: string;
    attPath?: string;
  };

  const fileData = reactive<FileData[]>([]);
  const fileList = ref<string[]>([]);

  /**
   * 构建Modal
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });

    fileList.value = [];

    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    sensorId.value = data?.sensorId;

    if (unref(isUpdate)) {
      // 请求数据
      record.value = ((await sensorTraceAtt({
        id: data?.record?.id,
      })) || {}) as Recordable;

      idRef.value = data.record.id;

      console.log('record:', record.value);

      fileList.value = record.value?.bizDeviceSensorTraceAttList?.map((item) => item.attPath);

      // if (record.value?.bizDeviceSensorTraceAttList?.length > 0) {
      //   record.value.bizDeviceSensorTraceAttList.forEach((item) => {
      //     fileList.value = item.attPath.split(',');
      //   });
      // }
    } else {
      idRef.value = '';
    }

    setModalProps({ loading: false, confirmLoading: false });
  });

  // function onLoaded(pdfApp: any) {
  //   console.log('loaded app:', pdfApp);
  // }
</script>
