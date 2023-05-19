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
