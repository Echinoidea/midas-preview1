import { ResponsivePie } from '@nivo/pie';
import { Doughnut } from 'react-chartjs-2';
import { RiskLevelCategory } from './risk-level-category-type';
import { Chart, registerables } from 'chart.js';
import { donutOptions } from './donut-config';
import { DemographicsType } from './demographics-type';

Chart.register(...registerables);

export function DonutChart({
  data,
  colors
}: {
  data: DemographicsType[],
  colors: string[]
}) {

  const formattedData = {
    labels: data.map(demographic => demographic.label),
    datasets: [{
      label: 'Demographics',
      data: data.map(d => d.value),
      backgroundColor: colors
    }]
  };
  

  return (
    <Doughnut data={formattedData} options={donutOptions}/> 
  )
}
