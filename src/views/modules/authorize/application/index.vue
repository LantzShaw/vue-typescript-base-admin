<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'authorize:application:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'applicationName'">
          <a @click="handleEdit(record)" :title="record.applicationName">
            {{ record.applicationName }}
          </a>
        </template>
        <template v-else-if="column.key === 'authorizationGrantTypes'">
          <dict-label :options="grantTypesOptions" :value="record.authorizationGrantTypes" />
        </template>
        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'authorize:application:edit',
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'authorize:application:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ApplicationDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useDrawer } from '/@/components/Drawer';
  import ApplicationDrawer from './ApplicationDrawer.vue';
  // 接口
  import { applicationPage, applicationDelete } from '/@/api/authorize/application';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { grantTypesOptions, searchForm, tableColumns } from './application.data';

  const { t } = useI18n();
  const { notification } = useMessage();

  /**
   * 构建registerDrawer
   */
  const [registerDrawer, { openDrawer }] = useDrawer();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: applicationPage,
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
      auth: 'authorize:application:operation',
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
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await applicationDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
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
    const { grant_types } = await optionsListBatchApi(['grant_types']);
    grantTypesOptions.value = grant_types || [];
  }

  onMounted(() => {
    initDict();
  });
</script>

<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
