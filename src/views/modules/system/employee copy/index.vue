<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <div class="bg-white m-4 mr-2 overflow-hidden w-1/4 xl:w-1/5">
      <OrganizationLeftTree ref="leftTree" @select="onTreeSelect" @on-change="onTreeChange" />
    </div>

    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button
          v-auth="'system:org:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>
      <template #firstColumn="{ record }">
        <a @click="handleEdit(record)" :title="record.realName">
          {{ record.realName }}
        </a>
      </template>
      <template #orgType="{ record }">
        <dict-label :options="orgTypeOptions" :value="record.type" />
      </template>
      <template #status="{ record }">
        <dict-label :options="dataItemStatusOptions" :value="record.status" />
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: t('编辑'),
              onClick: handleEdit.bind(null, record),
              auth: 'system:org:edit',
            },
            {
              icon: 'ant-design:paper-clip-outlined',
              tooltip: t('绑定角色'),
              onClick: handleBindRole.bind(null, record),
              auth: 'system:user:add',
            },
            {
              icon: 'ant-design:copy-outlined',
              tooltip: t('复制'),
              color: 'warning',
              onClick: handleCopy.bind(null, record),
              auth: 'system:org:add',
            },
            {
              icon: 'ant-design:appstore-add-outlined',
              tooltip: t('新增下级'),
              onClick: handleCreateChild.bind(null, record),
              auth: 'system:org:add',
            },
            {
              icon: 'ant-design:delete-outlined',
              tooltip: t('删除'),
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              auth: 'system:org:delete',
            },
          ]"
        />
      </template>
    </BasicTable>

    <EmployeeDrawer @register="registerDrawer" @success="handleSuccess" />
    <UserRoleModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { defineComponent, onMounted, ref, unref, reactive } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import EmployeeDrawer from './EmployeeDrawer.vue';

  import { useModal } from '/@/components/Modal';
  import UserRoleModal from './UserRoleModal.vue';
  import OrganizationLeftTree from './components/OrganizationLeftTree.vue';

  // 接口
  import { orgTree, orgDelete, orgRevised } from '/@/api/system/org';

  import { userPage, userPageWithOrganization } from '/@/api/system/user';

  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { dataItemStatusOptions, treeData, searchForm, tableColumns } from './employee.data';
</script>
<script lang="ts">
  import { Divider, Empty, Descriptions, Steps, Tabs, Card, Row, Col } from 'ant-design-vue';

  const { t } = useI18n();
  const { notification } = useMessage();

  const searchInfo = reactive<Recordable>({});
  const treeRef = ref<Nullable<TreeActionType>>(null);

  // 当前选中的部门信息
  const organizationId = ref('');
  const departData = ref({});
  const childrenFlag = ref<boolean>(false);

  /**
   * 构建registerDrawer
   */

  const [registerDrawer, { openDrawer }] = useDrawer();
  /**
   * registerModal
   */
  const [registerModal, { openModal }] = useModal();
  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '员工列表',
    api: userPageWithOrganization,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,

    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    },
  });

  // 左侧树选择后触发
  function onTreeSelect(data) {
    organizationId.value = data;
    searchInfo.organizationId = data;
    reload();
  }

  function onTreeChange(data) {
    childrenFlag.value = data;
    searchInfo.containChildren = data;
    reload();
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
    await orgRevised();
    notification.success({ message: `执行成功` });
  }
  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await orgDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess(record);
  }

  /**
   * 绑定角色
   */
  function handleBindRole(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: false,
    });
  }

  /**
   * 加载树
   */
  async function fetchTree() {
    treeData.value = (await orgTree({})) as unknown as TreeItem[];
  }

  /**
   * 执行成功
   */
  function handleSuccess(record: Recordable) {
    // fetchTree();
    reload();
  }

  /**
   * 获取树
   */
  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }

  /**
   * 初始化字典
   */
  async function initDict() {
    const { data_item_status } = await optionsListBatchApi(['data_item_status']);
    dataItemStatusOptions.value = data_item_status || [];
  }

  onMounted(() => {
    initDict();
    fetchTree();
  });

  export default defineComponent({
    components: {
      ACard: Card,
      ARow: Row,
      ACol: Col,
      BasicTable,
      PageWrapper,
      [Divider.name]: Divider,
      [Card.name]: Card,
      Empty,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
      [Tabs.name]: Tabs,
      [Tabs.TabPane.name]: Tabs.TabPane,
    },
  });
</script>
