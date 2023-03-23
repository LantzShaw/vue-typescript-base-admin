<template>
  <PageWrapper>
    <template #left>left</template>
    <template #right>right</template>
    <div>
      <BasicTable @register="registerTable">
        <!-- 按钮工具栏 -->
        <template #toolbar>
          <a-button
            v-auth="'system:role:add'"
            type="primary"
            preIcon="ant-design:plus-outlined"
            @click="handleCreate"
          >
            新增
          </a-button>
        </template>
        <!-- 表格内容 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'roleName'">
            <a @click="handleEdit(record)" :title="record.roleName">
              {{ record.roleName }}
            </a>
          </template>
          <template v-else-if="column.key === 'internalFlag'">
            <dict-label :options="tfOptions" :value="record.internalFlag" />
          </template>
          <template v-else-if="column.key === 'dataScopeType'">
            <dict-label :options="dataScopeTypeOptions" :value="record.dataScopeType" />
          </template>
          <template v-else-if="column.key === 'status'">
            <dict-label :options="dataItemStatusOptions" :value="record.status" />
          </template>
          <!-- 表格按钮 -->
          <template v-else-if="column.key === 'action'">
            <TableAction
              stopButtonPropagation
              :actions="[
                {
                  label: '编辑',
                  onClick: handleEdit.bind(null, record),
                  auth: 'system:role:edit',
                },
                {
                  label: '复制',
                  onClick: handleCopy.bind(null, record),
                  auth: 'system:role:add',
                },
                {
                  label: '授权菜单',
                  onClick: handleGrantMenu.bind(null, record),
                  auth: 'system:role:grant',
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
      <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
      <RoleMenuDrawer @register="registerRoleMenuDrawer" @success="handleSuccess" />
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useDrawer } from '/@/components/Drawer';
  import RoleDrawer from './RoleDrawer.vue';
  import RoleMenuDrawer from './RoleMenuDrawer.vue';
  // 接口
  import { rolePage, roleDelete } from '/@/api/system/role';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    tfOptions,
    dataItemStatusOptions,
    dataScopeTypeOptions,
    searchForm,
    tableColumns,
  } from './role.data';

  const { t } = useI18n();
  const { notification } = useMessage();

  /**
   * 构建registerDrawer
   */
  const [registerDrawer, { openDrawer }] = useDrawer();

  /**
   * 构建registerRoleMenuDrawer
   */
  const [registerRoleMenuDrawer, { openDrawer: openRoleMenuDrawer }] = useDrawer();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: rolePage,
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
   * 复制
   */
  function handleCopy(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: false,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await roleDelete(record);
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
   * 授权菜单
   */
  function handleGrantMenu(record: Recordable) {
    openRoleMenuDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { tf, data_scope_type, data_item_status } = await optionsListBatchApi([
      'tf',
      'data_scope_type',
      'data_item_status',
    ]);

    tfOptions.value = tf || [];
    dataScopeTypeOptions.value = data_scope_type || [];
    dataItemStatusOptions.value = data_item_status || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
