import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { stackedBarOptions } from './midas-bars-config';

Chart.register(...registerables);

function MidasBarChart({
  midasData,
  studentData,
  teacherData
}: {
  midasData: RiskPercentage;
  studentData: RiskPercentage;
  teacherData: RiskPercentage;
}) {
  const formattedData = {
    labels: ["MIDAS", "Student", "Teacher"],
    datasets: [
      {
        label: "Low Risk",
        data: [
          midasData.low / 100,
          studentData.low / 100,
          teacherData.low / 100,
        ],
        backgroundColor: "#4ade80",
      },
      {
        label: "Some Risk",
        data: [
          midasData.some / 100,
          studentData.some / 100,
          teacherData.some / 100,
        ],
        backgroundColor: "#fde047",
      },
      {
        label: "High Risk",
        data: [
          midasData.high / 100,
          studentData.high / 100,
          teacherData.high / 100,
        ],
        backgroundColor: "#fb7185",
      },
    ],
  };

  return (
    <Bar data={formattedData} options={stackedBarOptions} />
  );
}

export default MidasBarChart;
