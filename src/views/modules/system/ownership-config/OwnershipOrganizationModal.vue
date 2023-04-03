<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="人员关联的组织机构"
    width="75%"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <div>
      <BasicTable @register="registerTable" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed, onMounted, reactive } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';

  // 公共组件

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';

  // 接口

  import { employeeOrg } from '/@/api/system/employee';

  const idRef = ref('');

  // data

  const emit = defineEmits(['success', 'register']);

  const { t } = useI18n();

  const columns: BasicColumn[] = [
    {
      title: '组织机构名称',
      dataIndex: 'organizationName',
      align: 'center',
    },
  ];

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    api: employeeOrg,
    beforeFetch: (params) => {
      params.id = idRef.value || '';
      return params;
    },
    columns: columns,
    useSearchForm: false,
    canResize: false,
    showTableSetting: false,
    maxHeight: 350,
    pagination: false,
  });

  /**
   * 构建registerModal
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    data && onDataReceive(data);
    // 判断是否是更新

    idRef.value = data.record.id;

    reload();
  });

  function onDataReceive(data) {}

  onMounted(() => {});
</script>
