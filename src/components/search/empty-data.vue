<template>
  <view class="empty-data">
    <!-- 关闭按钮 -->
    <view class="close-btn" @click="handleClose">
      <text class="close-icon">×</text>
    </view>

    <!-- 圆形图标 -->
    <view class="icon">
      <image :src="iconSrc" mode="widthFix"></image>
    </view>

    <!-- 提示文本 -->
    <view class="message">
      <text>{{ message }}</text>
    </view>

    <!-- 返回按钮 -->
    <button class="return-btn" @click="handleReturn">返回</button>
  </view>
</template>

<script>
export default {
  props: {
    // 图标路径
    iconSrc: {
      type: String,
      default: "/static/icons/empty.png", // 默认图标路径
    },
    // 提示文本
    message: {
      type: String,
      default: "未检索到有效结果",
    },
  },
  methods: {
    // 处理关闭按钮点击事件
    handleClose() {
      this.$emit("close");
    },
    // 处理返回按钮点击事件
    handleReturn() {
      this.$emit("return");
    },
  },
};
</script>

<style scoped>
.empty-data {
  position: relative;
  width: 100%;
  max-width: 300px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.icon {
  margin-bottom: 15px;
}

.icon image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ffe135; /* 黄色背景 */
}

.message {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.return-btn {
  display: inline-block;
  padding: 8px 20px;
  font-size: 14px;
  color: #fff;
  background-color: #3c3c43;
  border: none;
  border-radius: 24px;
  cursor: pointer;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.close-icon {
  font-size: 16px;
  color: #999;
}
</style>