<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #toolbar> </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'registeredClientId'">
          <a @click="handleEdit(record)" :title="record.registeredClientId">
            {{ record.registeredClientId }}
          </a>
        </template>
        <template v-else-if="column.key === 'authorizationGrantType'">
          <dict-label :options="grantTypesOptions" :value="record.authorizationGrantType" />
        </template>
        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <TokenModal @register="registerModal" />
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
  import { useModal } from '/@/components/Modal';
  import TokenModal from './TokenModal.vue';
  // 接口
  import { tokenPage, tokenDelete } from '/@/api/authorize/token';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { grantTypesOptions, tfOptions, searchForm, tableColumns } from './token.data';

  const { t } = useI18n();
  const { notification } = useMessage();

  /**
   * 构建registerModal
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: tokenPage,
    defSort: {
      field: 'authorizationCodeIssuedAt',
      order: 'ascend',
    },
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
      fixed: undefined,
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
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await tokenDelete(record);
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
    const { tf, grant_types } = await optionsListBatchApi(['tf', 'grant_types']);

    tfOptions.value = tf || [];
    grantTypesOptions.value = grant_types || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
