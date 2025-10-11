<template>
  <view class="modal-container" v-if="showModal">
    <view class="modal-content">
      <view class="modal-header">
        <text class="title">色彩总谱说明</text>
      </view>
      <view class="modal-body">
        <!-- 修复图片路径并添加错误处理 -->
        <image
          class="spectrum-image"
          src="/static/picker.jpg"
          mode="aspectFit"
          @error="onImageError"
        ></image>
        <view class="description">
          <text>
            本圆盘图概括说明了中国传统建筑色谱的色相分布（角度）和彩度分布（半径位置）。可看作中国传统建筑色立体的俯视图。实心灰色部分为非传统色色相。阴影（斜线）阴影部分为现有样本未涉及的色域，它可能是传统工艺较难制成的色彩，也可能是目前采集范围尚未涉及但尚可挖掘补充的传统色彩。圆心的低艳彩色（低彩度）与其他色彩度差异较大，多为老化、斑驳的实物颜色。（文案有待商榷）
          </text>
        </view>
      </view>
      <view class="modal-footer">
        <button class="confirm-button" @click="hideModal">已了解</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showModal: true,
    };
  },
  methods: {
    hideModal() {
      this.showModal = false;
      this.$emit("confirmed");
    },
    // 添加图片加载错误处理
    onImageError(e) {
      console.error("图片加载失败:", e);
    },
  },
};
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  width: 80%;
  max-width: 600rpx;
}

.modal-header {
  padding: 20rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
}

.modal-body {
  padding: 20rpx;
}

.spectrum-image {
  width: 100%;
  height: 300rpx; /* 设置固定高度 */
  margin-bottom: 20rpx;
}

.description {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
}

.modal-footer {
  padding: 20rpx;
  text-align: center;
}

.confirm-button {
  background-color: #9f7735;
  color: #fff;
  border: none;
  padding: 10rpx 20rpx;
  border-radius: 4rpx;
  font-size: 28rpx;
}
</style>