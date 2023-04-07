<template>
  <a-row :span="24" type="flex" justify="end">
    <!-- <template v-if="maintainerOrgIdList.includes(organizationId)"> -->
    <a-col>
      <a-space>
        <template
          v-if="!currentStep || (commitId && organizationId === commitId && currentStep === '100')"
        >
          <a-typography-text v-if="commitId && organizationId === commitId" type="danger"
            >{{ name }}内容已驳回，请重新提交</a-typography-text
          >

          <a-button @click="submitClickHandler" type="primary">{{ submitActionName }}</a-button>
        </template>

        <template v-if="currentStep === '100' && commitId && organizationId !== commitId">
          <a-typography-text type="danger">{{ name }}已驳回，等待对方重新提交</a-typography-text>
        </template>

        <template v-else-if="currentStep === '150' && organizationId === commitId">
          <a-typography-text type="warning">{{ name }}内容确认中，请耐心等待...</a-typography-text>
        </template>

        <template v-else-if="currentStep === '150' && organizationId !== confirmId">
          <a-button @click="rejectClickHandler" type="error">驳回</a-button>
          <a-button @click="confirmClickHandler" type="success">{{ confirmActionName }}</a-button>
        </template>
        <template v-else-if="currentStep === '200'">
          <a-typography-text type="success">{{ name }}已确认</a-typography-text>
        </template>
      </a-space>
    </a-col>
    <!-- </template> -->

    <!-- <template v-else-if="externalUserOrgIdList.includes(organizationId)">
      <a-col>
        <a-space>
          <template v-if="!currentStep || currentStep === '100'">
            <a-button @click="submitClickHandler" type="primary">{{ submitActionName }}</a-button>
          </template>
          <template v-else-if="currentStep === '150' && organizationId === commitId">
            <a-typography-text type="warning"
              >{{ name }}内容确认中，请耐心等待...</a-typography-text
            >
          </template>
          <template v-else-if="currentStep === '150' && organizationId !== confirmId">
            <a-button @click="rejectClickHandler" type="error">驳回</a-button>
            <a-button @click="confirmClickHandler" type="success">{{ confirmActionName }}</a-button>
          </template>
          <template v-else-if="currentStep === '200'">
            <a-typography-text type="success">{{ name }}已确认</a-typography-text>
          </template>
        </a-space>
      </a-col>
    </template> -->
  </a-row>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';

  import { Row, Col, Space, TypographyText } from 'ant-design-vue';

  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'StepAction',
    components: {
      ARow: Row,
      ACol: Col,
      ASpace: Space,
      ATypographyText: TypographyText,
    },
    props: {
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

      const maintainerOrgIdList = userStore.getMaintainerOrgIdList || [];
      const externalUserOrgIdList = userStore.getExternalUserOrgIdList || [];

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
        maintainerOrgIdList,
        externalUserOrgIdList,

        submitClickHandler,
        rejectClickHandler,
        confirmClickHandler,
      };
    },
  });
</script>

<style></style>
