import { EChartsOption } from 'echarts';

export const baseOption: EChartsOption = {
  tooltip: {
    trigger: 'item',
  },
  color: ['#1D75F0', '#FF701A', '#FFEA00', '#FFEA00', '#00A8FF', '#3FFFEA', '#00E436', '#78FF00'],
  legend: {
    icon: 'circle',
    orient: 'vertical',
    left: 'right',
    top: 'middle',
    align: 'left',
    textStyle: {
      color: '#fff',
    },
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

// [["ID", "姓名", "年龄", "编号", "地址", "开始时间", "结束时间"],["0", "0 John Brown", "10", "098678"]]
export const arrData = data.map((item) => {
  return Object.keys(item).map((key) => item[key]);
});
