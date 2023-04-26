<template>
  <PageWrapper contentFullHeight fixedHeight>
    <a-layout>
      <a-layout-sider style=" margin-right: 16px;background: #fff" width="300">
        <a-card title="权限模块" class="mosd">
          <template #extra>
            <a-button type="text" @click="onCreatePermModuleClick">
              <template #icon><PlusCircleOutlined /></template>
            </a-button>
          </template>
          <div :style="getWrapStyle">
            <ScrollContainer>
              <BasicTree
                :default-expand-all="false"
                :selected-keys="selectedKeys"
                :treeData="treeData"
                :actionList="actionList"
                @select="handleSelect"
              />
            </ScrollContainer>
          </div>
        </a-card>
      </a-layout-sider>
      <a-layout-content style="background: #fff">
        <BasicTable @register="registerTable" :searchInfo="searchInfo">
          <!-- 按钮工具栏 -->
          <template #toolbar>
            <a-button
              v-auth="'system:dict:add'"
              type="primary"
              preIcon="ant-design:plus-outlined"
              @click="handleCreate"
            >
              新增
            </a-button>
          </template>
          <!-- 表格内容 -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'title'">
              <a @click="handleEdit(record)" :title="record.title">
                {{ record.title }}
              </a>
            </template>

            <!-- 表格按钮 -->
            <template v-else-if="column.key === 'action'">
              <TableAction
                stopButtonPropagation
                :actions="[
                  {
                    label: '编辑',
                    onClick: handleEdit.bind(null, record),
                    auth: 'system:dict:edit',
                  },

                  {
                    label: '删除',
                    color: 'error',
                    popConfirm: {
                      title: '是否确认删除',
                      confirm: handleDelete.bind(null, record),
                    },
                    auth: 'system:dict:delete',
                  },
                ]"
              />
            </template>
          </template>
        </BasicTable>
      </a-layout-content>
    </a-layout>

    <AuthorityModuleDrawer @register="registerDrawer" @success="loadRootTreeData" />
    <AuthorityModuleModal @register="registerAuthorityModuleModal" @success="loadRootTreeData" />
    <AuthorityModal @register="registerAuthorityModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import type { CSSProperties } from 'vue';
  import { onMounted, computed, ref, unref, h, reactive } from 'vue';
  // hooks

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useWindowSizeFn } from '@vben/hooks';
  import { useLayoutHeight } from '/@/layouts/default/content/useContentViewHeight';

  // 组件
  import { BasicTree, TreeActionItem, ContextMenuItem } from '/@/components/Tree/index';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { ScrollContainer } from '/@/components/Container/index';
  import { PlusCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { Input, Layout, Card, Tree, Button } from 'ant-design-vue';
  import { useDrawer } from '/@/components/Drawer';
  import AuthorityModuleDrawer from './AuthorityModuleDrawer.vue';

  import { useModal } from '/@/components/Modal';
  import AuthorityModuleModal from './AuthorityModuleModal.vue';
  import AuthorityModal from './AuthorityModal.vue';

  // 接口
  import { authorityModuleDelete, authorityModuleTree } from '/@/api/system/authorityModule';
  import { authorityPage, authorityDelete, authorityTree } from '/@/api/system/authority';

  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { dictCategoryOptions, searchForm, tableColumns } from './authority.data';
  // 部门树列表数据
  const loading = ref<boolean>(false);
  const treeData = ref<any[]>([]);
  // 当前选中的项
  const checkedKeys = ref<any[]>([]);
  // 当前展开的项
  const expandedKeys = ref<any[]>([]);
  // 当前选中的项
  const selectedKeys = ref<any[]>([]);
  // 树组件重新加载
  const treeReloading = ref<boolean>(false);
  const { t } = useI18n();
  const actionList: TreeActionItem[] = [
    {
      // show:()=>boolean;
      show: (record) => {
        if (record.moduleType === '2') {
          return false;
        } else {
          return true;
        }
      },
      render: (node) => {
        return h(PlusCircleOutlined, {
          class: 'ml-2',
          onClick: () => {
            handleCreateChildModule(node);
          },
        });
      },
    },
    {
      // show:()=>boolean;
      render: (node) => {
        return h(FormOutlined, {
          class: 'ml-2',
          onClick: () => {
            handleEditModule(node);
          },
        });
      },
    },
    {
      // show:()=>boolean;
      render: (node) => {
        return h(DeleteOutlined, {
          class: 'ml-2 mr-2',
          onClick: () => {
            createConfirm({
              iconType: 'info',
              title: () => h('span', t('sys.app.logoutTip')),
              content: () => h('span', t('是否删除此模块?')),
              onOk: async () => {
                console.log('node', node);
                await authorityModuleDelete({ id: node.id });
                notification.success({ message: `执行成功` });
                loadRootTreeData();
              },
            });
          },
        });
      },
    },
  ];

  const ALayout = Layout;

  const ASider = Layout.Sider;
  const AContent = Layout.Content;
  const AFooter = Layout.Footer;
  const ACard = Card;
  const ATree = Tree;
  const AButton = Button;
  const searchInfo = reactive<Recordable>({});
  const topRef = ref(50);
  const heightRef = ref(window.innerHeight);
  const { headerHeightRef } = useLayoutHeight();

  const { createConfirm, notification } = useMessage();
  const { hasPermission } = usePermission();

  /**
   * 构建registerDrawer
   */
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerAuthorityModuleModal, { openModal: openAuthorityModuleModal }] = useModal();
  const [registerAuthorityModal, { openModal: openAuthorityModal }] = useModal();
  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: authorityPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: true,
    showTableSetting: true,
    showIndexColumn: true,
    resizeHeightOffset: 32,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'system:application:operation',
    },
  });

  async function loadRootTreeData() {
    try {
      loading.value = true;
      treeData.value = [];
      checkedKeys.value = [];
      expandedKeys.value = [];
      const result = await authorityTree();
      if (Array.isArray(result)) {
        treeData.value = result;
      }
    } finally {
      loading.value = false;
    }
  }

  function onCreatePermModuleClick() {
    openAuthorityModuleModal(true, {
      isUpdate: false,
    });
  }

  // 菜单选中
  function handleSelect(keys: string[]) {
    searchInfo.moduleId = keys[0];
    reload();
  }

  /**
   * 新增
   */
  function handleCreateChildModule(record: Recordable) {
    openAuthorityModuleModal(true, {
      parentId: record.id,
      isUpdate: false,
    });
  }

  /**
   * 编辑
   */
  function handleEditModule(record: Recordable) {
    openAuthorityModuleModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 删除
   */
  async function handleDeleteModule(record: Recordable) {
    await authorityModuleDelete(record);
    notification.success({ message: `执行成功` });
    loadRootTreeData();
  }

  /**
   * 新增
   */
  function handleCreate() {
    openAuthorityModal(true, {
      isUpdate: false,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openAuthorityModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await authorityDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    reload();
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { dict_category } = await optionsListBatchApi(['dict_category']);

    dictCategoryOptions.value = dict_category || [];
  }

  onMounted(() => {
    initDict();
    loadRootTreeData();
  });

  useWindowSizeFn(calcHeight, 150, { immediate: true });

  const getWrapStyle = computed((): CSSProperties => {
    console.log('unref(heightRef)', unref(heightRef));
    return {
      height: `${unref(heightRef)}px`,
    };
  });

  function calcHeight() {
    console.log('clientHeight123', document.documentElement.clientHeight);
    const top = headerHeightRef.value;
    console.log('top', top);
    topRef.value = top;
    heightRef.value = window.innerHeight - top - 163;
    console.log('heightRef', heightRef);
    const clientHeight = document.documentElement.clientHeight - top - 163;
    console.log('clientHeight', clientHeight);
  }

  // const getWrapStyle = computed(() => {
  //   const clientHeight = document.documentElement.clientHeight - top;
  //   const wrapper = unref(wrapperRef);
  //   console.log('123', wrapper['getContentStyle']['minHeight']);
  //   const h = wrapper['getContentStyle']['minHeight'];
  //   console.log('123ss', h);
  //   return {
  //     h,
  //   };
  // });
</script>
<style lang="less" scoped>
  .scroll-wrap {
    // width: 50%;
    height: calc(869px - 35px);
    background-color: @component-background;
  }

  .ssss {
    height: calc(100% - 35px);
  }

  .ant-card-head {
    padding: 0 15px;
    border-bottom: 1px solid #ebeef5;
    font-size: 14px;
  }

  .mosd :deep(.ant-card-body) {
    padding: 5px 0 0;
  }

  .vben-basic-table-form-container {
    padding: 0 0 0 16px;
  }

  .module-node-item {
    width: 100%;
    // height: 35px;
    // line-height: 35px;
  }

  .module-node-menu {
    float: right;
    // width: 56px;
  }

  .module-node-menu.group {
    // width: 84px;
  }

  .module-node-text {
    width: 100%;
    // margin-right: 56px;
  }

  .module-node-text.group {
    // margin-right: 84px;
  }
</style>
