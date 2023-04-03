<template>
  <div style="background-color: #fff; height: auto; padding: 20px">
    <div style="text-align: right">
      <a-button @click="exportAsPDF">保存为PDF</a-button>
      <a-button @click="onPrint">打印</a-button>
    </div>

    <div style="padding: 16px" id="report">
      <!-- <div class="perpage"> -->
      <div style="height: 100%">
        <div class="flex border-b-2" style="justify-content: space-between">
          <div> 浙江盛基智能科技有限公司 </div>
          <div>
            <span>表单编号: </span>
            <span>LJSJ-IO-FK-001</span>
          </div>
        </div>
        <div class="text-2xl font-extrabold text-center p-8">触发事件处置单</div>
        <div class="ml-2"><span>单 号:</span><span>E123891231EF</span></div>
        <table>
          <thead>
            <tr style="height: 52px">
              <th colspan="4" class="text-base">事件信息</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>所属单位</td>
              <td>浙江兴兴新能源科技有限公司</td>
              <td>信息来源</td>
              <td>应急管理处</td>
            </tr>
            <tr>
              <td>位 号</td>
              <td>XX_1299-2GT2901(丙烯)</td>
              <td>设备名称</td>
              <td>可燃气体报警器</td>
            </tr>
            <tr style="height: 120px">
              <td>异常情况</td>
              <td colspan="3">
                <div class="mb-3">□离线√数据异常□低报□高报</div>
                <div class="text-left">其他：系统显示-0.0883%LEL</div>
              </td>
            </tr>
            <tr>
              <td>触发时间</td>
              <td colspan="3" class="text-left">2022-7-1109:35</td>
            </tr>
            <tr style="height: 52px">
              <td colspan="4" class="font-bold text-base">事件接收</td>
            </tr>
            <tr>
              <td> 使用单位联系人 </td>
              <td colspan="3">梁海超 18067800365</td>
            </tr>
            <tr>
              <td> 维保单位联系人 </td>
              <td colspan="3">符广伟 13758312235</td>
            </tr>
            <tr>
              <td>处置时间</td>
              <td colspan="3" class="text-left">2022-7-11 下午</td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr style="height: 52px">
              <td colspan="3" class="font-bold text-base">事件处置</td>
            </tr>
            <tr style="height: 248px">
              <td class="w-20">1</td>
              <td style="width: 12%">数据复核</td>
              <td colspan="2">
                <div class="mb-3">使用单位GDS系统中显示数据为-0.1%LEL， 与事件触发信息一致</div>
                <div class="text-left">其他：系统显示-0.0883%LEL</div>
              </td>
            </tr>
            <tr style="height: 248px">
              <td class="w-20">2</td>
              <td style="width: 12%">查找原因</td>
              <td colspan="2">
                <div class="mb-3">使用单位GDS系统中显示数据为-0.1%LEL， 与事件触发信息一致</div>
                <div class="text-left">其他：系统显示-0.0883%LEL</div>
              </td>
            </tr>
            <tr style="height: 248px">
              <td class="w-20">3</td>
              <td style="width: 12%">采取措施</td>
              <td colspan="2">
                <div class="mb-3">使用单位GDS系统中显示数据为-0.1%LEL， 与事件触发信息一致</div>
                <div class="text-left">其他：系统显示-0.0883%LEL</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        style="height: 110px; display: flex; align-items: center; justify-content: space-between"
      >
        <div> 发布日期：2018年8月15日 </div>
        <div>第1页/共2页</div>
        <div> 实施日期：2018年09月01日 </div>
      </div>

      <p style="page-break-after: always; margin: 30px"></p>
      <!-- </div> -->

      <!-- <div class="perpage"> -->

      <div class="flex border-b-2 mb-10" style="justify-content: space-between">
        <div> 浙江盛基智能科技有限公司 </div>
        <div>
          <span>表单编号: </span>
          <span>LJSJ-IO-FK-001</span>
        </div>
      </div>
      <!-- <div class="text-2xl font-extrabold text-center p-8">触发事件处置单</div> -->
      <!-- <div class="ml-2"><span>单 号:</span><span>E123891231EF</span></div> -->

      <table>
        <tbody>
          <tr style="height: 290px">
            <td class="w-20">4</td>
            <td style="width: 12%">措施落实</td>
            <td colspan="2">
              <div class="mb-3">使用单位GDS系统中显示数据为-0.1%LEL， 与事件触发信息一致</div>
              <div class="text-left">其他：系统显示-0.0883%LEL</div>
            </td>
          </tr>
          <tr style="height: 290px">
            <td class="w-20">5</td>
            <td style="width: 12%">原因分析</td>
            <td colspan="2">
              <div class="mb-3">使用单位GDS系统中显示数据为-0.1%LEL， 与事件触发信息一致</div>
              <div class="text-left">其他：系统显示-0.0883%LEL</div>
            </td>
          </tr>
          <tr style="height: 290px">
            <td class="w-20">6</td>
            <td style="width: 12%">举一反三</td>
            <td colspan="2">
              <div class="mb-3">使用单位GDS系统中显示数据为-0.1%LEL， 与事件触发信息一致</div>
              <div class="text-left">其他：系统显示-0.0883%LEL</div>
            </td>
          </tr>
          <tr style="height: 52px">
            <td colspan="3" class="font-bold text-base">处置结果</td>
          </tr>
          <tr style="height: 140px">
            <td colspan="3">
              <div>使用单位GDS系统中显示数据为-0.1%LEL， 与事件触发信息一致</div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- <p style="page-break-after: always; margin: 0"></p> -->
      <!-- <table>
        <tbody>
          <tr style="height: 52px">
            <td class="font-bold text-base">处置结果</td>
          </tr>
          <tr style="height: 100px">
            <td>
              <div>使用单位GDS系统中显示数据为-0.1%LEL， 与事件触发信息一致</div>
            </td>
          </tr>
        </tbody>
      </table> -->

      <div
        style="height: 110px; display: flex; align-items: center; justify-content: space-between"
      >
        <div> 发布日期：2018年8月15日 </div>
        <div>第2页/共2页</div>
        <div> 实施日期：2018年09月01日 </div>
      </div>
    </div>
  </div>
  <img :src="imageUri" alt="" srcset="" />
