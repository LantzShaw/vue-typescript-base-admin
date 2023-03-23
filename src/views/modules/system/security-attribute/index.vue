<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar> </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'url'">
          <a @click="handleEdit(record)" :title="record.url">
            <a-row type="flex">
              <a-col flex="60px">
                <dict-label :options="requestMethodOptions" :value="record.requestMethod" />
              </a-col>
              <a-col flex="3">{{ record.url }}</a-col>
              <a-col flex="2">{{ record.attributeName }}</a-col>
            </a-row>
          </a>
        </template>
        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'system:config:edit',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <SecurityAttributeModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件

  import { Row, Col, Tag } from 'ant-design-vue';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import SecurityAttributeModal from './SecurityAttributeModal.vue';
  // 接口
  import { securityAttributePage } from '/@/api/system/securityAttribute';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { requestMethodOptions, searchForm, tableColumns } from './securityAttribute.data';

  const ARow = Row;
  const ACol = Col;
  const ATag = Tag;
  const { t } = useI18n();
  const { notification } = useMessage();

  /**
   * 构建registerDrawer
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: securityAttributePage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
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
    const { request_method } = await optionsListBatchApi(['request_method']);
    requestMethodOptions.value = request_method || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
