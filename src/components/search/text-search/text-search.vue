<template>
  <view class="content">
    <view class="head">
      <view class="search-box">
        <image
          class="search-icon"
          src="/static/search.png"
          mode="aspectFit"
        ></image>
        <input
          class="search-input"
          placeholder="搜索颜色..."
          placeholder-class="placeholder-style"
          v-model="searchValue"
          @input="onSearchInput"
        />
        <view v-if="searchValue" class="clear-btn" @click="clearSearch">
          <text class="clear-text">×</text>
        </view>
      </view>
      <view class="tags">
        <!-- 添加标签列表 -->
        <view
          v-for="(tag, index) in colorTagList"
          :key="index"
          class="tag-item"
          :class="{ active: selectedTag === tag }"
          @click="selectTag(tag)"
        >
          {{ tag }}
        </view>
      </view>
    </view>
    <view class="list">
      <!-- 加载状态 -->
      <view v-if="isLoading" class="loading">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 错误状态 -->
      <view v-else-if="isError" class="error">
        <text class="error-text">加载失败，请稍后重试</text>
        <button class="retry-btn" @click="retry">重新加载</button>
      </view>

      <!-- 空数据状态 -->
      <view
        v-else-if="filteredColorList.length === 0 && !isLoading"
        class="empty"
      >
        <text class="empty-text">暂无相关颜色数据</text>
      </view>

      <!-- 使用卡片组件展示颜色数据 -->
      <view v-else class="color-list">
        <color-card
          v-for="(color, index) in filteredColorList"
          :key="index"
          :color-name="color.name"
          :color-code="color.colorCode"
          @click="goToColorDetail(color)"
        />
      </view>
    </view>
  </view>

  <!-- 返回顶部组件 -->
  <backtop :visible="showBackTop"></backtop>
</template>

<script>
// 引入颜色卡片组件
import ColorCard from "@/components/search/text-search/preview-card.vue";
import { getColorTags, searchText } from "@/api/search/text-search.js";
// 引入返回顶部组件
import Backtop from "@/components/backtop/backtop.vue";

export default {
  components: {
    ColorCard,
    Backtop,
  },
  data() {
    return {
      searchValue: "",
      colorTagList: ["全部"],
      selectedTag: "全部", // 默认选中"全部"标签
      // 添加颜色数据
      colorList: [],
      // 添加缓存对象
      searchCache: {},
      isLoading: false,
      isError: false,
      showBackTop: true,
    };
  },
  computed: {
    filteredColorList() {
      if (this.selectedTag === "全部") {
        return this.colorList;
      }
      return this.colorList.filter((color) => color.type === this.selectedTag);
    },
  },
  mounted() {
    this.loadTags();
    this.loadAllColors();
  },
  onPageScroll(e) {
    // 控制返回顶部按钮显示
    this.showBackTop = e.scrollTop > 300;
  },
  methods: {
    // 获取所有标签
    async loadTags() {
      try {
        const res = await getColorTags();
        if (res.status === "success") {
          this.colorTagList = ["全部", ...res.data];
        }
      } catch (error) {
        console.error("获取标签失败:", error);
        uni.showToast({
          title: "获取标签失败",
          icon: "none",
        });
      }
    },

    // 加载所有颜色数据
    async loadAllColors() {
      this.isLoading = true;
      this.isError = false;
      try {
        // 检查缓存中是否有'all'的数据
        if (this.searchCache["all"]) {
          this.colorList = this.searchCache["all"];
          this.isLoading = false;
          return;
        }

        const res = await searchText("all");
        if (res.status === "success") {
          // 将结果存入缓存
          this.searchCache["all"] = res.data;
          this.colorList = res.data;
        }
      } catch (error) {
        console.error("获取颜色数据失败:", error);
        this.isError = true;
        uni.showToast({
          title: "获取颜色数据失败",
          icon: "none",
        });
      } finally {
        this.isLoading = false;
      }
    },

    // 搜索颜色
    async searchColors(keyword) {
      this.isLoading = true;
      this.isError = false;
      try {
        // 如果关键词为空，则使用默认值"all"
        const searchKeyword = keyword || "all";

        // 检查缓存中是否已有该关键词的搜索结果
        if (this.searchCache[searchKeyword]) {
          this.colorList = this.searchCache[searchKeyword];
          this.isLoading = false;
          return;
        }

        const res = await searchText(searchKeyword);
        if (res.status === "success") {
          // 将结果存入缓存
          this.searchCache[searchKeyword] = res.data;
          this.colorList = res.data;
        }
      } catch (error) {
        console.error("搜索颜色失败:", error);
        this.isError = true;
        uni.showToast({
          title: "搜索失败，请重试",
          icon: "none",
        });
      } finally {
        this.isLoading = false;
      }
    },

    onSearchInput(event) {
      this.searchValue = event.detail.value;
      // 防抖处理
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.searchColors(this.searchValue);
      }, 300);
    },

    clearSearch() {
      this.searchValue = "";
      this.searchColors();
    },

    retry() {
      if (this.searchValue) {
        this.searchColors(this.searchValue);
      } else {
        this.loadAllColors();
      }
    },

    selectTag(tag) {
      this.selectedTag = tag;
      // 可以在这里添加标签选择后的逻辑
    },
    // 跳转到颜色详情页
    goToColorDetail(color) {
      console.log("跳转到颜色详情页", color);

      // 构造跳转参数
      const params = {
        name: encodeURIComponent(color.name),
        value: encodeURIComponent(color.code),
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
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  background-color: #f1e9d8;
  height: 100vh; /* 使用固定高度而不是min-height */
  overflow: hidden; /* 隐藏页面滚动条 */
}

.head {
  padding: 0 0 10rpx;
  align-items: center;
}

.search-box {
  display: flex;
  width: 600rpx;
  align-items: center;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 16rpx 25rpx;
  transition: all 0.3s ease;
  border: 3rpx solid #bababa;
  position: relative;
}

.search-box:focus-within {
  background-color: #fff;
  box-shadow: 0 6rpx 16rpx rgba(159, 119, 53, 0.15);
}

.search-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  font-size: 32rpx;
  color: #333;
  height: 40rpx;
  line-height: 48rpx;
}

