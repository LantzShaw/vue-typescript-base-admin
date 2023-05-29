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
      <PDFViewer page-scale="page-fit" :fileName="fileName" theme="dark" :src="PDFSrc" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';

  import PDFViewer from './PDFViewer.vue';

  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';

  // 接口
  import { fileShow } from '/@/api/system/file';

  type Props = {
    fileName?: string;
  };

  withDefaults(defineProps<Props>(), {
    fileName: '附件',
  });

  const okAuth = ref(['manage:sensor-traceability:view']);

  const PDFSrc = ref();
  // 'https://cdn.jsdelivr.net/gh/themusecatcher/static-resources@0.0.2/Markdown.pdf',

  /**
   * 构建Modal
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });

    PDFSrc.value = await fileShow(data.record.attPath);

    setModalProps({ loading: false, confirmLoading: false });
  });

  // function onLoaded(pdfApp: any) {
  //   console.log('loaded app:', pdfApp);
  // }
</script>
