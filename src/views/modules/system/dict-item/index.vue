<template>
  <PageWrapper :title="`字典【` + title + `】的基本信息`" contentFullHeight dense @back="goBack">
    <template #headerContent>
      <a-descriptions :column="2">
        <a-descriptions-item label="标识"> {{ dictCode }} </a-descriptions-item>
        <a-descriptions-item label="名称"> {{ title }} </a-descriptions-item>
      </a-descriptions>
    </template>

    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'system:dict-item:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a @click="handleEdit(record)" :title="record.name">
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'status'">
          <dict-label :options="dataItemStatusOptions" :value="record.status" />
        </template>

        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '复制',
                onClick: handleCopy.bind(null, record),
              },
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

    <DictItemModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { onMounted, unref, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  // 组件
  import { Descriptions } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import DictItemModal from './DictItemModal.vue';
  // 接口
  import { dictItemPage, dictItemDelete } from '/@/api/system/dictItem';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { dataItemStatusOptions, searchForm, tableColumns } from './dictItem.data';

  const ADescriptions = Descriptions;
  const ADescriptionsItem = Descriptions.Item;
  const go = useGo();
  const { closeCurrent } = useTabs();
  const { t } = useI18n();
  const { notification } = useMessage();
  const { currentRoute } = useRouter();
  const route = useRoute();

  // 通过路由获取字典code
  const dictId = unref(currentRoute).params?.dictCode ?? '';
  const dictCode = unref(currentRoute).query?.code ?? '';
  const title = unref(currentRoute).query?.title ?? '';

  /**
   * 构建registerDrawer
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    api: dictItemPage,
    beforeFetch: (params) => {
      params.dictCode = dictCode || '';
      return params;
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
      fixed: 'right',
      auth: 'system:dict-item:operation',
    },
  });

  /**
   * 新增
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      dictCode,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      dictCode,
      isUpdate: true,
    });
  }

  /**
   * 复制
   */
  function handleCopy(record: Recordable) {
    openModal(true, {
      record,
      dictCode,
      isUpdate: false,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await dictItemDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    reload();
  }

  function goBack() {
    const path = unref(currentRoute).path;
    var paths = path.split('/item/');
    go(paths[0]);
    closeCurrent();
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { data_item_status } = await optionsListBatchApi(['data_item_status']);
    dataItemStatusOptions.value = data_item_status || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
