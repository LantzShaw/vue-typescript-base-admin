<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <div class="w-1/4 xl:w-1/5">
      <div class="m-4 mr-0 p-2 overflow-hidden bg-white">
        <BasicTree
          ref="treeRef"
          title="组织列表"
          toolbar
          search
          :clickRowToExpand="false"
          :treeData="treeData"
          @select="handleSelect"
        >
          <template #title="item">
            <dict-label :options="orgTypeOptions" :value="item.organizationType" />
            {{ item.title }}
          </template>
        </BasicTree>
      </div>
    </div>
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button
          v-auth="'system:org:revised'"
          type="primary"
          danger
          preIcon="ant-design:interaction-outlined"
          @click="handleRevised"
        >
          校正层级深度
        </a-button>
        <a-button
          v-auth="'system:org:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>

      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'id'"> {{ record.id }} </template>
        <template v-if="column.key === 'organizationName'">
          {{ record.organizationName }}
        </template>
        <template v-if="column.key === 'organizationType'">
          <dict-label :options="orgTypeOptions" :value="record.organizationType" />
        </template>
      </template>

      <template #firstColumn="{ record }">
        <a @click="handleEdit(record)" :title="record.id">
          {{ record.id }}
        </a>
      </template>
      <template #orgType="{ record }">
        <dict-label :options="orgTypeOptions" :value="record.type" />
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: t('编辑'),
              onClick: handleEdit.bind(null, record),
              auth: 'system:org:edit',
            },
            {
              icon: 'ant-design:copy-outlined',
              tooltip: t('复制'),
              color: 'warning',
              onClick: handleCopy.bind(null, record),
              auth: 'system:org:add',
            },
            {
              icon: 'ant-design:appstore-add-outlined',
              tooltip: t('新增下级'),
              onClick: handleCreateChild.bind(null, record),
              auth: 'system:org:add',
            },
            {
              icon: 'ant-design:delete-outlined',
              tooltip: t('删除'),
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              auth: 'system:org:delete',
            },
          ]"
        />
      </template>
    </BasicTable>
    <OrgDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted, ref, unref, reactive } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import OrgDrawer from './OrgDrawer.vue';
  // 接口
  import { orgTree, orgDelete, orgRevised } from '/@/api/system/org';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { orgTypeOptions, treeData, searchForm, tableColumns } from './org.data';

  const { t } = useI18n();
  const { notification } = useMessage();

  const searchInfo = reactive<Recordable>({});
  const treeRef = ref<Nullable<TreeActionType>>(null);

  /**
   * 构建registerDrawer
   */

  const [registerDrawer, { openDrawer }] = useDrawer();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: orgTree,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    isTreeTable: true,
    pagination: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  /**
   * 树节点选中
   */
  function handleSelect(keys) {
    searchInfo.id = keys[0];
    reload();
  }

  /**
   * 新增
   */
  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  /**
   * 新增下级
   */
  function handleCreateChild(record: Recordable) {
    openDrawer(true, {
      parentId: record.id,
      record,
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
   * 复制
   */
  function handleCopy(record: Recordable) {
    openDrawer(true, {
      parentId: record.parentId,
      record,
      isUpdate: false,
    });
  }

  /**
   * 校正层级深度
   */
  async function handleRevised() {
    await orgRevised();
    notification.success({ message: `执行成功` });
  }
  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await orgDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess(record);
  }

  /**
   * 加载树
   */
  async function fetchTree() {
    treeData.value = (await orgTree({})) as unknown as TreeItem[];
  }

  /**
   * 执行成功
   */
  function handleSuccess(record: Recordable) {
    fetchTree();
    reload();
  }

  /**
   * 获取树
   */
  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }

  /**
   * 初始化字典
   */
  async function initDict() {
    const { org_type } = await optionsListBatchApi(['org_type']);
    orgTypeOptions.value = org_type || [];
  }

  onMounted(() => {
    initDict();
    fetchTree();
  });
</script>
