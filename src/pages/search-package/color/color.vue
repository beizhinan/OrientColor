<template>
  <view class="content">
    <color-search></color-search>
  </view>
</template>

<script>
import colorSearch from "@/components/search/color-search/color-search.vue";

export default {
  components: {
    colorSearch
  },
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>

<style>
.content {
  background-color: #f1e9d8;
  height: 100%;
}
</style>