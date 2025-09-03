<template>
  <view class="modal-container" v-if="visible">
    <view class="modal-content">
      <view class="modal-body">
        <image class="modal-icon" :src="iconSrc"></image>
        <text class="modal-title">{{ title }}</text>
        <text class="modal-description">{{ description }}</text>
      </view>
      <button class="modal-button" @click="handleConfirm">确认</button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "保存色块壁纸成功！",
    },
    description: {
      type: String,
      default: "请到系统相册中查看详情",
    },
    iconSrc: {
      type: String,
      default: "/static/image.png", // 使用项目中的实际图标路径
    },
  },
  mounted() {
    console.log("SaveSuccessModal mounted, visible:", this.visible);
  },
  updated() {
    console.log("SaveSuccessModal updated, visible:", this.visible);
  },
  methods: {
    handleConfirm() {
      this.$emit("confirm");
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
  z-index: 9999;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-body {
  display: flex;
  margin-bottom: 20rpx;
  flex-direction: column;
}

.modal-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-bottom: 20rpx;
  align-self: center; 
}

.modal-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.modal-description {
  font-size: 28rpx;
  color: #333;
}

.modal-button {
  width: 160rpx;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #333;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
}
</style>