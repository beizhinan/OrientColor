<template>
  <view class="content">
    <image-search></image-search>
  </view>
</template>

<script>
import imageSearch from "@/components/search/image-search/image-search.vue";

export default {
  components: {
    imageSearch
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