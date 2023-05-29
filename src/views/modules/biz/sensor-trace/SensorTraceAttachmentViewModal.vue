<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    title="附件"
    :centered="true"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <div style="padding-right: 10px; padding-left: 10px">
      <BasicTable :pagination="false" :data-source="tableData" :columns="previewColumns">
        <!-- 表格内容 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'fileName'">
            <a @click="handlePreview(record)" :title="record.fileName">
              {{ record.fileName }}
            </a>
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicModal>

  <SensorTracePreviewModal :fileName="fileName" @register="registerSensorTracePreviewModal" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';

  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable } from '/@/components/Table';
  import SensorTracePreviewModal from './SensorTracePreviewModal.vue';
  import { useModal } from '/@/components/Modal';

  // 接口
  import { sensorTraceAtt } from '/@/api/biz/sensorTrace';

  // data
  import { idRef, record, sensorId, previewColumns } from './sensorTrace.data';

  const fileList = ref<string[]>([]);
  const fileNameList = ref<string[]>([]);

  const fileName = ref<string>('');

  const tableData = ref<any>([]);

  const [registerSensorTracePreviewModal, { openModal: openSensorTracePreviewModal }] = useModal();

  /**
   * 构建Modal
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });

    fileList.value = [];
    fileNameList.value = [];

    sensorId.value = data?.sensorId;

    // 请求数据
    record.value =
      (await sensorTraceAtt({
        id: data?.record?.id,
      })) || [];

    tableData.value = record.value;

    idRef.value = data.record.id;

    setModalProps({ loading: false, confirmLoading: false });
  });

  /**
   * 附件预览
   */
  function handlePreview(record) {
    fileName.value = record?.fileName ?? '';

    openSensorTracePreviewModal(true, {
      record,
    });
  }
</script>
