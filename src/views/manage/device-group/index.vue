<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button type="primary" preIcon="ant-design:sync-outlined" @click="handleSync">
          同步数据
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'groupName'">
          <a @click="handleEdit(record)" :title="record.groupName">
            {{ record.groupName }}
          </a>
        </template>
        <template v-else-if="column.key === 'bizEnterprise'">
          <span v-if="record.bizEnterprise?.enterpriseNo">
            [{{ record.bizEnterprise?.enterpriseNo }}] {{ record.bizEnterprise?.enterpriseName }}
          </span>
        </template>
        <!-- 表格按钮 -->
      </template>
    </BasicTable>
    <DeviceGroupModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import DeviceGroupModal from './DeviceGroupModal.vue';
  // 接口
  import { deviceGroupPage, deviceGroupSync } from '/@/api/manage/deviceGroup';
  // data
  import { searchForm, tableColumns } from './deviceGroup.data';

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
    api: deviceGroupPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
  });

  /**
   * 新增
   */
  async function handleSync() {
    await deviceGroupSync();
    notification.success({ message: `执行成功` });
    handleSuccess();
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
