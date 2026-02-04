<template>
  <l-echart ref="chart" v-bind="$attrs" @finished="handleFinished">
    <slot></slot>
  </l-echart>
</template>

<script>
import lEchart from './lime-echart/components/l-echart/l-echart.vue'

export default {
  name: 'LEchart',
  components: {
    lEchart
  },
  emits: ['finished'],
  methods: {
    handleFinished(instance) {
      this.$emit('finished', instance)
    }
  }
}
</script>