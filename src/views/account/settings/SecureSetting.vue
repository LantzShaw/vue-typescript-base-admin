<template>
  <CollapseContainer title="安全设置" :canExpan="false">
    <List>
      <template v-for="item in list" :key="item.key">
        <ListItem>
          <ListItemMeta>
            <template #title>
              {{ item.title }}
              <div class="extra" v-if="item.extra">
                <a @click="handleAction(item.key)" :title="item.extra">
                  {{ item.extra }}
                </a>
              </div>
            </template>
            <template #description>
              <div>{{ item.description }}</div>
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
    <ChangePasswordModal @register="registerModal" />
  </CollapseContainer>
</template>
<script lang="ts">
  import { List } from 'ant-design-vue';
  import { defineComponent } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { CollapseContainer } from '/@/components/Container/index';
  import { useModal } from '/@/components/Modal';
  import ChangePasswordModal from './ChangePasswordModal.vue';

  import { secureSettingList } from './data';

  export default defineComponent({
    components: {
      CollapseContainer,
      List,
      ListItem: List.Item,
      ListItemMeta: List.Item.Meta,
      ChangePasswordModal,
    },
    setup() {
      const go = useGo();

      const [registerModal, { openModal }] = useModal();

      function handleAction(key) {
        if (key === '1') {
          // go('/account/modPwd');
          openModal(true, {
            isUpdate: true,
          });
        } else {
          // alert();
        }
      }

      return {
        list: secureSettingList,
        handleAction,
        registerModal,
        openModal,
      };
    },
  });
</script>
<style lang="less" scoped>
  .extra {
    float: right;
    margin-top: 10px;
    margin-right: 30px;
    font-weight: normal;
    color: #1890ff;
    cursor: pointer;
  }
</style>
