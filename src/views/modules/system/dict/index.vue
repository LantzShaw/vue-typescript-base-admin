<template>
  <div>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'system:dict:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
        <a-button
          v-auth="'system:dict:refresh-cache'"
          type="primary"
          preIcon="ant-design:interaction-outlined"
          @click="handleRefreshCache"
        >
          刷新缓存
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <a @click="handleEdit(record)" :title="record.title">
            {{ record.title }}
          </a>
        </template>
        <template v-else-if="column.key === 'code'">
          <template v-if="hasPermission('system:dict:item')">
            <a @click="handleDictItem(record)" :title="record.code">
              {{ record.code }}
            </a>
          </template>
          <template v-else>
            {{ record.code }}
          </template>
        </template>
        <template v-else-if="column.key === 'category'">
          <dict-label :options="dictCategoryOptions" :value="record.category" />
        </template>
        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '字典项',
                onClick: handleDictItem.bind(null, record),
                auth: 'system:dict:item',
              },
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'system:dict:edit',
              },
              {
                label: t('复制'),
                onClick: handleCopy.bind(null, record),
                auth: 'system:dict:edit',
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'system:dict:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <DictModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, unref } from 'vue';
  import { useRouter } from 'vue-router';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useGo } from '/@/hooks/web/usePage';
  // 组件
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import DictModal from './DictModal.vue';

  // 接口
  import { dictPage, dictDelete, dictRefreshCache } from '/@/api/system/dict';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { dictCategoryOptions, searchForm, tableColumns } from './dict.data';

  const { t } = useI18n();
  const { notification } = useMessage();
  const { hasPermission } = usePermission();
  const go = useGo();
  const { currentRoute } = useRouter();

  /**
   * 构建registerModal
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: dictPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'system:dict:operation',
    },
  });

  /**
   * 新增
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

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
   * 复制
   */
  function handleCopy(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: false,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await dictDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  /**
   * 字典选项维护
   */
  function handleDictItem(record: Recordable) {
    const path = unref(currentRoute).path;
    go(`${path}/item/${record.id}?code=${record.code}&title=${record.title}`);
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    reload();
  }

  /**
   * 刷新缓存
   */
  async function handleRefreshCache() {
    await dictRefreshCache();
    notification.success({ message: `执行成功` });
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { dict_category } = await optionsListBatchApi(['dict_category']);

    dictCategoryOptions.value = dict_category || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
