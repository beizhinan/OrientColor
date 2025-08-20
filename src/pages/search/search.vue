<template>
  <view class="content">
    <view class="head">
      <view class="tab-container">
        <view class="tab">
          <view
            class="tab-item"
            :class="{ active: activeTab === 'text' }"
            @click="switchTab('text')"
          >
            文字检索
          </view>
          <view
            class="tab-item"
            :class="{ active: activeTab === 'color' }"
            @click="switchTab('color')"
          >
            颜色检索
          </view>
          <view
            class="tab-item"
            :class="{ active: activeTab === 'image' }"
            @click="switchTab('image')"
          >
            图象检索
          </view>
        </view>
      </view>
    </view>
    <view class="page">
      <!-- 添加过渡效果容器 -->
      <transition :name="slideDirection" mode="out-in">
        <!-- 文字检索页面 -->
        <view v-if="activeTab === 'text'" key="text">
          <text-search></text-search>
        </view>
        <!-- 颜色检索页面 -->
        <view v-else-if="activeTab === 'color'" key="color">
          <color-search></color-search>
        </view>
        <!-- 图像检索页面 -->
        <view v-else-if="activeTab === 'image'" key="image">
          <image-search></image-search>
        </view>
      </transition>
    </view>
  </view>
</template>

<script>
// 引入三个子组件
import textSearch from "@/components/search/text-search/text-search.vue";
import colorSearch from "@/components/search/color-search/color-search.vue";
import imageSearch from "@/components/search/image-search/image-search.vue";

export default {
  components: {
    textSearch,
    colorSearch,
    imageSearch,
  },
  data() {
    return {
      activeTab: "text",
      slideDirection: "slide-left", // 添加滑动方向数据
    };
  },
  methods: {
    switchTab(tab) {
      // 判断滑动方向
      const tabs = ["text", "color", "image"];
      const currentIndex = tabs.indexOf(this.activeTab);
      const targetIndex = tabs.indexOf(tab);

      // 根据标签索引设置滑动方向
      if (targetIndex > currentIndex) {
        this.slideDirection = "slide-left";
      } else {
        this.slideDirection = "slide-right";
      }

      this.activeTab = tab;
    },
  },
  // 页面加载时根据路径参数设置默认tab
  onLoad(options) {
    if (options.tab) {
      this.activeTab = options.tab;
    }
  },
};
</script>

<style>
.content {
  background-color: #f1e9d8;
}

.head {
  display: flex;
  flex-direction: column;
}


.tab-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 50rpx;
}

.tab {
  display: flex;
  width: 60%;
  height: 50rpx;
  justify-content: space-between;
  background-color: rgba(159, 119, 53, 0.3);
  border-radius: 48rpx;
  padding: 8rpx;
}

.tab-item {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  color: #000000;
  background-color: transparent;
  font-size: 28rpx;
  transition: all 0.3s ease;
  border-radius: 40rpx;
  margin: 0 4rpx;
}

.tab-item.active {
  color: #000;
  font-weight: bold;
  background-color: #fff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.tab-item:not(.active):hover {
  background-color: rgba(159, 119, 53, 0.1);
  color: #9f7735;
}

.page {
  padding: 40rpx 0;
  position: relative;
  height: 100vh;
}

/* 添加滑动动画样式 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  position: absolute;
  top: 0;
  width: 100%;
  transition: all 0.3s ease;
}

.slide-left-enter {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 确保当前活动页面正常显示 */
.page > view {
  position: relative;
}
</style>