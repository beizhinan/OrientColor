<template>
  <view class="content">
    <view class="tip">
      <image
        class="icon"
        src="/static/color-picker.png"
        mode="aspectFit"
      ></image>
      <text class="description">
        您可通过在取色器上选取颜色，获取相应的色彩和名称</text>
    </view>
    <view class="picker">
      <color-picker></color-picker>
    </view>
    <view class="result">
     <view class="title">
      <text class="name">{{result.name}}</text>
      <text class="code" :style="{color: result.code}">{{result.code}}</text>
     </view>
     <view class="info">
      <view class="introduction">{{result.intro}}</view>
      <view class="image">
        <image :src="result.imageurl" mode="aspectFill"></image>
      </view>
     </view>
    </view>
  </view>
</template>

<script>
import ColorPicker from "@/components/search/color-search/picker.vue";
import { useColorStore } from '@/stores/color-search.js';

export default {
  components: {
    ColorPicker,
  },
  setup() {
    const colorStore = useColorStore();
    return {
      colorStore
    };
  },
  data() {
    return {
      result:{
        name:"老僧衣",
        code:"#A45F44",
        intro:"明洪武时期的酱色釉品种。其色调似佛教僧侣穿旧的僧衣，故称之为'老僧衣'色。为茶叶末色的变体。老僧衣釉色指故刹中和尚穿的衣服，佛教对僧衣服色有一些规定，其中之一是僧衣颜色不许用纯色。袈裟本是一种颜色的名称，因为佛制僧人必须穿染衣，避用青黄赤白黑五正色，而必须用一种复色即袈裟色。我国旧译袈裟色是赤色，南方佛教典籍则说是一种橙黄色，其实它就是是一种赤黄青的混合色。",
        imageurl:"https://placebear.com/340/540"
      }
    };
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

.result {
  margin-top: 40rpx;
}

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30rpx;
}

.name {
  font-size: 36rpx;
  font-weight: bold;
  color: #000;
  margin-right: 20rpx;
}

.code {
  font-size: 32rpx;
  font-weight: bold;
}

.info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.introduction {
  flex: 1;
  font-size: 24rpx;
  line-height: 1.6;
  color: #333;
  padding-right: 30rpx;
}

.image {
  width: 340rpx;
  height: 540rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.image image {
  width: 100%;
  height: 100%;
}
</style>