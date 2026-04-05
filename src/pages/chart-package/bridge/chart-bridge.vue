// pages/chart-package/chart-bridge.vue
<template>
  <l-echart ref="chart" :custom-style="chartStyleStr" type="2d"></l-echart>
</template>

<script setup>
import { ref } from 'vue'
import lEchart from '../uni_modules/lime-echart/components/l-echart/l-echart.vue'

const chart = ref(null)
const chartStyleStr = "width: 100%; height: 300px;"

defineExpose({
  chart
})
</script>