<template>
  <PageWrapper contentFullHeight>
    <a-card :bordered="false" :loading="loading">
      <a-spin :spinning="loading" />
    </a-card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, Ref, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Spin, Card } from 'ant-design-vue';
  import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
  import { SocialSource, AccessPrincipal } from '/@/api/sys/model/socialModel';
  import { useUserStore } from '/@/store/modules/user';
  import { isEmpty } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  const ASpin = Spin;
  const ACard = Card;

  const loading = ref(false);

  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();

  const route = useRoute();

  const userStore = useUserStore();
  const source = ref() as Ref<SocialSource>;
  const accessPrincipal = ref({}) as Ref<AccessPrincipal>;

  const getAccessPrincipal = (
    source: SocialSource,
    route: RouteLocationNormalizedLoaded,
  ): AccessPrincipal => {
    if (route && !isEmpty(route.query)) {
      switch (source) {
        case 'WXAPP':
          break;
        default:
          accessPrincipal.value.code = route.query.code as string;
          accessPrincipal.value.state = route.query.state as string;
          break;
      }
    }

    return accessPrincipal.value;
  };

  const initParams = () => {
    if (route && !isEmpty(route.params) && route.params.source) {
      source.value = route.params.source as SocialSource;
      getAccessPrincipal(source.value, route);

      console.log(source.value);
      console.log(accessPrincipal.value);
    }
  };

  onMounted(async () => {
    initParams();
    if (accessPrincipal.value.state) {
      try {
        loading.value = true;
        const userInfo = await userStore.socialLogin(source.value, accessPrincipal.value, {
          mode: 'none', //不要默认的错误提示
        });
        if (userInfo) {
          notification.success({
            message: t('sys.login.loginSuccessTitle'),
            description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
            duration: 3,
          });
        }
      } catch (error) {
        createErrorModal({
          title: t('sys.api.errorTip'),
          content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
          getContainer: () => document.body,
        });
      } finally {
        loading.value = false;
      }
    }
  });
</script>
