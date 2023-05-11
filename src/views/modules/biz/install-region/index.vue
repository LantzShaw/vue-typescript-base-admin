<template>
  <div>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate">
          新增
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'regionName'">
          <a @click="handleEdit(record)" :title="record.regionName">
            {{ record.regionName }}
          </a>
        </template>
        <template v-else-if="column.key === 'bizEnterprise'">
          <span v-if="record.bizEnterprise?.enterpriseNo">
            [{{ record.bizEnterprise?.enterpriseNo }}] {{ record.bizEnterprise?.enterpriseName }}
          </span>
        </template>
        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
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
    <InstallRegionModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { defineComponent, computed, onMounted, ref, reactive, unref } from 'vue';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import InstallRegionModal from './InstallRegionModal.vue';
  // 接口
  import { installRegionPage, installRegionDelete } from '/@/api/biz/installRegion';

  // data
  import { searchForm, tableColumns } from './installRegion.data';

  const { notification } = useMessage();

  /**
   * 构建registerModal
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: installRegionPage,
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
      // slots: { customRender: 'action' },
      fixed: 'right',
      // fixed: undefined,
      // auth: 'system:application:operation',
    },
  });

  /**
   * 新增
   */
  async function handleCreate() {
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
    await installRegionDelete(record);
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
  async function initDict() {}

  onMounted(() => {
    initDict();
  });
</script>

<style lang="less" scoped></style>
