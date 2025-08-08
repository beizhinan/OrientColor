<template>
  <view class="container">
    <!-- 推荐色谱卡片列表 -->
    <view class="cards">
      <text class="title">推荐色谱</text>
      <view class="waterfall">
        <!-- 第一列 -->
        <view class="column">
          <color-card
            v-for="(card, index) in leftColumnCards"
            :key="'left-' + index"
            :id="card.id"
            :headerText="card.headerText"
            :headerImage="card.headerImage"
            :title="card.title"
            :description="card.description"
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
          />
        </view>
      </view>
    </view>

    <!-- 弹窗组件 -->
    <premium-popup
      :show="showPopup"
      @close="handleClosePopup"
      @experience="handleExperience"
    />
  </view>
</template>

<script>
import premiumPopup from "@/components/home/premium-popup.vue";
import colorCard from "@/components/home/color-card.vue";

export default {
  components: {
    premiumPopup,
    colorCard,
  },
  data() {
    return {
      showPopup: true,
      cardList: [
        {
          id: 1,
          headerText: "最新",
          headerImage: "https://placebear.com/340/340",
          title: "开化寺",
          description: "古老的佛教寺庙，拥有精美的壁画和建筑",
        },
        {
          id: 2,
          headerText: "热门",
          headerImage: "https://placebear.com/340/240",
          title: "晋祠",
          description: "中国古代建筑艺术的瑰宝，园林景观优美",
        },
        {
          id: 3,
          headerText: null,
          headerImage: "https://placebear.com/340/240",
          title: "平遥古城",
          description: "保存完整的明清时期古城，世界文化遗产",
        },
        {
          id: 4,
          headerText: null,
          headerImage: "https://placebear.com/340/340",
          title: "五台山",
          description: "中国四大佛教名山之一，历史悠久",
        },
      ],
    };
  },
  computed: {
    // 将卡片分配到左右两列
    leftColumnCards() {
      return this.cardList.filter((_, index) => index % 2 === 0);
    },
    rightColumnCards() {
      return this.cardList.filter((_, index) => index % 2 === 1);
    },
  },
  methods: {
    handleClosePopup() {
      this.showPopup = false;
    },
    handleExperience() {
      uni.showToast({
        title: "开始体验",
        icon: "success",
      });
      this.showPopup = false;
    },
    handleViewDetails() {
      uni.showToast({
        title: "查看介绍",
        icon: "none",
      });
    },
  },
};
</script>

<style>
.container {
  padding: 20px;
}

.content {
  font-size: 16px;
  margin-top: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
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
</style>