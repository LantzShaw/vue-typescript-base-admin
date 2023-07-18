<template>
  <div> </div>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted, unref, computed } from 'vue';

  import { useGo } from '/@/hooks/web/usePage';
  import { useRoute, useRouter } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { usePermission } from '/@/hooks/web/usePermission';

  const go = useGo();
  const route = useRoute();
  const router = useRouter();
  const { closeCurrent } = useTabs();
  const { hasPermission } = usePermission();
  onMounted(() => {
    if (hasPermission('biz:data-view:view')) {
      window.open(router.resolve('/biz/dataview/home').href, '_blank');
    } else {
      window.open(router.resolve('/biz/dataview/detail').href, '_blank');
    }
    closeCurrent();
  });
</script>
