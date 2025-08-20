<template>
  <view class="uploader-container">
    <view class="upload-area" @click="chooseImage" v-if="!imageSrc">
      <view class="upload-content">
        <view class="upload-icon">
          <image class="upload-image" src="/static/image.png"></image>
        </view>

        <text class="upload-text">您可以上传图片</text>
        <text class="upload-subtext">系统将解析图像分析其主导色和点缀色</text>
      </view>
    </view>
    <view class="upload-button" @click="chooseImage" v-if="!imageSrc">
      <text class="button-text">上传图片</text>
    </view>

    <!-- 预览图片 -->
    <view v-if="imageSrc" class="preview-container">
      <image
        :src="imageSrc"
        class="preview-image"
        mode="aspectFit"
        @click="previewImage"
      ></image>
      <text class="tips">点击图片、色块进行查色</text>

      <!-- 修改部分：显示色块 -->
      <view class="color-blocks-container" v-if="result && result.length > 0">
        <view
          v-for="(color, index) in result"
          :key="index"
          class="color-block-item"
          :style="{ backgroundColor: color.value }"
          @click="goToColorDetail(color)"
        ></view>
      </view>

      <view class="upload-button" @click="chooseImage">
        <text class="button-text">重新上传图片</text>
      </view>

      <view class="tips" v-if="result && result.length > 0">
        <text>
          *请注意彩色库中显示的颜色及数值是由计算机模拟的颜色，不同设备上显示也有所区别，实际生产中请参阅实物色卡确认。</text
        >
      </view>
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
        {
          id: 1,
          name: "活力红",
          value: "#FF6B6B",
          titlePath: "红-大红-活力红",
        },
        {
          id: 2,
          name: "清新青",
          value: "#4ECDC4",
          titlePath: "识别颜色-清新青",
        },
        {
          id: 3,
          name: "天空蓝",
          value: "#45B7D1",
          titlePath: "识别颜色-天空蓝",
        },
        {
          id: 4,
          name: "明亮黄",
          value: "#FFBE0B",
          titlePath: "识别颜色-明亮黄",
        },
        {
          id: 5,
          name: "活力橙",
          value: "#FB5607",
          titlePath: "识别颜色-活力橙",
        },
        {
          id: 6,
          name: "优雅紫",
          value: "#8338EC",
          titlePath: "识别颜色-优雅紫",
        },
        {
          id: 7,
          name: "宝石蓝",
          value: "#3A86FF",
          titlePath: "识别颜色-宝石蓝",
        },
        {
          id: 8,
          name: "翠绿",
          value: "#38B000",
          titlePath: "识别颜色-翠绿",
        },
        {
          id: 9,
          name: "紫罗兰",
          value: "#9D4EDD",
          titlePath: "识别颜色-紫罗兰",
        },
        {
          id: 10,
          name: "洋红",
          value: "#FF006E",
          titlePath: "识别颜色-洋红",
        },
        {
          id: 11,
          name: "粉色",
          value: "#FFA7C4",
          titlePath: "识别颜色-粉色",
        },
        {
          id: 12,
          name: "玫瑰红",
          value: "#FF2D55",
          titlePath: "识别颜色-玫瑰红",
        },
        {
          id: 13,
          name: "burgundy",
          value: "#A80023",
          titlePath: "识别颜色-Burgundy",
        },
        {
          id: 14,
          name: "深粉",
          value: "#EB4D5C",
          titlePath: "识别颜色-深粉",
        },
        {
          id: 15,
          name: "深粉",
          value: "#EB4D5C",
          titlePath: "识别颜色-深粉",
        },
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

    // 添加图片预览方法
    previewImage() {
      uni.previewImage({
        urls: [this.imageSrc],
        current: this.imageSrc,
        indicator: "default",
        loop: true,
      });
    }, // 跳转到颜色详情页
    goToColorDetail(color) {
      console.log("跳转到颜色详情页", color);

      // 构造跳转参数
      const params = {
        name: encodeURIComponent(color.name),
        value: encodeURIComponent(color.code),
        id: color.id || null,
        titlePath: color.titlePath ? encodeURIComponent(color.titlePath) : null,
      };

      // 过滤掉空值参数并构建查询字符串
      const queryString = Object.keys(params)
        .filter((key) => params[key] !== null && params[key] !== undefined)
        .map((key) => `${key}=${params[key]}`)
        .join("&");

      // 跳转到详情页
      uni.navigateTo({
        url: `/pages/colorblock/colorblock?${queryString}`,
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
  border-right: 8rpx solid #c69c6d; /* 右边框 */
  border-bottom: 8rpx solid #c69c6d; /* 下边框 */
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
  background-color: #9f7735;
  width: 180rpx;
  height: 60rpx;
  margin-top: 50rpx;
  padding: 15rpx 40rpx;
  border-radius: 16rpx;
  display: flex; /* 添加flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.button-text {
  color: white;
  font-size: 30rpx;
  text-align: center; /* 文本居中 */
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
  height: 400rpx;
  border-radius: 10rpx;
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
  background-color: #9f7735;
  color: white;
  width: 180rpx;
  height: 60rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}

.change-btn::after {
  display: none;
}

.tips {
  margin-top: 40rpx;
  font-size: 24rpx;
  color: #9f7735;
  letter-spacing: 2rpx;
}
</style>