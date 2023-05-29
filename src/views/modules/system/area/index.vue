<template>
  <PageWrapper title="标准行政区划库" contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'system:area:revised'"
          type="primary"
          danger
          preIcon="ant-design:interaction-outlined"
          @click="handleRevised"
        >
          校正层级深度
        </a-button>
        <a-button
          v-auth="'system:area:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'id'">
          <a @click="handleEdit(record)" :title="record.name">
            [{{ record.id }}] {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'levelCode'">
          <dict-label :options="areaLevelOptions" :value="record.levelCode" />
        </template>
        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'system:area:edit',
              },
              {
                label: '复制',
                color: 'warning',
                onClick: handleCopy.bind(null, record),
                auth: 'system:area:add',
              },
              {
                label: '新增下级',
                onClick: handleCreateChild.bind(null, record),
                auth: 'system:area:add',
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'system:area:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <AreaDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted, ref, unref, reactive } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useDrawer } from '/@/components/Drawer';
  import AreaDrawer from './AreaDrawer.vue';
  // 接口
  import { areaList, areaDelete, areaRevised } from '/@/api/system/area';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { areaLevelOptions, tableColumns } from './area.data';

  const { t } = useI18n();
  const { notification } = useMessage();

  /**
   * 构建registerDrawer
   */

  const [registerDrawer, { openDrawer }] = useDrawer();

  /**
   * 构建registerTable
   */
  const [registerTable, { setLoading, reload, updateTableDataRecord }] = useTable({
    title: '',
    api: areaList,
    rowKey: 'id',
    onExpand: handleOnExpand,
    columns: tableColumns,
    useSearchForm: false,
    canResize: false,
    showTableSetting: true,
    isTreeTable: true,
    pagination: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  function handleOnExpand(expande: boolean, record) {
    if (!expande) return; //如果是关闭就返回
    if (record.children && record.children.length > 0) return; //如果已经有数据就返回
    const id = record.id;
    setLoading(true);
    areaList({ parentId: id })
      .then((data) => {
        record.children = data;
        updateTableDataRecord(id, record);
      })
      .finally(() => {
        setLoading(false);
      });
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
    await areaRevised();
    notification.success({ message: `执行成功` });
  }
  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await areaDelete(record);
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
   * 初始化字典
   */
  async function initDict() {
    const { area_level } = await optionsListBatchApi(['area_level']);
    areaLevelOptions.value = area_level || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
<script lang="ts">
  export default defineComponent({
    // 需要和路由的name一致
    name: 'AreaPage',
  });
</script>
