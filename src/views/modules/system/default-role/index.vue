<template>
  <PageWrapper title="系统默认角色绑定" contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'system:default-role:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'sceneDisplayName'">
          <a @click="handleEdit(record)" :title="record.sceneDisplayName">
            {{ record.sceneDisplayName }}
          </a>
        </template>
        <template v-else-if="column.key === 'role'">
          {{ record.sysRole.roleCode }}
        </template>
        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'system:default-role:edit',
              },

              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'system:default-role:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <DefaultRoleModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import DefaultRoleModal from './DefaultRoleModal.vue';
  // 接口
  import { defaultRolePage, defaultRoleDelete } from '/@/api/system/defaultRole';

  // data
  import { tableColumns } from './defaultRole.data';

  const { t } = useI18n();
  const { notification } = useMessage();

  /**
   * 构建registerDrawer
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: defaultRolePage,
    columns: tableColumns,
    useSearchForm: false,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'system:default-role:operation',
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
    await defaultRoleDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    reload();
  }
</script>
<style lang="less" scoped></style>
