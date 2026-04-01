<template>
  <view class="container">
    <!-- 推荐色谱卡片列表 -->
    <view class="cards">
      <view class="title-bar">
        <text class="title">推荐色谱</text>
        <view class="spacer"></view>
        <button class="total-spectrum-btn" @click="navigateToAllColor">
          总谱
        </button>
      </view>
      <view class="waterfall">
        <!-- 第一列 -->
        <view class="column">
          <color-card
            v-for="(card, index) in leftColumnCards"
            :key="'left-' + index"
            :id="card.id"
            :headerImage="card.headerImage"
            :title="card.title"
            :description="card.description"
            :video="card.video"
          />
        </view>
        <!-- 第二列 -->
        <view class="column">
          <color-card
            v-for="(card, index) in rightColumnCards"
            :key="'right-' + index"
            :id="card.id"
            :headerText="card.headerText"
            :headerImage="card.headerImage"
            :title="card.title"
            :description="card.description"
            :video="card.video"
          />
        </view>
      </view>
      <!-- 加载更多按钮 -->
      <view class="load-more-container" v-if="displayCount < cardList.length">
        <button class="load-more-btn" @click="loadMore">加载更多</button>
      </view>
    </view>
  </view>
</template>

<script>
import colorCard from "@/components/home/color-card.vue";
import { getRecommendedColors } from "@/api/index.js"; // 引入获取推荐色谱的接口

export default {
  components: {
    colorCard,
  },
  data() {
    return {
      showPopup: true,
      displayCount: 20, // 初始显示数量
      cardList: [],
    };
  },
  computed: {
    // 将卡片分配到左右两列
    leftColumnCards() {
      return this.cardList
        .filter((_, index) => index % 2 === 0)
        .slice(0, Math.ceil(this.displayCount / 2));
    },
    rightColumnCards() {
      return this.cardList
        .filter((_, index) => index % 2 === 1)
        .slice(0, Math.floor(this.displayCount / 2));
    },
  },
  methods: {
    handleClosePopup() {
      this.showPopup = false;
    },
    handleExperience() {
      this.showPopup = false;
    },
    handleViewDetails() {},
    navigateToAllColor() {
      uni.navigateTo({
        url: "/pages/display-package/allcolor/allcolor",
      });
    },
    loadMore() {
      this.displayCount += 20;
    },

    // 获取推荐色谱数据
    async fetchRecommendedColors() {
      try {
        const response = await getRecommendedColors();
        if (response.status === "success") {
          this.cardList = response.data || [];
        } else {
          uni.showToast({
            title: response.message || "获取数据失败",
            icon: "none",
          });
        }
      } catch (error) {
        uni.showToast({
          title: "网络请求失败",
          icon: "none",
        });
        console.error("获取推荐色谱失败:", error);
      }
    },
  },

  // 页面加载时获取数据
  onLoad() {
    this.fetchRecommendedColors();
  },
};
</script>

<style>
.container {
  padding: 20px;
  height: 100vh;
  overflow: auto;
  background-color: #f1e9d8;
}

.content {
  font-size: 16px;
  margin-top: 20px;
}

.title-bar {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
  width: 100%;
}

.spacer {
  flex: 1;
}

.title {
  font-size: 16px;
  color: #3c2a1d;
  font-weight: bold;
}

.total-spectrum-btn {
  background-color: #c69c6d;
  color: white;
  border: 1px solid #9f7735;
  border-radius: 4px;
  font-size: 12px;
  flex-shrink: 0;
}

.waterfall {
  display: flex;
  justify-content: space-between;
}

.column {
  flex: 0 0 48%;
  display: flex;
  flex-direction: column;
}

.column color-card {
  margin-bottom: 20px;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.load-more-btn {
  background-color: #c69c6d;
  color: white;
  border: 1px solid #9f7735;
  border-radius: 4px;
  font-size: 14px;
  padding: 8px 20px;
}
</style>