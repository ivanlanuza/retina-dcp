"use client"

import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
}

const generateRandomData = (count) => Array.from({ length: count }, () => Math.floor(Math.random() * 100))

const labels = ["January", "February", "March", "April", "May", "June", "July"]

export function BarChart() {
  const data = {
    labels,
    datasets: [
      {
        label: "% compliance",
        data: generateRandomData(labels.length),
        backgroundColor: "rgba(99, 102, 241, 0.9)",
      },
    ],
  }

  return <Bar options={options} data={data} />
}

export function LineChart() {
  const data = {
    labels,
    datasets: [
      {
        label: "% compliance",
        data: generateRandomData(labels.length),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.9)",
      },
    ],
  }

  return <Line options={options} data={data} />
}

