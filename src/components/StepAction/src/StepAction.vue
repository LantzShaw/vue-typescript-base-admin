<template>
  <a-row :span="24" type="flex" justify="end">
    <a-col class="h-10">
      <a-space>
        <template
          v-if="!currentStep || (commitId && organizationId === commitId && currentStep === '100')"
        >
          <!-- 状态为100，并且存在提交方的公司ID(即代表被驳回)，如果当前账户公司ID等于提交方公司ID则显示驳回提示信息 -->
          <a-typography-text v-if="commitId && organizationId === commitId" type="danger"
            >{{ name }}内容已驳回，请重新提交</a-typography-text
          >

          <a-button
            :loading="submitLoading"
            :disabled="isDisabledCommit"
            @click="submitClickHandler"
            type="primary"
            >{{ submitActionName }}</a-button
          >
        </template>

        <!-- 状态为100，并且提交方的公司ID 不等于 当前账户的公司ID -->
        <template v-if="currentStep === '100' && commitId && organizationId !== commitId">
          <a-typography-text type="danger">{{ name }}已驳回，等待对方重新提交</a-typography-text>
        </template>

        <!-- 状态为150，并且提交方公司ID 等于 当前账户公司ID -->
        <template v-else-if="currentStep === '150' && organizationId === commitId">
          <a-typography-text type="warning">{{ name }}内容确认中，请耐心等待...</a-typography-text>
        </template>

        <!-- 状态为150，并且提交方公司ID 不等于 当前账户公司ID -->
        <template v-else-if="currentStep === '150' && organizationId !== commitId">
          <a-button :loading="rejectLoading" @click="rejectClickHandler" type="error"
            >驳回</a-button
          >
          <a-button
            :loading="confirmLoading"
            :disabled="isDisabledConfirm"
            @click="confirmClickHandler"
            type="success"
            >{{ confirmActionName }}</a-button
          >
        </template>

        <!--  状态为200 -->
        <template v-else-if="currentStep === '200'">
          <a-typography-text type="success">{{ name }}已确认</a-typography-text>
        </template>
      </a-space>
    </a-col>
  </a-row>
  <div class="text-right" v-if="commitPerson && commitDate">
    <span class="font-bold">提交人: </span>
    <span>{{ commitPerson ?? '-' }} {{ commitDate ?? '-' }}</span>
  </div>
  <div class="text-right" v-if="confirmPerson && confirmDate">
    <span class="font-bold">确认人: </span>
    <span>{{ confirmPerson ?? '-' }} {{ confirmDate ?? '-' }}</span>
  </div>
  <div
    v-if="currentStep === '150' && organizationId !== commitId && showTips"
    class="h-12 leading-12"
  >
    <span class="font-bold">
      <Icon icon="ant-design:exclamation-circle-outlined" /> 温馨提示:
    </span>
    <span class="text-gray-500 ml-2"
      >只有前面步骤皆已完成确认，方可<span class="font-bold">确认</span>该步骤</span
    >
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';

  import { Row, Col, Space, TypographyText } from 'ant-design-vue';

  import Icon from '/@/components/Icon/Icon.vue';

  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'StepAction',
    components: {
      ARow: Row,
      ACol: Col,
      ASpace: Space,
      ATypographyText: TypographyText,
      Icon,
    },
    emits: ['on-submit', 'on-reject', 'on-confirm'],
    props: {
      confirmPerson: {
        type: String,
        default: '',
      },
      confirmDate: {
        type: String,
        default: '',
      },
      commitPerson: {
        type: String,
        default: '',
      },
      commitDate: {
        type: String,
        default: '',
      },
      showTips: {
        type: Boolean,
        default: false,
      },
      submitLoading: {
        type: Boolean,
        default: false,
      },
      rejectLoading: {
        type: Boolean,
        default: false,
      },
      confirmLoading: {
        type: Boolean,
        default: false,
      },
      isDisabledConfirm: {
        type: Boolean,
        default: false,
      },
      isDisabledCommit: {
        type: Boolean,
        default: false,
      },
      // 点击确认的公司ID
      confirmId: {
        type: String,
      },
      // 点击提交的公司ID
      commitId: {
        type: String,
      },
      // 当前步骤
      currentStep: {
        type: String,
      },
      // 该步骤的包含状态 - 第一个表示提交, 第二个表示确认, 第三个下一个步骤的提交
      status: {
        type: Array,
        default: ['100', '150', '200'],
      },
      name: {
        type: String,
      },
      submitActionText: {
        type: String,
        default: '提交',
      },
      confirmActionText: {
        type: String,
        default: '确认',
      },
    },
    setup(props, { emit }) {
      const userStore = useUserStore();

      const organizationId = ref<any>(userStore.getOrganizationId);

      const submitActionName = computed(() => {
        return `${props.name}${props.submitActionText}`;
      });

      const confirmActionName = computed(() => {
        return `${props.name}${props.confirmActionText}`;
      });

      const submitClickHandler = () => {
        emit('on-submit', props.status[1]);
      };

      const rejectClickHandler = () => {
        emit('on-reject', props.status[1]);
      };

      const confirmClickHandler = () => {
        emit('on-confirm', props.status[0]);
      };

      return {
        organizationId,
        submitActionName,
        confirmActionName,

        submitClickHandler,
        rejectClickHandler,
        confirmClickHandler,
      };
    },
  });
</script>

<style></style>
