<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <div class="enter-x">
      <iframe
        id="iframe"
        ref="frame"
        scrolling="no"
        frameborder="0"
        width="300px"
        height="300px"
        :src="qrCodeUrl"
      ></iframe>
      <Divider class="enter-x">{{ t('sys.login.scanSign') }}222</Divider>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </div>
  </template>
</template>
<script lang="ts" setup>
  import { computed, unref, onMounted } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Button, Divider } from 'ant-design-vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, LoginStateEnum } from './useLogin';

  const qrCodeUrl =
    'https://login.dg-work.cn//oauth2/auth.htm?response_type=code&client_id=smartsite_dingoa&redirect_uri=http://localhost:8847/base/test/list3&scope=get_user_info&authType=QRCODE&embedMode=true';

  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.DING_QR_CODE);

  onMounted(() => {
    window.addEventListener('message', function (event) {
      // 这里的event.data 就是登录成功的信息
      // 数据格式：{ "code": "aaaa", "state": "bbbb" }
      // alert(JSON.stringify(event.data));
    });
  });
</script>
