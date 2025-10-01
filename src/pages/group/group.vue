<template>
  <view class="container">
    <view class="content">
      <!-- 使用网格布局显示颜色卡片，每行3个 -->
      <view class="color-grid">
        <preview-card
          v-for="color in colorList"
          :key="color.id"
          :color-name="color.name"
          :color-code="color.code || color.hex"
          @click="goToColorDetail(color)"
          class="color-card-item"
        />
      </view>

      <!-- 空数据提示 -->
      <empty-data v-if="colorList.length === 0 && !loading" />
    </view>
  </view>
</template>

<script>
import previewCard from "@/components/search/text-search/preview-card.vue";
import emptyData from "@/components/search/empty-data.vue";
import { getGroupColors } from "@/api/group.js";

export default {
  components: {
    previewCard,
    emptyData,
  },

  data() {
    return {
      label: "",
      value: "",
      pageTitle: "",
      colorList: [],
      loading: false,
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

      // 获取颜色数据
      this.fetchColorList();
    }
  },

  methods: {
    // 获取颜色数据
    async fetchColorList() {
      this.loading = true;
      try {
        const res = await getGroupColors({
          label: this.label,
          value: this.value,
        });

        if (res.status === "success") {
          this.colorList = res.data || [];
        } else {
          uni.showToast({
            title: "数据获取失败",
            icon: "none",
          });
        }
      } catch (error) {
        uni.showToast({
          title: "请求失败",
          icon: "none",
        });
        console.error("获取颜色数据失败:", error);
      } finally {
        this.loading = false;
      }
    },

    // 跳转到颜色详情页
    goToColorDetail(color) {
      console.log("跳转到颜色详情页", color);

      // 构造跳转参数
      const params = {
        name: encodeURIComponent(color.name),
        value: encodeURIComponent(color.code || color.hex),
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