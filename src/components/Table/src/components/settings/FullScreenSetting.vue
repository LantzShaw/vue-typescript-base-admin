<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('component.table.settingFullScreen') }}</span>
    </template>
    <FullscreenOutlined @click="toggle" style="font-size: 70%" v-if="!isFullscreen" />
    <FullscreenExitOutlined @click="toggle" style="font-size: 70%" v-else />
  </Tooltip>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';
  import { useFullscreen } from '@vueuse/core';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';

  export default defineComponent({
    name: 'FullScreenSetting',
    components: {
      FullscreenExitOutlined,
      FullscreenOutlined,
      Tooltip,
    },

    setup() {
      const table = useTableContext();
      const { t } = useI18n();
      const { toggle, isFullscreen } = useFullscreen(table.wrapRef);

      return {
        toggle,
        isFullscreen,
        t,
      };
    },
  });
</script>
