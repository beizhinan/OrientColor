<template>
  <view class="uploader-container">
    <view class="upload-area" @click="chooseImage" v-if="!imageSrc">
      <view class="upload-content">
        <view class="upload-icon">
          <image class="upload-image" src="/static/image.png"></image>
        </view>

        <text class="upload-text">您可以上传图片</text>
        <text class="upload-subtext">系统将解析图像分析其主导色和点缀色</text>
        <view class="upload-button">
          <text class="button-text">上传图片</text>
        </view>
      </view>
    </view>

    <!-- 预览图片 -->
    <view v-if="imageSrc" class="preview-container">
      <image :src="imageSrc" class="preview-image" mode="aspectFit"></image>
      <text class="tips">点击图片、色块进行查色</text>

      <!-- 修改部分：显示色块 -->
      <view class="color-blocks-container" v-if="result && result.length > 0">
        <view
          v-for="(color, index) in result"
          :key="index"
          class="color-block-item"
          :style="{ backgroundColor: color }"
        ></view>
      </view>

      <button class="change-btn" @click="chooseImage">重新上传图片</button>
    </view>
  </view>
</template>

<script>
export default {
  name: "ImageUploader",
  data() {
    return {
      imageSrc: "",
      result: [
        "#FF6B6B", // 红色
        "#4ECDC4", // 青色
        "#45B7D1", // 蓝色
        "#FFBE0B", // 黄色
        "#FB5607", // 橙色
        "#8338EC", // 紫色
        "#3A86FF", // 亮蓝色
        "#38B000", // 绿色
        "#9D4EDD", // 紫罗兰
        "#FF006E", // 粉色
      ],
    };
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.imageSrc = res.tempFilePaths[0];
          // 可以在这里触发事件将图片路径传递给父组件
          this.$emit("imageUploaded", this.imageSrc);
        },
        fail: (err) => {
          console.error("选择图片失败", err);
        },
      });
    },
  },
};
</script>

<style scoped>
.uploader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.upload-area {
  width: 100%;
  height: 600rpx;
  border-radius: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  padding: 20rpx;
  box-sizing: border-box;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.upload-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #dedefa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 8rpx solid #eef0ff;
}

.upload-image {
  width: 50rpx;
  height: 50rpx;
}

.upload-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
  margin-bottom: 10rpx;
}

.upload-subtext {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 30rpx;
}

.upload-button {
  background-color: #dedefa;
  padding: 15rpx 40rpx;
  border-radius: 16rpx;
}

.button-text {
  color: #5c59e8;
  font-size: 28rpx;
  font-weight: bold;
}

.preview-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20rpx;
}

.preview-image {
  width: 100%;
  height: 300rpx;
  border-radius: 10rpx;
}

.tips {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999;
}

/* 新增样式：色块容器 */
.color-blocks-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  margin-top: 20rpx;
}

/* 新增样式：单个色块 */
.color-block-item {
  width: calc(20% - 10rpx); /* 一行显示5个，减去间距 */
  height: 60rpx;
  border-radius: 10rpx; /* 圆角 */
  margin-bottom: 10rpx;
  box-sizing: border-box;
}

.change-btn {
  margin-top: 20rpx;
  background-color: #eee;
  border: 0 solid transparent;
  border-radius: 10rpx;
  font-size: 28rpx;
  outline: none;
}

.change-btn::after {
  display: none;
}
</style>