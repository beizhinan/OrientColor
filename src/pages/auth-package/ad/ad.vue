<template>
  <view class="ad-container">
    <image
      class="ad-poster"
      src="/static/ad/ad-poster.jpg"
      :style="imageStyle"
      mode="aspectFill"
      @click="goToHome"
    ></image>

    <view class="experience-btn" @click="goToHome">
      <image src="/static/ad/footer.png" mode="widthFix"></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      windowHeight: 0
    };
  },
  computed: {
    imageStyle() {
      return {
        width: '100vw',
        height: `${this.windowHeight}px`
      };
    }
  },
  mounted() {
    // 获取窗口高度
    const res = uni.getSystemInfoSync();
    this.windowHeight = res.windowHeight;
  },
  methods: {
    goToHome() {
      uni.switchTab({
        url: "/pages/index/index"
      });
    }
  }
};
</script>

<style scoped>
.ad-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
}

.ad-poster {
  display: block;
}

.experience-btn {
  position: fixed;
  right: 50rpx;
  bottom: 120rpx;
  z-index: 10;
  width: 200rpx;
}

.experience-btn image {
  width: 100%;
  height: auto;
}
</style>