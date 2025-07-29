<template>
  <view class="content">
    <view class="title">
      <text class="title-t">图片颜色提取</text>
      <text class="title-d"
        >智能提取上传图片的主要色调，匹配最接近的东方色彩</text
      >
    </view>
    <view class="image-uploader">
      <image-uploader @imageUploaded="handleImageUploaded"></image-uploader>
    </view>
    <view class="tips">
      <text>
        请注意彩色库中显示的颜色及数值是由计算机模拟的颜色，不同设备上显示也有所区别，实际生产中请参阅实物色卡确认。</text
      >
    </view>
  </view>
</template>


<script>
import ImageUploader from "@/components/search/image-search/image-uploader.vue";

export default {
  components: {
    ImageUploader,
  },
  methods: {
    handleImageUploaded(imagePath) {
      // 处理上传的图片路径
      console.log("上传的图片路径:", imagePath);
    },
  },
};
</script>


<style>
.content {
  padding: 30px;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  letter-spacing: 2rpx;
}

.title-t {
  font-size: 28rpx;
  font-weight: bold;
}

.title-d {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.image-uploader {
  margin-top: 60rpx;
}

.tips {
  margin-top: 40rpx;
  font-size: 28rpx;
  color: #999;
  letter-spacing: 2rpx;
}
</style>