.clear-btn {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn image {
  width: 32rpx;
  height: 32rpx;
}

.clear-text {
  font-size: 24rpx;
  color: #999;
}

.placeholder-style {
  color: #999;
  font-size: 24rpx;
}

.tags {
  display: flex;
  margin-top: 30rpx;
  width: 650rpx;
  overflow-x: auto; /* 允许横向滚动 */
  overflow-y: hidden; /* 隐藏纵向滚动 */
  white-space: nowrap; /* 防止换行 */
  gap: 10rpx; /* 设置标签间距 */
  padding: 10rpx 0; /* 添加一些内边距 */
  box-sizing: border-box; /* 包含padding在宽度计算内 */
  -webkit-overflow-scrolling: touch; /* iOS设备平滑滚动 */
}

.tag-item {
  flex: 0 0 auto; /* 不伸缩，保持原始宽度 */
  padding: 8rpx 18rpx;
  border-radius: 40rpx;
  background-color: rgba(159, 119, 53, 0.1);
  color: #666;
  font-size: 28rpx;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-align: center;
  box-sizing: border-box;
}

/* 隐藏滚动条 */
.tags::-webkit-scrollbar {
  display: none;
}

.tag-item.active {
  background-color: #9f7735;
  color: #fff;
  border-color: #9f7735;
  font-weight: 500;
  box-shadow: 0 4rpx 8rpx rgba(159, 119, 53, 0.2);
}

.list {
  width: 100%;
  padding: 0 25rpx;
  box-sizing: border-box;
  margin-top: 40rpx;
  min-height: 300rpx;
  position: relative;
  flex: 1;
  overflow-y: auto; /* 只允许列表区域滚动 */
  /* 移除固定高度，使用flex自动填充剩余空间 */
}

.color-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20rpx;
  padding-bottom: 20rpx;
}

.loading,
.error,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.loading-icon,
.error-icon,
.empty-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 20rpx;
}

.loading-text,
.error-text,
.empty-text {
  font-size: 28rpx;
  color: #999;
}

.retry-btn {
  margin-top: 30rpx;
  background-color: #9f7735;
  color: #fff;
  border: none;
  padding: 10rpx 30rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}
</style>