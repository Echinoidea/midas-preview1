import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart,
  ChartOptions,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MyLineChart = () => {
  // X-axis categories
  const categories = ["Low", "Some", "High"];

  // Data for each dataset
  const data = {
    labels: categories, // X-axis
    datasets: [
      {
        label: "MIDAS",
        data: [3, 5, 2], // Number of occurrences for Low, Some, High
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Teacher sub-risk",
        data: [2, 4, 6],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "Student sub-risk",
        data: [4, 3, 5],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Line Distribution Chart",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Risk Levels",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Occurrences",
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default MyLineChart;
