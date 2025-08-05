<template>
  <view class="content">
    <view class="tip">
      <image
        class="icon"
        src="/static/color-picker.png"
        mode="aspectFit"
      ></image>
      <text class="description">
        您可通过在取色器上选取颜色，获取相应的色彩和名称</text
      >
    </view>
    <view class="picker">
      <color-picker></color-picker>
    </view>
  </view>
</template>

<script>
import ColorPicker from "@/components/search/color-search/picker-circle.vue";

export default {
  components: {
    ColorPicker,
  },
  setup() {},
  data() {
    return {};
  },
};
</script>

<style>
.content {
  padding: 20rpx;
}

.tip {
  display: flex;
  align-items: center;
  justify-items: center;
  flex-direction: row;
  background-color: rgba(159, 119, 53, 0.1);
  height: 60rpx;
  width: 75%;
  padding: 0 30rpx;
  border-radius: 24rpx;
  margin: 0 auto 30rpx auto;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.icon {
  width: 30rpx;
  height: 30rpx;
  margin-right: 20rpx;
}

.description {
  font-size: 18rpx;
  color: #5a4a32;
  flex: 1;
}

.picker {
  margin-top: 100rpx;
}
</style>