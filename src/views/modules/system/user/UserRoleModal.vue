<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="绑定角色"
    width="80%"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <div>
      <BasicTable @register="registerTable">
        <!-- 按钮工具栏 -->
        <template #toolbar>
          <a-button
            v-if="getSelectRowKeys().length > 0"
            type="primary"
            danger
            @click="handleBatchBind"
          >
            批量绑定
          </a-button>

          <a-button v-if="getSelectRowKeys().length > 0" type="primary" @click="handleBatchUnbind">
            批量取消
          </a-button>
        </template>
        <!-- 表格内容 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <dict-label :options="dataItemStatusOptions" :value="record.status" />
          </template>
          <template v-else-if="column.key === 'action'">
            <TableAction
              stopButtonPropagation
              :actions="[
                {
                  label: '绑定',
                  onClick: handleBind.bind(null, record),
                  ifShow: () => record.bindUserFlag === '0',
                },
                {
                  label: '取消绑定',
                  color: 'error',
                  onClick: handleUnbind.bind(null, record),
                  ifShow: () => record.bindUserFlag === '1',
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, unref, computed, onMounted, reactive } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  // 公共组件

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable, BasicColumn } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { FormProps } from '/@/components/Form';

  // 接口
  import { fileShow } from '/@/api/system/file';
  import { optionsListBatchApi } from '/@/api/sys/dict';

  import { rolePage, roleDelete } from '/@/api/system/role';
  import { userOwnRole, userBindRole, userUnbindRole, userRolePage } from '/@/api/system/user';
  const idRef = ref('');

  const roleIds = reactive([] as any[]);

  const dataItemStatusOptions = ref<any[]>([]);

  const tfOptions = ref<any[]>([]);

  // data

  const emit = defineEmits(['success', 'register']);

  const { t } = useI18n();
  const { createMessage, notification } = useMessage();

  const columns: BasicColumn[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 130,
      align: 'center',
    },
    {
      title: '角色标识',
      dataIndex: 'roleCode',
      width: 130,
      align: 'center',
    },
    {
      title: t('状态'),
      dataIndex: 'status',
      width: 90,
      align: 'center',
    },
  ];

  /**
   *  查询表单字段
   */
  const searchForm: FormProps = {
    baseColProps: { lg: 8, md: 8 },
    labelWidth: 90,
    schemas: [
      {
        label: t('角色名称'),
        field: 'roleName',
        component: 'Input',
      },
      {
        label: t('角色标识'),
        field: 'roleCode',
        component: 'Input',
      },
      {
        field: 'bindUserFlag',
        component: 'RadioButtonGroup',
        label: '范围',
        componentProps: {
          options: [
            {
              label: '全部',
              value: '',
            },
            {
              label: '已绑定',
              value: '1',
            },
            {
              label: '未绑定',
              value: '0',
            },
          ],
        },
        defaultValue: '',
      },
    ],
  };

  /**
   * 构建registerTable
   */
  const [registerTable, { setLoading, getForm, reload, getSelectRowKeys, clearSelectedRowKeys }] =
    useTable({
      title: '',
      api: userRolePage,
      rowSelection: {
        type: 'checkbox',
      },
      rowKey: 'id',
      beforeFetch: (params) => {
        params.userId = idRef.value || '';
        return params;
      },
      columns: columns,
      formConfig: searchForm,
      useSearchForm: true,
      canResize: false,
      showTableSetting: true,
      clickToRowSelect: false,
      clearSelectOnPageChange: true,
      maxHeight: 350,
      actionColumn: {
        width: 100,
        title: '操作',
        dataIndex: 'action',
        fixed: undefined,
      },
    });

  /**
   * 构建registerModal
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    data && onDataReceive(data);
    // 判断是否是更新

    idRef.value = data.record.id;
    const res = (await userOwnRole({ userId: data?.record?.id })) || [];
    roleIds.push(...res);
    reload();
  });

  function onDataReceive(data) {
    console.log('Data Received', data);
  }

  /**
   * 绑定
   */
  async function handleBind(record: Recordable) {
    await userBindRole({ userId: idRef.value, roleIds: [record.id] });
    roleIds.push(record.id);
    // clearSelectedRowKeys();
    notification.success({ message: `执行成功` });
    reload();
  }
  /**
   * 解绑
   */
  async function handleUnbind(record: Recordable) {
    await userUnbindRole({ userId: idRef.value, roleIds: [record.id] });
    // 查询指定位置
    const index = roleIds.findIndex((item) => item === record.id);
    roleIds.splice(index, 1);
    // clearSelectedRowKeys();
    notification.success({ message: `执行成功` });
    reload();
  }

  /**
   * 批量绑定
   */
  async function handleBatchBind() {
    if (getSelectRowKeys().length > 0) {
      await userBindRole({ userId: idRef.value, roleIds: getSelectRowKeys() });
      roleIds.push(...getSelectRowKeys());
      clearSelectedRowKeys();
      notification.success({ message: `执行成功` });
      reload();
    } else {
      createMessage.warning('请选择要操作的数据');
    }
  }
  /**
   * 批量解绑
   */
  async function handleBatchUnbind() {
    if (getSelectRowKeys().length > 0) {
      await userUnbindRole({ userId: idRef.value, roleIds: getSelectRowKeys() });

      let arr = roleIds.filter((item) => {
        return !getSelectRowKeys().includes(item);
      }); //用新的
      roleIds.splice(0, roleIds.length);
      roleIds.push(...arr);

      clearSelectedRowKeys();
      notification.success({ message: `执行成功` });
      reload();
    } else {
      createMessage.warning('请选择要操作的数据');
    }
  }

  /**
   * 提交表单
   */

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
