<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="配置权限"
    width="75%"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <div>
      <BasicTable @register="registerTable">
        <!-- 按钮工具栏 -->
        <template #toolbar>
          <a-button v-if="getSelectRowKeys().length > 0" type="primary" @click="handleBatchBind">
            批量绑定
          </a-button>
          <a-button
            v-if="getSelectRowKeys().length > 0"
            type="primary"
            danger
            @click="handleBatchUnbind"
          >
            批量取消
          </a-button>
        </template>
        <!-- 表格内容 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'url'">
            <a-row type="flex">
              <a-col flex="60px">
                <dict-label :options="requestMethodOptions" :value="record.requestMethod" />
              </a-col>
              <a-col flex="auto">{{ record.url }}</a-col>
            </a-row>
          </template>
          <!-- 表格按钮 -->
          <template v-else-if="column.key === 'action'">
            <TableAction
              stopButtonPropagation
              :actions="[
                {
                  label: '绑定',
                  onClick: handleBind.bind(null, record),
                  ifShow: (_action) => {
                    return !authorityIds.includes(record.id);
                  },
                },
                {
                  color: 'error',
                  label: '取消绑定',
                  onClick: handleUnbind.bind(null, record),
                  ifShow: (_action) => {
                    return authorityIds.includes(record.id);
                  },
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
  import { Row, Col } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable, BasicColumn } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { FormProps } from '/@/components/Form';

  // 接口

  import { optionsListBatchApi } from '/@/api/sys/dict';

  import {
    scopeOwnAuthority,
    scopeBindAuthority,
    scopeUnbindAuthority,
    authorityPage,
  } from '/@/api/authorize/scope';

  const idRef = ref('');

  const authorityIds = ref<any[]>([]);

  const requestMethodOptions = ref<any[]>([]);

  // data

  const ARow = Row;
  const ACol = Col;

  const emit = defineEmits(['success', 'register']);

  const { t } = useI18n();
  const { createMessage, notification } = useMessage();

  const columns: BasicColumn[] = [
    {
      title: '服务接口',
      dataIndex: 'url',
      width: 130,
      align: 'left',
    },
    {
      title: '权限代码',
      dataIndex: 'authorityCode',
      width: 130,
      align: 'left',
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
        label: t('权限代码'),
        field: 'authorityCode',
        component: 'Input',
      },
      {
        label: t('请求方法'),
        field: 'requestMethod',
        component: 'Select',
        componentProps: {
          options: requestMethodOptions,
          allowClear: true,
        },
      },
      {
        label: t('请求URL'),
        field: 'url',
        component: 'Input',
      },
      {
        field: 'bindFlag',
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
      title: '权限列表',
      api: authorityPage,
      rowSelection: {
        type: 'checkbox',
      },
      rowKey: 'id',
      beforeFetch: (params) => {
        params.scopeId = idRef.value || '';
        return params;
      },
      columns: columns,
      formConfig: searchForm,
      useSearchForm: true,
      canResize: false,
      showTableSetting: true,
      clickToRowSelect: false,
      clearSelectOnPageChange: true,
      maxHeight: 300,
      actionColumn: {
        width: 100,
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
      },
    });

  /**
   * 构建registerModal
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    data && onDataReceive(data);
    // 清空表单
    getForm().resetFields();
    reload();
    setModalProps({ loading: false, confirmLoading: false });
  });

  async function onDataReceive(data) {
    idRef.value = data.record.id;
    const res = (await scopeOwnAuthority({ scopeId: data?.record?.id })) || [];
    authorityIds.value = res;
  }

  /**
   * 绑定
   */
  async function handleBind(record: Recordable) {
    await scopeBindAuthority({ scopeId: idRef.value, authorityIds: [record.id] });
    authorityIds.value.push(record.id);
    // clearSelectedRowKeys();
    notification.success({ message: `执行成功` });
    reload();
  }
  /**
   * 解绑
   */
  async function handleUnbind(record: Recordable) {
    await scopeUnbindAuthority({ scopeId: idRef.value, authorityIds: [record.id] });
    // 查询指定位置
    const index = authorityIds.value.findIndex((item) => item === record.id);
    authorityIds.value.splice(index, 1);
    // clearSelectedRowKeys();
    notification.success({ message: `执行成功` });
    reload();
  }

  /**
   * 批量绑定
   */
  async function handleBatchBind() {
    if (getSelectRowKeys().length > 0) {
      await scopeBindAuthority({ scopeId: idRef.value, authorityIds: getSelectRowKeys() });
      authorityIds.value.push(...getSelectRowKeys());
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
      await scopeUnbindAuthority({ scopeId: idRef.value, authorityIds: getSelectRowKeys() });

      let arr = authorityIds.value.filter((item) => {
        return !getSelectRowKeys().includes(item);
      }); //用新的
      authorityIds.value.splice(0, authorityIds.value.length);
      authorityIds.value.push(...arr);

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
    const { request_method } = await optionsListBatchApi(['request_method']);
    requestMethodOptions.value = request_method || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
