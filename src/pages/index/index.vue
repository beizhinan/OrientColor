<template>
  <view class="container">
    <!-- 推荐色谱卡片列表 -->
    <view class="cards">
      <view class="title-bar">
        <text class="title">推荐色谱</text>
        <view class="spacer"></view>
        <button class="total-spectrum-btn" @click="navigateToAllColor">总谱</button>
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
      <!-- 加载更多按钮 -->
      <view class="load-more-container" v-if="displayCount < cardList.length">
        <button class="load-more-btn" @click="loadMore">加载更多</button>
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
import request from "@/utils/request.js"; // 引入封装好的请求类

export default {
  components: {
    premiumPopup,
    colorCard,
  },
  data() {
    return {
      showPopup: true,
      displayCount: 20, // 初始显示数量
      // cardList: [],
      cardList: [
        {
          id: 1,
          headerImage: "https://placebear.com/340/340",
          title: "开化寺",
          description: "古老的佛教寺庙，拥有精美的壁画和建筑",
        },
        {
          id: 2,
          headerImage: "https://placebear.com/340/240",
          title: "晋祠",
          description: "中国古代建筑艺术的瑰宝，园林景观优美",
        },
        {
          id: 3,
          headerImage: "https://placebear.com/340/240",
          title: "平遥古城",
          description: "保存完整的明清时期古城，世界文化遗产",
        },
        {
          id: 4,
          headerImage: "https://placebear.com/340/340",
          title: "五台山",
          description: "中国四大佛教名山之一，历史悠久",
        },
        // 模拟更多数据以测试分页功能
        ...Array.from({ length: 36 }, (_, i) => ({
          id: i + 5,
          headerImage: `https://placebear.com/340/${300 + (i % 10) * 10}`,
          title: `景点${i + 5}`,
          description: `这是景点${i + 5}的描述信息，用于展示分页加载功能`,
        }))
      ],
    };
  },
  computed: {
    // 将卡片分配到左右两列
    leftColumnCards() {
      return this.cardList.filter((_, index) => index % 2 === 0)
        .slice(0, Math.ceil(this.displayCount / 2));
    },
    rightColumnCards() {
      return this.cardList.filter((_, index) => index % 2 === 1)
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
        url: '/pages/allcolor/allcolor'
      });
    },
    loadMore() {
      this.displayCount += 20;
    },
    
    // 获取推荐色谱数据
    async fetchRecommendedColors() {
      try {
        const response = await request.get('/home/recommended');
        if (response.status === 'success') {
          this.cardList = response.data;
        } else {
          uni.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
        }
      } catch (error) {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        console.error('获取推荐色谱失败:', error);
      }
    }
  },
  
  // 页面加载时获取数据
  onLoad() {
    // this.fetchRecommendedColors();
  }
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