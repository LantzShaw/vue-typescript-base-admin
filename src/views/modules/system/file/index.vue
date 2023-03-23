<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <BasicUpload
          :maxSize="20"
          :maxNumber="10"
          :showPreviewNumber="false"
          :emptyHidePreview="true"
          :multiple="false"
          @change="handleChange"
          :api="uploadApi"
          class="my-5"
        />
      </template>
      <template #firstColumn="{ record }">
        <a @click="handleEdit(record)" :title="record.fileName">
          {{ record.fileName }}
        </a>
      </template>

      <template #sysLevel="{ record }">
        <dict-label :options="tfOptions" :value="record.sysLevel" />
      </template>

      <template #fileLocation="{ record }">
        <dict-label :options="fileStorageLocationOptions" :value="record.fileLocation" />
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: t('编辑'),
              onClick: handleEdit.bind(null, record),
              auth: 'system:config:edit',
            },
            {
              icon: 'ant-design:download-outlined',
              tooltip: t('下载'),
              onClick: handleDownload.bind(null, record),
              auth: 'system:config:edit',
            },
            {
              icon: 'ant-design:delete-outlined',
              tooltip: t('删除'),
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              auth: 'system:config:delete',
            },
            {
              icon: 'ant-design:eye-outlined',
              tooltip: t('预览'),
              onClick: handlePreview.bind(null, record),
              auth: 'system:config:edit',
            },
          ]"
        />
      </template>
    </BasicTable>
    <ConfigDrawer @register="registerDrawer" @success="handleSuccess" />

    <PreviewModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import {
    downloadByUrl,
    downloadByData,
    downloadByBase64,
    downloadByOnlineUrl,
  } from '/@/utils/file/download';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  // 组件
  import { BasicUpload } from '/@/components/Upload';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useDrawer } from '/@/components/Drawer';
  import ConfigDrawer from './ConfigDrawer.vue';
  import { useModal } from '/@/components/Modal';
  import PreviewModal from './PreviewModal.vue';

  // 接口
  import { filePage, fileDelete, fileDownload } from '/@/api/system/file';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  import { uploadApi } from '/@/api/sys/upload';
  // data
  import { fileStorageLocationOptions, tfOptions, searchForm, tableColumns } from './file.data';

  const { t } = useI18n();
  const { notification } = useMessage();
  const { hasPermission } = usePermission();

  /**
   * 构建registerDrawer
   */
  const [registerDrawer, { openDrawer }] = useDrawer();

  /**
   * registerModal
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '系统配置',
    api: filePage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
      auth: 'system:config:operation',
    },
  });

  /**
   * 新增
   */
  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }
  /**
   * 预览
   */
  function handlePreview(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: false,
    });
  }

  function handleChange(list: string[]) {
    console.log(list);
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await fileDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  function handleDownload(record: Recordable) {
    fileDownload({ id: record.id }).then((res) => {
      downloadByData(res, record.fileName);
      notification.success({ message: `执行成功` });
    });
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    reload();
  }
  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { tf, file_storage_location } = await optionsListBatchApi([
      'tf',
      'file_storage_location',
    ]);
    tfOptions.value = tf || [];
    fileStorageLocationOptions.value = file_storage_location || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
