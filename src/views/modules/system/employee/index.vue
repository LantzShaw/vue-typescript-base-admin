<template>
  <div>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'system:employee:add'"
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
        <template v-else-if="column.key === 'sysOrganizationList'">
          <p v-for="(item, index) in record.sysOrganizationList" :key="index">
            {{ item.organizationName }}
          </p>
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
                auth: 'system:employee:edit',
              },
              {
                label: '生成账号',
                onClick: handleAuthorize.bind(null, record),
                auth: 'system:employee:edit',
                ifShow: (_action) => {
                  return record['sysUser'] === null;
                },
              },
              {
                label: '账号信息',
                onClick: handleViewUser.bind(null, record),
                ifShow: () => {
                  return record['sysUser'] !== null;
                },
              },
              {
                label: '删除',
                color: 'error',
                auth: 'system:employee:delete',
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
    <UserModal @register="registerUserModal" @success="handleSuccess" />
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

  import { useModal } from '/@/components/Modal';
  import EmployeeModal from './EmployeeModal.vue';
  import UserModal from './UserModal.vue';

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
  const [registerUserModal, { openModal: openModalUserModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: employeePage,
    columns: tableColumns,
    defSort: {
      field: 'createTime',
      order: 'descend',
    },
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
      auth: 'system:employee:operation',
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

  function handleViewUser(record: Recordable) {
    openModalUserModal(true, {
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
