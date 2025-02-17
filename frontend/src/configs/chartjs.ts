import { Chart } from 'chart.js';

export const configureChartJS = () => {
  Chart.overrides.pie.animation = { duration: 500, animateRotate: false, animateScale: false };
  Chart.overrides.pie.borderColor = '#000';
  Chart.overrides.line.interaction = { intersect: false, mode: 'x' } as any;
  Chart.overrides.line.animation = { duration: 500 };
};
