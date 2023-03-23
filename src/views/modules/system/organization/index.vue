<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <div class="bg-white m-4 mr-2 overflow-hidden md:w-1/3">
      <OrganizationLeftTree
        ref="leftTree"
        @select="onTreeSelect"
        @root-tree-data="onRootTreeData"
      />
    </div>

    <div class="bg-white m-4 ml-2 overflow-hidden md:w-2/3">
      <div class="m-4">
        <a-tabs v-show="departData != null" defaultActiveKey="base-info">
          <a-tab-pane tab="基本信息" key="base-info" forceRender style="position: relative">
            <div style="padding: 20px">
              <OrganizationFormTab
                :data="departData"
                :rootTreeData="rootTreeData"
                :dataItemStatusOptions="dataItemStatusOptions"
                :organizationTypeOptions="organizationTypeOptions"
                @success="onSuccess"
              />
            </div>
          </a-tab-pane>
          <a-tab-pane tab="部门权限" key="role-info">
            <div style="padding: 0 20px 20px">
              <OrganizationMenuTab :data="departData" @success="onSuccess" />
            </div>
          </a-tab-pane>
        </a-tabs>
        <div v-show="departData == null" style="padding-top: 40px">
          <a-empty description="尚未选择部门" />
        </div>
      </div>
    </div>

    <OrganizationModal @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted, ref, unref, reactive, h } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { Empty } from 'ant-design-vue';

  const AEmpty = Empty;

  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTree,
    TreeItem,
    TreeActionType,
    TreeActionItem,
    ContextMenuItem,
  } from '/@/components/Tree/index';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import OrganizationModal from './OrganizationModal.vue';
  import OrganizationLeftTree from './components/OrganizationLeftTree.vue';
  import OrganizationFormTab from './components/OrganizationFormTab.vue';
  import OrganizationMenuTab from './components/OrganizationMenuTab.vue';

  // 接口
  import { orgTree, orgDelete, orgRevised } from '/@/api/system/org';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { isArray } from '/@/utils/is';
  import {
    dataItemStatusOptions,
    organizationTypeOptions,
    treeData,
    searchForm,
    tableColumns,
    inputFormSchemas,
  } from './org.data';

  const { t } = useI18n();
  const { createMessage, notification } = useMessage();
  const searchInfo = reactive<Recordable>({});
  const treeRef = ref<Nullable<TreeActionType>>(null);

  // 给子组件定义一个ref变量
  const leftTree = ref();

  // 当前选中的部门信息
  const departData = ref({});
  const rootTreeData = ref<any[]>([]);

  /**
   * 构建registerDrawer
   */

  const [registerModal, { openModal }] = useModal();

  const [register, { validate, resetFields }] = useForm({
    size: 'large',
    baseColProps: { span: 24 },
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas: inputFormSchemas,
  });

  /**
   * 树节点选中
   */
  function handleSelect(keys) {
    searchInfo.id = keys[0];
    reload();
  }

  /**
   * 新增
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  /**
   * 新增下级
   */
  function handleCreateChild(record: Recordable) {
    openModal(true, {
      parentId: record.id,
      record,
      isUpdate: false,
    });
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
   * 复制
   */
  function handleCopy(record: Recordable) {
    openModal(true, {
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
  function handleDelete() {
    const keys = getTreeCheckedKeys();
    if (keys.length <= 0) {
      createMessage.warning('请选择要操作的数据');
    }

    // await orgDelete(record);
    // notification.success({ message: `执行成功` });
    // handleSuccess(record);
  }

  function getTreeCheckedKeys() {
    let ids: Array<any> = [];
    const ks = getTree().getCheckedKeys();
    if (isArray(ks)) {
      for (const k of ks as Array<any>) {
        ids.push(k);
      }
    } else {
      for (const k of ks.checked as Array<any>) {
        ids.push(k);
      }
    }
    return ids;
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
    fetchTree();
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

  function handleSubmit() {}
  // 左侧树选择后触发
  function onTreeSelect(data) {
    departData.value = data;
  }

  // 左侧树rootTreeData触发
  function onRootTreeData(data) {
    rootTreeData.value = data;
  }

  function onSuccess() {
    leftTree.value.loadRootTreeData();
  }
  /**
   * 初始化字典
   */
  async function initDict() {
    const { organization_type, data_item_status } = await optionsListBatchApi([
      'organization_type',
      'data_item_status',
    ]);
    organizationTypeOptions.value = organization_type || [];
    dataItemStatusOptions.value = data_item_status || [];
  }

  onMounted(() => {
    initDict();
    fetchTree();
  });
</script>

<script lang="ts">
  import { Divider, Descriptions, Steps, Tabs, Card } from 'ant-design-vue';

  export default defineComponent({
    components: {
      PageWrapper,
      [Divider.name]: Divider,
      [Card.name]: Card,

      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
      [Tabs.name]: Tabs,
      [Tabs.TabPane.name]: Tabs.TabPane,
    },
  });
</script>
