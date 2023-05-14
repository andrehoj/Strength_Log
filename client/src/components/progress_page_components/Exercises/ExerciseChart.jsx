import { Paper } from "@mantine/core";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Total Weight",
    },
  },
};

export const ExerciseChart = ({ exerciseData }) => {
  const labels = exerciseData.labels;
  const dataSets = exerciseData.dataSets;

  function getDateRange(startDate, endDate) {
    console.log(startDate, endDate)
  }

  getDateRange(labels[0], labels[labels.length - 1]);

  var data = {
    labels,
    datasets: dataSets,
  };

  if (exerciseData) {
    return (
      <Paper>
        <Line options={options} data={data} />
      </Paper>
    );
  }
};