</template>

<script lang="ts" setup>
  import { toPng } from 'html-to-image';
  import printJS from 'print-js';
  import { jsPDF } from 'jspdf';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();
  const route = useRoute();

  const id = ref<string>(route.params?.id as string);

  const imageUri = ref('');

  function goBack() {
    go('/event-trigger/event/list');
  }

  const exportAsPDF = () => {
    toPng(document.querySelector('#report') as HTMLElement).then((dataUrl) => {
      const doc = new jsPDF();

      doc.addImage(dataUrl, 'png', 5, 5, 198, 550);

      doc.addPage([198, 550]);
      doc.addImage(dataUrl, 'png', 5, 5, 198, 550);

      doc.save('事件触发处置单.pdf');
    });
  };

  /**
   * 打印 - 按钮事件
   */
  const onPrint = () => {
    // NOTE: 去除页眉页脚
    // const style = '@page {margin:0 20mm};';

    toPng(document.querySelector('#report') as HTMLElement).then((dataUrl) => {
      imageUri.value = dataUrl;
      const style = '@page {margin:0 20mm,padding:0};';

      printJS({
        printable: dataUrl,
        type: 'image',
        documentTitle: '大衡精密仪器设备管理平台',
        // header: '历史曲线',
        targetStyles: ['*'],
        style,
        imageStyle: 'width:100%;margin-bottom:20px;',
      });
    });

    // html2canvas(document.querySelector('#report') as HTMLElement, {
    //   scale: 2,
    //   allowTaint: true,
    //   useCORS: true,
    // }).then((canvas) => {
    //   console.log('canvas', canvas);

    //   const imgUri = canvas.toDataURL('image/png', 2.0);

    //   imageUri.value = imgUri;

    //   console.log('imgUri', imageUri);

    //   const style = '@page {margin:0 20mm,padding:0};';

    //   // printJS({
    //   //   printable: imgUri,
    //   //   type: 'image',
    //   //   documentTitle: '大衡精密仪器设备管理平台',
    //   //   // header: '历史曲线',
    //   //   targetStyles: ['*'],
    //   //   style,
    //   //   imageStyle: 'width:100%;margin-bottom:20px;padding: 0',
    //   // });
    // });
  };
</script>

<style lang="less" scoped>
  // .report {
  //   position: relative;
  //   top: 0;
  //   left: 0;
  //   box-sizing: border-box;
  // }
  // #report {
  //   font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
  //     Arial, sans-serif;
  // }
  body {
    margin: 0;
    height: auto;
  }

  table,
  td,
  th {
    border: 1px solid #000;
    text-align: center;
    padding: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    // page-break-inside: avoid;
    // page-break-after: avoid;
    // page-break-before: avoid;
    // table-layout: fixed;
    // word-break: break-all;

    // border-spacing: 13;
  }

  td {
    height: 32px;
    line-height: 32px;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }

  .perpage {
    // page-break-before: always;
    page-break-after: always;
  }
</style>
