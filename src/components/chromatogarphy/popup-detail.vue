<template>
  <view class="popup-overlay" v-if="visible" @click="closePopup">
    <view class="popup-content" @click.stop>
      <view class="popup-header">
        <text class="popup-title">{{ title }}</text>
      </view>
      <view class="popup-body">
        <view class="section">
          <text class="section-title">色卡说明\n</text>
          <text class="section-text">{{ description.desc }}</text>
        </view>
        <view class="section">
          <text class="section-title">色系采集\n</text>
          <text class="section-text">{{ description.coll }}</text>
        </view>
        <view class="section">
          <text class="section-title">色系呈现\n</text>
          <text class="section-text">{{ description.pre }}</text>
        </view>
      </view>
      <view class="popup-footer">
        <button class="confirm-btn" @click="closePopup">已了解</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "PopupDetail",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // 由父组件控制弹窗的显示状态
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
  },
  emits: ["close"], // 添加事件发射
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  width: 90%;
  max-height: 1500rpx;
  overflow: hidden;
  clip-path: polygon(
    6px 0,
    calc(100% - 6px) 0,
    100% 6px,
    100% calc(100% - 6px),
    calc(100% - 6px) 100%,
    6px 100%,
    0 calc(100% - 6px),
    0 6px
  );
  background: linear-gradient(-45deg, #deb67f 4px, white 0) bottom right,
    linear-gradient(45deg, #deb67f 4px, white 0) bottom left,
    linear-gradient(135deg, #deb67f 4px, white 0) top left,
    linear-gradient(-135deg, #deb67f 4px, white 0) top right;
  background-size: 50% 51%;
  background-repeat: no-repeat;
  border: solid 2px #deb67f;
}

.popup-header {
  padding: 30rpx;
  text-align: center;
}

.popup-title {
  font-size: 36rpx;
  letter-spacing: 2rpx;
  color: #9f7735;
}

.popup-body {
  padding: 20rpx;
  max-height: 1000rpx;
  overflow-y: auto;
}

.section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 32rpx;
}

.section-text {
  font-size: 26rpx;
  line-height: 24rpx;
  color: #3c2a1d;
}

.popup-footer {
  padding: 30rpx;
  text-align: center;
}

.confirm-btn {
  width: 250rpx;
  height: 70rpx;
  background-color: #9f7735;
  color: white;
  font-size: 28rpx;
  border-radius: 30rpx;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  background-color: #e0e0e0;
}
</style>