import { BarElement, CategoryScale, Chart, ChartOptions, Legend, LinearScale, Title, Tooltip } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export const donutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
};
