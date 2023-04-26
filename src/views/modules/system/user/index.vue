<template>
  <div>
    <BasicTable @register="registerTable">
      <template #headerTop> </template>

      <template #toolbar>
        <template v-if="getSelectRowKeys().length > 0">
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="handleBatchDelete">
                  <Icon icon="ant-design:delete-outlined" />
                  <span>删除</span>
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              <span>批量操作 </span>
              <Icon icon="akar-icons:chevron-down" />
            </a-button>
          </a-dropdown>
        </template>

        <Authority :value="'system:application:add'">
          <a-button type="default" preIcon="ant-design:download-outlined" @click="handleExport">
            导出
          </a-button>
        </Authority>

        <a-button
          v-auth="'system:application:add'"
          type="default"
          preIcon="ant-design:download-outlined"
          @click="handleExport"
        >
          导出
        </a-button>

        <a-button
          v-auth="'system:application:add'"
          type="default"
          preIcon="ant-design:upload-outlined"
          @click="handleImport"
        >
          导入
        </a-button>

        <a-button
          v-auth="'system:application:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'username'">
          <a @click="handleEdit(record)" :title="record.username">
            {{ record.username }}
          </a>
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
                auth: 'system:user:edit',
              },
              {
                label: '修改密码',
                onClick: handleEditPassword.bind(null, record),
                auth: 'system:user:edit',
              },
              {
                label: '绑定角色',
                onClick: handleBindRole.bind(null, record),
                auth: 'system:user:add',
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'system:user:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <UserModal @register="registerModal" @success="handleSuccess" />
    <UserChangePasswordModal @register="registerUserChangePasswordModal" @success="handleSuccess" />
    <UserRoleModal @register="registerModal2" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted, ref } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  // 组件
  import { RoleEnum } from '/@/enums/roleEnum';
  import { Authority } from '/@/components/Authority';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import UserModal from './UserModal.vue';
  import UserChangePasswordModal from './UserChangePasswordModal.vue';
  import UserRoleModal from './UserRoleModal.vue';
  import { Dropdown, Menu, Divider, Alert, Tree, Spin, Empty } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  // 接口
  import { userPage, userDelete, userBatchDelete } from '/@/api/system/user';
  import { roleSelect } from '/@/api/system/role';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { roleOptions, dataItemStatusOptions, searchForm, tableColumns } from './user.data';

  const ADropdown = Dropdown;
  const AMenu = Menu;
  const AMenuItem = Menu.Item;
  const ADivider = Divider;
  const AAlert = Alert;
  const ATree = Tree;
  const AEmpty = Empty;
  const ASpin = Spin;

  const { t } = useI18n();
  const { createMessage, notification } = useMessage();
  const { changeRole, hasPermission } = usePermission();
  const checkedKeys = ref<Array<string | number>>([]);
  /**
   * 构建registerDrawer
   */
  const [registerModal, { openModal }] = useModal();

  const [registerUserChangePasswordModal, { openModal: openUserChangePasswordModal }] = useModal();

  /**
   * registerModal
   */
  const [registerModal2, { openModal: openModal2 }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { setLoading, getForm, reload, getSelectRowKeys, clearSelectedRowKeys }] =
    useTable({
      title: '',
      api: userPage,
      rowSelection: {
        type: 'checkbox',
      },
      rowKey: 'id',
      columns: tableColumns,
      formConfig: searchForm,
      useSearchForm: true,
      canResize: false,
      showTableSetting: true,
      clickToRowSelect: false,
      clearSelectOnPageChange: true,
      actionColumn: {
        width: 200,
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        auth: 'system:user:operation',
      },
    });

  /**
   * 导出
   */
  function handleExport() {}
  /**
   * 导入
   */
  function handleImport() {}
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
  function handleEditPassword(record: Recordable) {
    openUserChangePasswordModal(true, {
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
    await userDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  /**
   * 批量删除
   */
  async function handleBatchDelete() {
    if (getSelectRowKeys().length > 0) {
      await userBatchDelete([...getSelectRowKeys()]);

      clearSelectedRowKeys();
      notification.success({ message: `执行成功` });
      reload();
    } else {
      createMessage.warning('请选择要操作的数据');
    }
  }

  /**
   * 绑定角色
   */
  function handleBindRole(record: Recordable) {
    console.log(record);
    openModal2(true, {
      record,
      isUpdate: false,
    });
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
    const { data_item_status } = await optionsListBatchApi(['data_item_status']);
    dataItemStatusOptions.value = data_item_status || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
