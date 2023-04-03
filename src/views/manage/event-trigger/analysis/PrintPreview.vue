<template>
  <PageWrapper dense contentFullHeight>
    <div>
      <a-button @click="onPrint">Print</a-button>
    </div>

    <History />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import printJS from 'print-js';

  import { PageWrapper } from '/@/components/Page';
  import History from './History.vue';

  const someJSONdata = [
    {
      name: 'John Doe',
      email: 'john@doe.com',
      phone: '111-111-1111',
    },
    {
      name: 'Barry Allen',
      email: 'barry@flash.com',
      phone: '222-222-2222',
    },
    {
      name: 'Cool Dude',
      email: 'cool@dude.com',
      phone: '333-333-3333',
    },
  ];

  function onPrint() {
    printJS({
      printable: someJSONdata,
      type: 'json',
      properties: ['name', 'email', 'phone'],
      header: '<h3 class="custom-h3">My custom header</h3>',
      style: '.custom-h3 { color: red; }',
    });
  }
</script>

<style></style>
