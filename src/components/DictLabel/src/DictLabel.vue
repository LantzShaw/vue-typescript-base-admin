<template>
  <div class="dict-label">
    <template v-for="(item, index) in options" :key="item.value">
      <!-- 值存在 -->
      <template v-if="values.includes(item.value)">
        <!-- tag -->
        <template v-if="item.extendObj?.cssClass?.startsWith('tag ')">
          <Tag :key="index" :color="item.extendObj?.cssClass?.substring(4)" :title="item.title">
            <Icon
              v-if="props.icon && item.icon && item.icon != ''"
              :icon="item.icon"
              class="pr-1"
            />
            {{ item.title }}
          </Tag>
        </template>
        <!-- badge -->
        <template v-else-if="item.extendObj?.cssClass?.startsWith('badge ')">
          <Icon v-if="props.icon && item.icon && item.icon != ''" :icon="item.icon" class="pr-1" />
          <Badge
            :key="index"
            :status="
              item.extendObj?.cssClass === 'badge error'
                ? 'error'
                : item.extendObj?.cssClass === 'badge success'
                ? 'success'
                : item.extendObj?.cssClass === 'badge warning'
                ? 'warning'
                : item.extendObj?.cssClass === 'badge processing'
                ? 'processing'
                : 'default'
            "
            :text="item.title"
            :title="item.title"
          />
        </template>
        <!-- span -->
        <template v-else>
          <span
            :key="index"
            :class="item.extendObj?.cssClass"
            :style="item.extendObj?.cssStyle"
            :title="item.title"
          >
            <Icon
              v-if="props.icon && item.icon && item.icon != ''"
              :icon="item.icon"
              class="pr-1"
            />
            {{ item.title }}
          </span>
        </template>
      </template>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { Tag, Badge } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { propTypes } from '/@/utils/propTypes';
  import { computed } from 'vue';
  const props = defineProps({
    // 数据
    options: {
      type: Array as any,
      default: null,
    },
    // 当前的值
    value: [Number, String, Array],
    // 是否显示icon
    icon: propTypes.bool.def(true),
  });

  const values = computed(() => {
    if (props.value !== null && typeof props.value !== 'undefined') {
      return Array.isArray(props.value) ? props.value : [String(props.value)];
    } else {
      return [];
    }
  });
</script>
