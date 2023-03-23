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
        <template v-if="column.key === 'employeeName'">
          <a @click="handleEdit(record)" :title="record.employeeName">
            {{ record.employeeName }}
          </a>
        </template>
        <template v-else-if="column.key === 'gender'">
          <dict-label :options="genderOptions" :value="record.gender" />
        </template>
        <template v-else-if="column.key === 'identity'">
          <dict-label :options="identityOptions" :value="record.identity" />
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
                label: '生成账号',
                onClick: handleAuthorize.bind(null, record),
                auth: 'system:role:edit',
                ifShow: (_action) => {
                  return record['sysUser'] === null;
                },
              },
              {
                label: '账号信息',
                onClick: handleAuthorize.bind(null, record),
                auth: 'system:role:edit',
                ifShow: () => {
                  return record['sysUser'] !== null;
                },
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
    <EmployeeModal @register="registerModal" @success="handleSuccess" />
    <RoleMenuDrawer @register="registerRoleMenuDrawer" @success="handleSuccess" />
    <RoleAuthorityDrawer @register="registerRoleAuthorityDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import EmployeeModal from './EmployeeModal.vue';
  import RoleMenuDrawer from './RoleMenuDrawer.vue';
  import RoleAuthorityDrawer from './RoleAuthorityDrawer.vue';

  // 接口
  import { employeePage, employeeDelete, employeeAuthorize } from '/@/api/system/employee';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    identityOptions,
    genderOptions,
    dataItemStatusOptions,
    searchForm,
    tableColumns,
  } from './employee.data';

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
  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: employeePage,
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
      fixed: 'right',
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

  async function handleAuthorize(record: Recordable) {
    await employeeAuthorize(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
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
    await employeeDelete(record);
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

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { identity, gender, data_item_status } = await optionsListBatchApi([
      'identity',
      'gender',
      'data_item_status',
    ]);

    identityOptions.value = identity || [];
    genderOptions.value = gender || [];
    dataItemStatusOptions.value = data_item_status || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
