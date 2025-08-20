<template>
  <cover-view class="popup-mask" v-if="show" @tap="closePopup">
    <cover-view class="popup-container" @tap.stop>
      <!-- 海报图片 -->
      <cover-image
        class="ad-poster"
        src="../../static/home/ad-plus.jpg"
        mode="aspectFill"
      ></cover-image>

      <!-- 点击体验图片 -->
      <cover-view class="experience-btn" @tap="handleExperience">
        <cover-image src="../../static/ad/footer.png" mode="widthFix"></cover-image>
      </cover-view>

      <!-- 关闭按钮 -->
      <cover-view class="close-btn" @tap="closePopup">×</cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    handleExperience() {
      this.$emit("experience");
    },
  },
};
</script>

<style scoped>
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-container {
  width: 600rpx;
  height: 1000rpx;
  background-color: #fff;
  border-radius: 24rpx;
  position: relative;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.ad-poster {
  width: 100%;
  height: 100%;
}

.experience-btn {
  position: absolute;
  right: 60rpx;
  bottom: 120rpx;
  z-index: 10;
  width: 200rpx;
}

.experience-btn cover-image {
  width: 100%;
  height: auto;
}

.close-btn {
  position: absolute;
  top: calc(100% + 20rpx);
  right: 50%;
  transform: translateX(50%);
  font-size: 50rpx;
  color: #999;
  width: 76rpx;
  height: 76rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
}
</style>