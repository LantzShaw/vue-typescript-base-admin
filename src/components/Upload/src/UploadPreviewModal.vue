<template>
  <BasicModal
    width="800px"
    :title="t('component.upload.preview')"
    class="upload-preview-modal"
    v-bind="$attrs"
    @register="register"
    :showOkBtn="false"
  >
    <FileList :dataSource="fileListRef" :columns="columns" :actionColumn="actionColumn" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, watch, ref } from 'vue';
  //   import { BasicTable, useTable } from '/@/components/Table';
  import FileList from './FileList.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { previewProps } from './props';
  import { PreviewFileItem } from './typing';
  import { downloadByData } from '/@/utils/file/download';
  import { createPreviewColumns, createPreviewActionColumn } from './data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isArray } from '/@/utils/is';
  import { fileDownload } from '/@/api/system/file';

  export default defineComponent({
    components: { BasicModal, FileList },
    props: previewProps,
    emits: ['list-change', 'register', 'delete'],
    setup(props, { emit }) {
      const [register, { closeModal }] = useModalInner();
      const { t } = useI18n();

      const fileListRef = ref<PreviewFileItem[]>([]);

      watch(
        () => props.value,
        (value) => {
          console.log('value', value);

          if (!isArray(value)) value = [];
          fileListRef.value = value
            .filter((item) => !!item)
            .map((item, index) => {
              return {
                url: item,
                type: item.split('.').pop() || '',
                // name: item.split('/').pop() || '',
                name: props.fileNames[index] || '',
              };
            });
        },
        { immediate: true, deep: true },
      );

      // 删除
      function handleRemove(record: PreviewFileItem) {
        const index = fileListRef.value.findIndex((item) => item.url === record.url);
        if (index !== -1) {
          const removed = fileListRef.value.splice(index, 1);
          emit('delete', removed[0].url);
          emit(
            'list-change',
            fileListRef.value.map((item) => item.url),
          );
        }
      }

      // // 预览
      // function handlePreview(record: PreviewFileItem) {
      //   const { url = '' } = record;
      //   createImgPreview({
      //     imageList: [url],
      //   });
      // }

      // 下载
      async function handleDownload(record: PreviewFileItem) {
        const { url = '' } = record;
        // downloadByUrl({ url });

        const response = await fileDownload({
          fileName: url,
        });

        // const fileName = url.replace(/(.*\/)*([^.]+).*/ig,"$2")
        // const fileType  = url.replace(/.+\./, "")
        // downloadByData(response, `${fileName}${fileType}`);

        downloadByData(response, url);
      }

      return {
        t,
        register,
        closeModal,
        fileListRef,
        columns: createPreviewColumns() as any[],
        actionColumn: createPreviewActionColumn({ handleRemove, handleDownload }) as any,
      };
    },
  });
</script>
<style lang="less">
  .upload-preview-modal {
    .ant-upload-list {
      display: none;
    }

    .ant-table-wrapper .ant-spin-nested-loading {
      padding: 0;
    }
  }
</style>
