<template>
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

        <template v-else-if="column.key === 'status'">
          <dict-label :options="dataItemStatusOptions" :value="record.status" />
        </template>
        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'system:role:edit',
              },
              {
                label: '菜单权限',
                onClick: handleGrantMenu.bind(null, record),
                auth: 'system:role:grant',
              },
              {
                label: 'API权限',
                onClick: handleGrantAuthority.bind(null, record),
                auth: 'system:role:grant',
              },
              {
                label: '数据权限',
                onClick: handleGrantDataScope.bind(null, record),
                auth: 'system:role:grant',
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'system:role:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <RoleModal @register="registerModal" @success="handleSuccess" />
    <RoleMenuDrawer @register="registerRoleMenuDrawer" @success="handleSuccess" />
    <RoleAuthorityDrawer @register="registerRoleAuthorityDrawer" @success="handleSuccess" />
    <RoleDataScopeDrawer @register="registerRoleDataScopeDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import RoleModal from './RoleModal.vue';
  import RoleMenuDrawer from './RoleMenuDrawer.vue';
  import RoleAuthorityDrawer from './RoleAuthorityDrawer.vue';
  import RoleDataScopeDrawer from './RoleDataScopeDrawer.vue';

  // 接口
  import { rolePage, roleDelete } from '/@/api/system/role';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { tfOptions, dataItemStatusOptions, searchForm, tableColumns } from './role.data';

  const { t } = useI18n();
  const { notification } = useMessage();

  /**
   * 构建registerDrawer
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerRoleMenuDrawer
   */
  const [registerRoleMenuDrawer, { openDrawer: openRoleMenuDrawer }] = useDrawer();
  const [registerRoleAuthorityDrawer, { openDrawer: openRoleAuthorityDrawer }] = useDrawer();
  const [registerRoleDataScopeDrawer, { openDrawer: openRoleDataScopeDrawer }] = useDrawer();
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
      width: 200,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'system:role:operation',
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
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await roleDelete({ ids: [record.id] });
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
   * 授权权限
   */
  function handleGrantAuthority(record: Recordable) {
    openRoleAuthorityDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  function handleGrantDataScope(record: Recordable) {
    openRoleDataScopeDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { tf, data_item_status } = await optionsListBatchApi(['tf', 'data_item_status']);
    tfOptions.value = tf || [];
    dataItemStatusOptions.value = data_item_status || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
<script lang="ts">
  export default defineComponent({
    // 需要和路由的name一致
    name: 'RolePage',
  });
</script>
