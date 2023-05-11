<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="触发记录"
    width="80%"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <div>
      <BasicTable @register="registerTable">
        <!-- 表格内容 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'dtuipTriggerContent'">
            <span v-html="record.dtuipTriggerContent"></span>
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

  import { optionsListBatchApi } from '/@/api/sys/dict';

  import { deviceAlarmPage } from '/@/api/biz/deviceAlarm';

  const alarmSnNo = ref('');

  const dataItemStatusOptions = ref<any[]>([]);

  const tfOptions = ref<any[]>([]);

  // data

  const emit = defineEmits(['success', 'register']);

  const { t } = useI18n();
  const { createMessage, notification } = useMessage();

  const columns: BasicColumn[] = [
    {
      title: '报警时间',
      dataIndex: 'dtuipTriggerDate',
      width: 100,
      align: 'center',
    },
    {
      title: '触发值',
      dataIndex: 'dtuipTriggerVal',
      width: 90,
      align: 'center',
    },
    {
      title: t('报警内容'),
      dataIndex: 'dtuipTriggerContent',
      width: 120,
      align: 'center',
    },
  ];

  /**
   *  查询表单字段
   */
  const searchForm: FormProps = {
    baseColProps: { lg: 6, md: 8 },
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
    ],
  };

  /**
   * 构建registerTable
   */
  const [registerTable, { setLoading, getForm, reload, getSelectRowKeys, clearSelectedRowKeys }] =
    useTable({
      title: '',
      api: deviceAlarmPage,
      beforeFetch: (params) => {
        params.alarmSnNo = alarmSnNo.value || '';
        return params;
      },
      defSort: {
        field: 'dtuipTriggerDate',
        order: 'ascend',
      },
      columns: columns,
      formConfig: searchForm,
      useSearchForm: false,
      canResize: false,
      showTableSetting: true,
      clickToRowSelect: false,
      clearSelectOnPageChange: true,
      maxHeight: 350,
    });

  /**
   * 构建registerModal
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    data && onDataReceive(data);
    // 判断是否是更新

    alarmSnNo.value = data.record.alarmSnNo;

    reload();
  });

  function onDataReceive(data) {
    console.log('Data Received', data);
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
