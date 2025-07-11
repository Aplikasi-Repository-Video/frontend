<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

defineProps({
  chartData: Object,
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: 'gray',
      },
    },
    x: {
      ticks: {
        color: 'gray',
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: 'gray',
      },
    },
  },
}
</script>

<style scoped>
div {
  height: 300px;
}
</style>
