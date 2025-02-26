import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { stackedBarOptions } from './bar-configs';

Chart.register(...registerables);

function formatLabel(label: string): string {
  // Normalize the label for comparison
  const lowerLabel = label.toLowerCase();
  if (lowerLabel === 'ell') return 'ELL';
  if (lowerLabel === 'nonell') return 'Non-ELL';
  return label.at(0)?.toUpperCase() + label.slice(1)
}

function MyBarChart({
  data
}: {
  data: Record<string, RiskPercentage>;
}) {
  const formattedData = {
    labels: Object.keys(data).map(formatLabel),
    datasets: [
      {
        label: "Low Risk",
        data: Object.values(data).map(risk => risk.low / 100),
        backgroundColor: "#4ade80",
      },
      {
        label: "Some Risk",
        data: Object.values(data).map(risk => risk.some / 100),
        backgroundColor: "#fde047",
      },
      {
        label: "High Risk",
        data: Object.values(data).map(risk => risk.high / 100),
        backgroundColor: "#fb7185",
      },
    ],
  };

  return (
    <Bar data={formattedData} options={stackedBarOptions} className='' />
  );
}

export default MyBarChart;
