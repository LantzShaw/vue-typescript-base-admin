<template>
  <div :class="getWrapClass">
    <div class="vab-tabs-left-panel">
      <Tabs
        type="editable-card"
        size="small"
        :animated="false"
        :hideAdd="true"
        :tabBarGutter="3"
        :activeKey="activeKeyRef"
        @change="handleChange"
        @edit="handleEdit"
      >
        <template v-for="item in getTabsState" :key="item.query ? item.fullPath : item.path">
          <TabPane :closable="!(item && item.meta && item.meta.affix)">
            <template #tab>
              <TabContent :tabItem="item" />
            </template>
          </TabPane>
        </template>

        <template #rightExtra v-if="getShowRedo || getShowQuick">
          <TabRedo v-if="getShowRedo" />
          <TabContent isExtra :tabItem="$route" v-if="getShowQuick" />
          <FoldButton v-if="getShowFold" />
        </template>
      </Tabs>
    </div>
    <div class="vab-tabs-right-panel">
      <Dropdown>
        <template #overlay>
          <Menu @click="handleClick">
            <MenuItem key="closeOthersTabs">
              <a>关闭其他</a>
            </MenuItem>
            <MenuItem key="closeLeftTabs">
              <a>关闭左侧</a>
            </MenuItem>
            <MenuItem key="closeRightTabs">
              <a>关闭右侧</a>
            </MenuItem>
            <MenuItem key="closeAllTabs">
              <a>关闭全部</a>
            </MenuItem>
          </Menu>
        </template>
        <a-button style="margin-left: 8px">
          更多
          <DownOutlined />
        </a-button>
      </Dropdown>
    </div>
  </div>
</template>
<script lang="ts">
  import type { RouteLocationNormalized, RouteMeta } from 'vue-router';

  import { defineComponent, computed, unref, ref } from 'vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { Tabs, Dropdown, Menu } from 'ant-design-vue';
  import TabContent from './components/TabContent.vue';
  import FoldButton from './components/FoldButton.vue';
  import TabRedo from './components/TabRedo.vue';

  import { useGo } from '/@/hooks/web/usePage';

  import { useMultipleTabStore } from '/@/store/modules/multipleTab';
  import { useUserStore } from '/@/store/modules/user';

  import { initAffixTabs, useTabsDrag } from './useMultipleTabs';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';

  import { REDIRECT_NAME } from '/@/router/constant';
  import { listenerRouteChange } from '/@/logics/mitt/routeChange';

  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'MultipleTabs',
    components: {
      DownOutlined,
      TabRedo,
      FoldButton,
      Tabs,
      TabPane: Tabs.TabPane,
      TabContent,
      Dropdown,
      Menu,
      MenuItem: Menu.Item,
    },
    setup() {
      const affixTextList = initAffixTabs();
      const activeKeyRef = ref('');

      useTabsDrag(affixTextList);
      const tabStore = useMultipleTabStore();
      const userStore = useUserStore();
      const router = useRouter();

      const { prefixCls } = useDesign('multiple-tabs');
      const go = useGo();
      const { getShowQuick, getShowRedo, getShowFold } = useMultipleTabSetting();

      const getTabsState = computed(() => {
        return tabStore.getTabList.filter((item) => !item.meta?.hideTab);
      });

      const unClose = computed(() => unref(getTabsState).length === 1);

      const getWrapClass = computed(() => {
        return [
          prefixCls,
          {
            [`${prefixCls}--hide-close`]: unref(unClose),
          },
        ];
      });

      listenerRouteChange((route) => {
        const { name } = route;
        if (name === REDIRECT_NAME || !route || !userStore.getToken) {
          return;
        }

        const { path, fullPath, meta = {} } = route;
        const { currentActiveMenu, hideTab } = meta as RouteMeta;
        const isHide = !hideTab ? null : currentActiveMenu;
        const p = isHide || fullPath || path;
        if (activeKeyRef.value !== p) {
          activeKeyRef.value = p as string;
        }

        if (isHide) {
          const findParentRoute = router
            .getRoutes()
            .find((item) => item.path === currentActiveMenu);

          findParentRoute && tabStore.addTab(findParentRoute as unknown as RouteLocationNormalized);
        } else {
          tabStore.addTab(unref(route));
        }
      });

      function handleChange(activeKey: any) {
        activeKeyRef.value = activeKey;
        go(activeKey, false);
      }
      function handleClick({ key }) {}

      // Close the current tab
      function handleEdit(targetKey: string) {
        // Added operation to hide, currently only use delete operation
        if (unref(unClose)) {
          return;
        }

        tabStore.closeTabByKey(targetKey, router);
      }
      return {
        getWrapClass,
        handleEdit,
        handleChange,
        handleClick,
        activeKeyRef,
        getTabsState,
        getShowQuick,
        getShowRedo,
        getShowFold,
      };
    },
  });
</script>
<style lang="less">
  @import './index.less';
</style>
