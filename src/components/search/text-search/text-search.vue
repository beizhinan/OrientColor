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
      <!-- 使用卡片组件展示颜色数据 -->
      <view class="color-list">
        <color-card
          v-for="(color, index) in colorList"
          :key="index"
          :color-name="color.name"
          :color-code="color.code"
          @click="goToColorDetail(color)"
        />
      </view>
    </view>
  </view>
</template>

<script>
// 引入颜色卡片组件
import ColorCard from "@/components/search/text-search/preview-card.vue";

export default {
  components: {
    ColorCard,
  },
  data() {
    return {
      searchValue: "",
      colorTagList: [
        "全部",
        "青",
        "绿",
        "朱",
        "黄",
        "金",
        "白",
        "灰",
        "孔雀蓝",
      ],
      selectedTag: "全部", // 默认选中"全部"标签
      // 添加颜色数据
      colorList: [
        { id: 1, name: "蛤粉", code: "#EAE9DF" },
        { id: 2, name: "洋红", code: "#8A2026" },
        { id: 3, name: "浅黄香色", code: "#E1A871" },
        { id: 4, name: "浅绿华", code: "#4D7C7C" },
        { id: 5, name: "黯深朱", code: "#573224" },
        { id: 6, name: "常使群青", code: "#2A6086" },
        { id: 7, name: "偏黄的大青", code: "#4D7C7C" },
        { id: 8, name: "粉四青", code: "#9CBACE" },
        { id: 9, name: "偏黄的四绿", code: "#9DA279" },
      ],
    };
  },
  methods: {
    onSearchInput(event) {
      this.searchValue = event.detail.value;
      // 可以在这里添加搜索逻辑
    },
    clearSearch() {
      this.searchValue = "";
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
        url: `/pages/colorblock/colorblock?${queryString}`,
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
}

.color-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20rpx;
  padding-bottom: 20rpx;
}
</style>