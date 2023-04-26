<template>
  <div>
    asdasd

    <iframe
      id="iframe"
      frameborder="no"
      style="width: 100%; height: 100%"
      scrolling="auto"
    ></iframe>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';

  // 接口
  import { rolePage, roleDelete } from '/@/api/system/role';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  const src = ref('/ureport/preview?_u=database:77.ureport.xml');

  function populateIframe(iframe, headers) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/ureport/preview?_u=database:77.ureport.xml');
    xhr.responseType = 'blob';
    headers.forEach((header) => {
      xhr.setRequestHeader(header[0], header[1]);
    });
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          iframe.src = URL.createObjectURL(xhr.response);
        }
      }
    };
    xhr.send();
  }
  onMounted(() => {
    var iframe = document.querySelector('#iframe');
    populateIframe(iframe, [
      [
        'Authorization',
        'Bearer tgS4UYzFyQWorYGN3LXlXjHbtUXMgWzTswG3zHYk65Up06dXFkk45YAQi3pBu0E86s5bmMWGak_RB4qdSYC0QMLZ7PH6mURgL-jlbFSXehPsazoON4q1y_AZCmbGu3Re',
      ],
    ]);
  });
</script>
