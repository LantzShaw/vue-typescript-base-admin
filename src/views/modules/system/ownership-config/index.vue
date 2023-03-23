<template>
  <PageWrapper :title="`配置人员归属`" contentFullHeight dense @back="goBack">
    <template #headerContent>
      <a-descriptions :column="1">
        <a-descriptions-item label="单位名称">
          {{ organization.organizationName }}
        </a-descriptions-item>
        <a-descriptions-item label="部门名称">
          {{ department.departmentName }}
        </a-descriptions-item>
      </a-descriptions>
    </template>

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
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, computed, onMounted, ref, h, reactive, unref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  // 组件
  import { Descriptions } from 'ant-design-vue';

  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';

  // 接口
  import { orgForm } from '/@/api/system/org';
  import { departmentForm } from '/@/api/system/department';
  import { employeePageWithUnassigned, employeeAllocatable } from '/@/api/system/employee';

  import { menuTree, menuDelete, menuRevised } from '/@/api/system/menu';
  import { applicationSelect } from '/@/api/system/application';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { identityOptions, tfOptions, genderOptions, searchForm, tableColumns } from './menu.data';

  const ADescriptions = Descriptions;
  const ADescriptionsItem = Descriptions.Item;
  const go = useGo();
  const { closeCurrent } = useTabs();
  const { t } = useI18n();

  const department = ref<Recordable>({});
  const organization = ref<Recordable>({});
  const { notification, createConfirm } = useMessage();
  const { currentRoute } = useRouter();
  const route = useRoute();

  // 通过路由获取字典code
  const departmentId = unref(currentRoute).params?.departmentId ?? '';
  const organizationId = unref(currentRoute).params?.organizationId ?? '';
  const dictCode = unref(currentRoute).query?.code ?? '';
  const title = unref(currentRoute).query?.title ?? '';

  const searchInfo = reactive<Recordable>({});
  const treeRef = ref<Nullable<TreeActionType>>(null);

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
        params.departmentId = departmentId;
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
    go(paths[0]);
    closeCurrent();
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
            departmentId: departmentId,
            organizationId: organizationId,
            ids: getSelectRowKeys(),
          });

          notification.success({ message: `执行成功` });
          handleSuccess();
        },
      });
    }
    reload();
  }

  function handleSuccess() {
    reload();
  }
  async function getDepartmentInfo() {
    organization.value = ((await orgForm({ id: organizationId })) || {}) as Recordable;
    department.value = ((await departmentForm({ id: departmentId })) || {}) as Recordable;
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
