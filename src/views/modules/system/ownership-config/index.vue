<template>
  <PageWrapper
    :title="`配置人员归属[` + organization.organizationName + `]`"
    contentFullHeight
    dense
    @back="goBack"
  >
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-if="getSelectRowKeys().length > 0"
          type="primary"
          danger
          @click="handleBatchBind"
        >
          批量分配
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'gender'">
          <dict-label :options="genderOptions" :value="record.gender" />
        </template>
        <template v-else-if="column.key === 'identity'">
          <dict-label :options="identityOptions" :value="record.identity" />
        </template>
        <template v-else-if="column.key === 'associateOrganizationNum'">
          <a @click="handleEdit(record)" :title="record.associateOrganizationNum">
            {{ record.associateOrganizationNum }}
          </a>
        </template>
      </template>
    </BasicTable>
    <OwnershipOrganizationModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, ref, h, reactive, unref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  // 组件

  import { DictLabel } from '/@/components/DictLabel/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import OwnershipOrganizationModal from './OwnershipOrganizationModal.vue';
  // 接口
  import { organizationForm } from '/@/api/system/organization';

  import { employeePageWithUnassigned, employeeAllocatable } from '/@/api/system/employee';

  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { identityOptions, genderOptions, searchForm, tableColumns } from './ownershipConfig.data';

  const go = useGo();
  const { closeCurrent } = useTabs();
  const { t } = useI18n();

  const organization = ref<Recordable>({});
  const { notification, createConfirm } = useMessage();
  const { currentRoute } = useRouter();
  const route = useRoute();

  // 通过路由获取字典code

  const organizationId = unref(currentRoute).params?.organizationId ?? '';

  const searchInfo = reactive<Recordable>({});

  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { setLoading, getForm, reload, getSelectRowKeys, clearSelectedRowKeys }] =
    useTable({
      api: employeePageWithUnassigned,
      rowSelection: {
        type: 'checkbox',
      },
      rowKey: 'id',
      beforeFetch: (params) => {
        params.organizationId = organizationId;
        return params;
      },

      columns: tableColumns,
      formConfig: searchForm,
      useSearchForm: true,
      canResize: false,
      showTableSetting: true,
      clickToRowSelect: false,
      clearSelectOnPageChange: true,
    });

  function goBack() {
    const path = unref(currentRoute).path;
    var paths = path.split('/config/');
    closeCurrent();
    go(paths[0]);
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
  async function handleBatchBind() {
    if (getSelectRowKeys().length > 0) {
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('确认分配')),
        onOk: async () => {
          await employeeAllocatable({
            organizationId: organizationId,
            ids: getSelectRowKeys(),
          });

          notification.success({ message: `执行成功` });
          handleSuccess();
        },
      });
    }
  }

  function handleSuccess() {
    reload();
  }
  async function getDepartmentInfo() {
    organization.value = ((await organizationForm({ id: organizationId })) || {}) as Recordable;
  }

  /**
   * 初始化字典
   */
  async function initDict() {
    const { identity, gender } = await optionsListBatchApi(['identity', 'gender']);
    identityOptions.value = identity || [];
    genderOptions.value = gender || [];
  }

  onMounted(() => {
    getDepartmentInfo();
    initDict();
  });
</script>
