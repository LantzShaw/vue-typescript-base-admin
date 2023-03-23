<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="字典回收站"
    width="60%"
    :showCancelBtn="false"
    :showOkBtn="false"
    @visible-change="handleVisibleChange"
  >
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'ant-design:retweet-outlined',
              tooltip: t('字典恢复'),
              onClick: handleRecovery.bind(null, record),
            },
            {
              icon: 'ant-design:delete-twotone',
              tooltip: t('彻底删除'),
              popConfirm: {
                title: '是否确认彻底删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 公共组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  // 接口
  import { dictDeleteList, dictRecovery, dictDeletePhysic } from '/@/api/system/dict';
  // data
  import { tableColumns2 } from './dict.data';

  const emit = defineEmits(['success', 'register']);

  const { t } = useI18n();
  const { notification } = useMessage();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: dictDeleteList,
    columns: tableColumns2,
    useSearchForm: false,
    canResize: true,
    showTableSetting: true,
    pagination: false,
    maxHeight: 300,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  /**
   * 构建registerModal
   */
  const [registerModal, {}] = useModalInner(() => {
    reload();
  });

  /**
   * 恢复
   */
  async function handleRecovery(record: Recordable) {
    await dictRecovery(record);
    notification.success({ message: `执行成功` });
    reload();
  }

  /**
   * 彻底删除
   */
  async function handleDelete(record: Recordable) {
    await dictDeletePhysic(record);
    notification.success({ message: `执行成功` });
    reload();
  }

  /**
   * modal状态监听
   */
  function handleVisibleChange(visible: boolean) {
    // 打开modal
    if (visible) {
    } else {
      // 关闭modal，执行success方法
      emit('success');
    }
  }
</script>
