import { EChartsOption } from 'echarts';
import { BasicColumn } from '/@/components/Table';

export const baseOption: EChartsOption = {
  backgroundColor: '#fff',
  animation: false, // NOTE: 如果不设置该属性，折线、柱状等内容将失效,
  tooltip: {
    trigger: 'axis',
    // formatter: '{b} -> {c}',
    axisPointer: {
      type: 'cross',
      label: {
        show: true,
        backgroundColor: '#333',
      },
    },
  },
  legend: {
    data: [],
    textStyle: {
      color: '#ccc',
    },
  },
  xAxis: {
    data: [],
    axisLine: {
      lineStyle: {
        color: '#ccc',
      },
    },
  },
  yAxis: {
    splitLine: { show: false },
    axisLine: {
      lineStyle: {
        color: '#ccc',
      },
    },
  },
  dataZoom: {
    show: true,
    start: 0,
    end: 100,
  },
  series: [],
};

export const mapData: any = [
  {
    name: '北京',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '天津',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '上海',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
];

export const getLineData = (() => {
  const category: any[] = [];
  let dottedBase = +new Date();
  const lineData: any[] = [];
  const barData: any[] = [];

  for (let i = 0; i < 20; i++) {
    const date = new Date((dottedBase += 1000 * 3600 * 24));
    category.push([date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'));
    const b = Math.random() * 200;
    const d = Math.random() * 200;
    barData.push(b);
    lineData.push(d + b);
  }
  return { barData, category, lineData };
})();

export const columns: BasicColumn[] = [
  {
    title: '数据',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '更新时间',
    dataIndex: 'beginTime',
  },
];

export const data: any[] = (() => {
  const arr: any[] = [];
  for (let index = 0; index < 3; index++) {
    arr.push({
      id: `${index}`,
      name: `${index} John Brown`,
      age: `${index + 10}`,
      no: `${index}98678`,
      address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
      beginTime: new Date().toLocaleString(),
      endTime: new Date().toLocaleString(),
    });
  }
  return arr;
})();

// ["ID", "姓名", "年龄", "编号", "地址", "开始时间", "结束时间"]
export const arrHeader = columns.map((column) => column.title);
// [["ID", "姓名", "年龄", "编号", "地址", "开始时间", "结束时间"],["0", "0 John Brown", "10", "098678"]]
export const arrData = data.map((item) => {
  return Object.keys(item).map((key) => item[key]);
});
