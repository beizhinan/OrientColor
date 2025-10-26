<template>
  <view class="video-player-container">
    <view class="video-content">
      <video
        v-if="videoSrc"
        :src="videoSrc"
        class="video-element"
        controls
        autoplay
        show-fullscreen-btn
        show-play-btn
        enable-progress-gesture
        object-fit="contain"
        @error="onVideoError"
      ></video>

      <view v-else class="no-video">
        <text class="no-video-text">暂无视频内容</text>
      </view>
    </view>

    <view class="back-button" @click="goBack">
      <text class="back-text">返回</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      videoSrc: "",
      title: "",
    };
  },

  onLoad(options) {
    // 获取传递的参数
    if (options.videoSrc) {
      this.videoSrc = decodeURIComponent(options.videoSrc);
    }

    if (options.title) {
      this.title = decodeURIComponent(options.title);
    }
  },

  methods: {
    onVideoError(e) {
      console.error("视频播放出错:", e);
      uni.showToast({
        title: "视频播放出错",
        icon: "none",
      });
    },

    goBack() {
      uni.navigateBack();
    },
  },
};
</script>

<style scoped>
.video-player-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #000;
}

.video-header {
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.video-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.video-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-element {
  width: 100%;
  height: 420rpx;
}

.no-video {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 420rpx;
}

.no-video-text {
  font-size: 28rpx;
  color: #fff;
}

.back-button {
  padding: 20rpx;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.back-text {
  font-size: 28rpx;
  color: #007aff;
}
</style>