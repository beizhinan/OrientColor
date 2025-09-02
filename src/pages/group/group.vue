<template>
  <view class="container">
    <view class="content">
      <!-- 使用网格布局显示颜色卡片，每行3个 -->
      <view class="color-grid">
        <preview-card
          v-for="(color, index) in staticColors"
          :key="index"
          :color-name="color.name"
          :color-code="color.code"
          @click="goToColorDetail(color)"
          class="color-card-item"
        />
      </view>
    </view>
  </view>
</template>

<script>
import previewCard from "@/components/search/text-search/preview-card.vue";

export default {
  components: {
    previewCard,
  },

  data() {
    return {
      label: "",
      value: "",
      pageTitle: "",
      // 静态颜色数据用于测试
      staticColors: [
        { name: "珊瑚红", code: "#FF6F61" },
        { name: "薄荷绿", code: "#6BDDA0" },
        { name: "天蓝", code: "#6BB5FF" },
        { name: "向日葵黄", code: "#FFD166" },
        { name: "薰衣草紫", code: "#B56BFF" },
        { name: "珊瑚粉", code: "#FF6B9D" },
        { name: "青柠绿", code: "#C4FF6B" },
        { name: "玫瑰金", code: "#FF6B6B" },
        { name: "海洋蓝", code: "#3C6E71" },
      ],
    };
  },

  onLoad(options) {
    if (options.label && options.value) {
      this.label = decodeURIComponent(options.label);
      this.value = decodeURIComponent(options.value);
      this.pageTitle = `${this.label}：${this.value}`;

      // 设置页面标题
      uni.setNavigationBarTitle({
        title: this.pageTitle,
      });
    }
  },

  methods: {
    // 跳转到颜色详情页
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
.container {
  padding: 20rpx;
  background-color: #fffbf6;
  min-height: 100vh;
}

.content {
  padding: 20rpx;
}

.value-display {
  font-size: 28rpx;
  color: #333;
  text-align: center;
  display: block;
  margin-bottom: 30rpx;
}

/* 网格布局，每行显示3个卡片 */
.color-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.color-card-item {
  width: 30%; /* 每行显示3个，留一些间距 */
  margin-bottom: 20rpx;
}
</style>