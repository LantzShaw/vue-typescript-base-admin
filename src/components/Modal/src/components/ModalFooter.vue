<template>
  <div>
    <slot name="insertFooter"></slot>
    <a-button v-bind="cancelButtonProps" @click="handleCancel" v-if="showCancelBtn">
      <Icon icon="ant-design:close-outlined" />
      {{ cancelText }}
    </a-button>
    <slot name="centerFooter"></slot>
    <a-button
      :type="okType"
      @click="handleOk"
      :loading="confirmLoading"
      v-bind="okButtonProps"
      v-if="showOkBtn && getOkAuth"
    >
      <Icon icon="ant-design:check-outlined" />
      {{ okText }}
    </a-button>
    <slot name="appendFooter"></slot>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { basicProps } from '../props';

  export default defineComponent({
    name: 'BasicModalFooter',
    components: { Icon },
    props: basicProps,
    emits: ['ok', 'cancel'],
    setup(props, { emit }) {
      const { hasPermission } = usePermission();

      const getOkAuth = computed(() => {
        return hasPermission(props.okAuth);
      });

      function handleOk(e: Event) {
        emit('ok', e);
      }

      function handleCancel(e: Event) {
        emit('cancel', e);
      }

      return { getOkAuth, handleOk, handleCancel };
    },
  });
</script>
