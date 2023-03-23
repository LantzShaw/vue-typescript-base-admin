<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <div class="md:w-1/2">
      <div class="m-4 mr-0 p-2 overflow-hidden bg-white">
        <div class="m-4">
          <a-button
            type="default"
            preIcon="ant-design:plus-outlined"
            class="mr-2"
            @click="handleCreate"
          >
            新增根节点
          </a-button>
          <a-button
            type="default"
            preIcon="ant-design:delete-outlined"
            class="mr-2"
            @click="handleDelete"
          >
            删除
          </a-button>
        </div>
        <BasicTree
          ref="treeRef"
          title="组织列表"
          :checkable="true"
          :checkStrictly="true"
          toolbar
          search
          :clickRowToExpand="false"
          :treeData="treeData"
          :actionList="actionList"
          @select="handleSelect"
        >
          <template #title="item">
            <dict-label :options="orgTypeOptions" :value="item.organizationType" />
            {{ item.title }}
          </template>
        </BasicTree>
      </div>
    </div>

    <div class="md:w-1/2">
      <div class="m-4 mr-0 p-2 overflow-hidden bg-white">
        <BasicForm @register="register" />
        <div class="flex justify-center">
          <a-button @click="resetFields"> 重置 </a-button>
          <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
        </div>
      </div>
    </div>

    <OrgDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted, ref, unref, reactive, h } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
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
  import { useDrawer } from '/@/components/Drawer';
  import OrgDrawer from './OrgDrawer.vue';
  // 接口
  import { orgTree, orgDelete, orgRevised } from '/@/api/system/org';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { isArray } from '/@/utils/is';
  import { orgTypeOptions, treeData, searchForm, tableColumns, inputFormSchemas } from './org.data';

  const { t } = useI18n();
  const { createMessage, notification } = useMessage();
  const searchInfo = reactive<Recordable>({});
  const treeRef = ref<Nullable<TreeActionType>>(null);

  const actionList: TreeActionItem[] = [
    {
      render: (node) => {
        return h(PlusOutlined, {
          class: 'ml-2',
          onClick: () => {},
        });
      },
    },
    {
      render: () => {
        return h(DeleteOutlined);
      },
    },
  ];

  /**
   * 构建registerDrawer
   */

  const [registerDrawer, { openDrawer }] = useDrawer();

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
    return tr;

    ee;
  }

  function handleSubmit() {}

  /**
   * 初始化字典
   */
  async function initDict() {
    const { org_type } = await optionsListBatchApi(['org_type']);
    orgTypeOptions.value = org_type || [];
  }

  onMounted(() => {
    initDict();
    fetchTree();
  });
</script>
