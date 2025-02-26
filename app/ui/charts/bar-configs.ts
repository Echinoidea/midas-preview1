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

export const stackedBarOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'x',
  datasets: {
    bar: {
      barPercentage: 0.7
    }
  },
  plugins: {
    datalabels: {
      color: "#404040",
      formatter: function(value) {

        // Hide the label if it is less than 2.5%
        if (value < 0.025) {
          return null;
        }
        else {
          return (value * 100).toFixed(1) + '%';
        }
      },
      font: {
        weight: 'bold',
        family: 'Nunito, sans-serif',
        size: 18,
      }
    },

    legend: {
      position: 'top' as const,
      display: false
    },
    title: {
      display: false,
      text: 'Stacked Bar Chart',
    },
    tooltip: {
      backgroundColor: "#262626",
      callbacks: {
        label: function(context) {
          const label = context.dataset.label || '';
          // Tell TypeScript that context.raw is a number
          const value = context.raw as number;
          return label + ': ' + (value * 100).toFixed(1) + '%';
        }
      },
      bodyFont: {
        size: 20, // Increase the font size for a bigger tooltip
      },
      titleFont: {
        size: 0, // Increase the title font size, if needed
      },
      padding: 12, // Add extra padding for a larger tooltip area
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        drawOnChartArea: false,
      },
    },
    y: {
      stacked: true,
      title: {
        display: false
      },
      max: 1,
      ticks: {
        display: false
      },
      border: {
        display: true
      },
      display: false
    },
  },
  layout: {
    padding: {
      top: 10,
      right: 0,
      bottom: 5,
      left: 0,
    },
  },
};
