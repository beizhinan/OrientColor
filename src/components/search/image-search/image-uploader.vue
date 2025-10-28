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

      <!-- 显示色块 -->
      <view class="color-blocks-container" v-if="result && result.length > 0">
        <view
          v-for="(color, index) in result"
          :key="index"
          class="color-block-item"
          :style="{ backgroundColor: getColorValue(color) }"
          @click="goToColorDetail(color)"
        >
        </view>
      </view>

      <!-- 新增：展示从API返回的data数组数据 -->
      <!-- <view class="extracted-data-container" v-if="extractedData && extractedData.length > 0">
        <view class="data-title">提取的颜色信息：</view>
        <view class="data-list">
          <view 
            v-for="(item, index) in extractedData" 
            :key="index" 
            class="data-item"
            @click="goToColorDetailFromData(item)"
          >
            <view class="color-preview" :style="{ backgroundColor: item.hex }"></view>
            <view class="data-info">
              <text class="color-name">{{ item.name }}</text>
              <text class="color-hex">{{ item.hex }}</text>
              <text class="color-rgb">RGB({{ item.rgb.join(', ') }})</text>
              <text class="color-lab">LAB({{ item.lab.map(v => v.toFixed(2)).join(', ') }})</text>
            </view>
          </view>
        </view>
      </view> -->

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
import { extractColorsFromImage } from "@/api/search/image-search.js";

export default {
  name: "ImageUploader",
  data() {
    return {
      imageSrc: "",
      imageFile: null,
      result: [],
      extractedData: [], // 新增：用于存储提取的颜色详细数据
    };
  },
  methods: {
    // 新增：获取颜色值的方法
    getColorValue(color) {
      // 根据接口返回的数据结构获取颜色值
      // 从调试信息看，接口返回的color对象包含value属性
      return (
        color.value ||
        color.hex ||
        color.colorCode ||
        "#" + Math.floor(Math.random() * 16777215).toString(16)
      );
    },

    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.imageSrc = res.tempFilePaths[0];
          this.imageFile = res.tempFiles[0];
          // 调用API提取颜色
          this.extractColors();
        },
        fail: (err) => {
          console.error("选择图片失败", err);
          uni.showToast({
            title: "选择图片失败",
            icon: "none",
          });
        },
      });
    },

    // 提取图片颜色
    async extractColors() {
      if (!this.imageFile) return;

      try {
        console.log("[ImageUploader] 开始提取颜色，文件信息:", this.imageFile);
        const res = await extractColorsFromImage(this.imageFile);
        console.log("[ImageUploader] 接口返回完整数据:", res);

        if (res.code === 200) {
          this.result = res.data.data; // 注意这里需要使用res.data.data
          console.log("[ImageUploader] 匹配的东方色彩数据:", this.result);

          // 处理提取的颜色详细数据
          if (res.data.extractedColors) {
            this.extractedData = res.data.extractedColors;
            console.log(
              "[ImageUploader] 提取的颜色详细数据:",
              this.extractedData
            );
          }
        } else {
          console.warn("[ImageUploader] 颜色提取失败，错误信息:", res.message);
          uni.showToast({
            title: res.message || "颜色提取失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("[ImageUploader] 提取颜色失败:", error);
        uni.showToast({
          title: "颜色提取失败",
          icon: "none",
        });
      }
    },

    // 添加图片预览方法
    previewImage() {
      uni.previewImage({
        urls: [this.imageSrc],
        current: this.imageSrc,
        indicator: "default",
        loop: true,
      });
    },

    // 跳转到颜色详情页（原来的颜色匹配结果）
    goToColorDetail(color) {
      console.log("跳转到颜色详情页", color);

      // 构造跳转参数
      const params = {
        name: encodeURIComponent(color.name),
        value: encodeURIComponent(color.value),
        id: color.id || null,
      };

      // 过滤掉空值参数并构建查询字符串
      const queryString = Object.keys(params)
        .filter((key) => params[key] !== null && params[key] !== undefined)
        .map((key) => `${key}=${params[key]}`)
        .join("&");

      // 跳转到详情页
      uni.navigateTo({
        url: `/pages/display-package/colorblock/colorblock?${queryString}`,
      });
    },

    // 新增：跳转到颜色详情页（从提取的颜色数据）
    goToColorDetailFromData(color) {
      console.log("跳转到提取的颜色详情页", color);

      // 构造跳转参数
      const params = {
        name: encodeURIComponent(color.name || "未知颜色"),
        value: encodeURIComponent(color.hex || "#000000"),
        id: color.id || null,
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

/* 色块容器 */
.color-blocks-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  margin-top: 20rpx;
}

/* 单个色块 */
.color-block-item {
  width: calc(20% - 10rpx); /* 一行显示5个，减去间距 */
  height: 60rpx;
  margin-bottom: 10rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20rpx;
  text-align: center;
}

.color-name {
  padding: 0 5rpx;
  text-shadow: 0 0 2rpx rgba(0, 0, 0, 0.5);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

/* 新增样式：展示提取数据 */
.extracted-data-container {
  width: 100%;
  margin-top: 30rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
}

.data-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.data-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15rpx;
  border-radius: 10rpx;
  background-color: #f9f9f9;
}

.color-preview {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
  border: 1rpx solid #eee;
}

.data-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.color-name {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 5rpx;
}

.color-hex,
.color-rgb,
.color-lab {
  font-size: 22rpx;
  color: #666;
  margin-bottom: 3rpx;
}

.color-hex {
  color: #9f7735;
  font-weight: bold;
}
</style>