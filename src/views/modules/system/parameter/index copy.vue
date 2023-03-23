<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-auth="'system:config:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'id'"> ID: {{ record.id }} </template>
        <template v-if="column.key === 'organizationName'">
          ID: {{ record.organizationName }}
        </template>
      </template>

      <template #firstColumn="{ record }">
        <a @click="handleEdit(record)" :title="record.parameterName">
          {{ record.parameterName }}
        </a>
      </template>

      <template #internalFlag="{ record }">
        <dict-label :options="tfOptions" :value="record.internalFlag" />
      </template>

      <template #parameterType="{ record }">
        <dict-label :options="parameterTypeOptions" :value="record.parameterType" />
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: t('编辑'),
              onClick: handleEdit.bind(null, record),
              auth: 'system:config:edit',
            },
            {
              icon: 'ant-design:copy-outlined',
              tooltip: t('复制'),
              color: 'warning',
              onClick: handleCopy.bind(null, record),
              auth: 'system:config:add',
            },
            {
              icon: 'ant-design:delete-outlined',
              tooltip: t('删除'),
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              auth: 'system:config:delete',
            },
          ]"
        />
      </template>
    </BasicTable>
    <ConfigDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useDrawer } from '/@/components/Drawer';
  import ConfigDrawer from './ConfigDrawer.vue';
  // 接口
  import { configPage, configDelete } from '/@/api/system/config';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { parameterTypeOptions, tfOptions, searchForm, tableColumns } from './config.data';

  const { t } = useI18n();
  const { notification } = useMessage();

  /**
   * 构建registerDrawer
   */
  const [registerDrawer, { openDrawer }] = useDrawer();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: configPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
      auth: 'system:config:operation',
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
    await configDelete(record);
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
    const { tf, parameter_type } = await optionsListBatchApi(['tf', 'parameter_type']);
    tfOptions.value = tf || [];
    parameterTypeOptions.value = parameter_type || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
