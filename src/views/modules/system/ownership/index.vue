<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <div class="w-1/4">
      <div class="m-4 mr-0 p-2 overflow-hidden bg-white">
        <BasicTree
          ref="treeRef"
          title=""
          toolbar
          search
          :clickRowToExpand="false"
          :treeData="treeData"
          @select="handleSelect"
        >
          <template #title="item">
            <dict-label :options="organizationLevelOptions" :value="item.organizationLevel" />
            {{ item.title }}
          </template>
        </BasicTree>
      </div>
    </div>

    <BasicTable @register="registerTable" class="w-3/4" :searchInfo="searchInfo">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'system:menu:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleConfig"
        >
          配置人员归属
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'identity'">
          <dict-label :options="identityOptions" :value="record.identity" />
        </template>

        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '删除归属',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除归属',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'system:menu:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, computed, onMounted, ref, reactive, unref } from 'vue';
  import { useRouter } from 'vue-router';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  // 组件
  import { TreeSelect } from 'ant-design-vue';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';

  // 接口
  import { orgTree } from '/@/api/system/org';
  import { departmentTree } from '/@/api/system/department';
  import { employeePageWithAssigned, employeeAllocatableRemove } from '/@/api/system/employee';

  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    organizationLevelOptions,
    identityOptions,
    organizationOptions,
    treeData,
    searchForm,
    tableColumns,
  } from './ownership.data';

  const ATreeSelect = TreeSelect;

  const { t } = useI18n();
  const { notification, createMessage } = useMessage();
  const go = useGo();
  const { currentRoute } = useRouter();

  const organizationId = ref('');

  const searchInfo = reactive<Recordable>({});
  const treeRef = ref<Nullable<TreeActionType>>(null);

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: employeePageWithAssigned,
    beforeFetch: (params) => {
      // params.applicationId = applicationId.value;
      // params.parentId = menuId.value;
      return params;
    },
    // 立即加载
    immediate: false,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,

    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'system:menu:operation',
    },
  });

  // 单位变更
  function handleChange(value) {
    searchInfo.organizationId = value;
    getTree().setSelectedKeys([]);
    fetchTree();
    reload();
  }

  // 部门选中
  function handleSelect(keys: string[]) {
    searchInfo.organizationId = keys[0];
    organizationId.value = keys[0];
    reload();
  }

  /**
   * 配置人员归属
   */
  function handleConfig() {
    if (organizationId.value == '') {
      createMessage.warning('请选择部门');
    } else {
      const path = unref(currentRoute).path;
      go(`${path}/config/${organizationId.value}`);
    }
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await employeeAllocatableRemove({
      organizationId: organizationId.value,
      id: record.id,
    });
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  /**
   * 加载树
   */
  async function fetchTree() {
    treeData.value = (await orgTree({})) || [];
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
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

  async function initOrganization() {
    const data = await orgTree({});
    organizationId.value = data[0]?.value || '';
    organizationOptions.value = data || [];
    searchInfo.organizationId = data[0]?.value || '';
    fetchTree();
    reload();
  }

  /**
   * 初始化字典
   */
  async function initDict() {
    const { identity, organization_level } = await optionsListBatchApi([
      'identity',
      'organization_level',
    ]);
    identityOptions.value = identity || [];
    organizationLevelOptions.value = organization_level || [];
  }

  onMounted(() => {
    initOrganization();

    initDict();
  });
</script>
