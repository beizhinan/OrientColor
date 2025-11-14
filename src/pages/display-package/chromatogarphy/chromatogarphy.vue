<template>
  <view class="container">
    <view class="content">
      <!-- 顶部颜色信息展示 -->
      <view
        class="info"
        :style="{ backgroundImage: 'url(' + colorData.imgurl + ')' }"
      >
        <view class="image-overlay"></view>
        <view class="description-overlay">
          <text class="title">{{ colorData.name }}\n</text>
          <text class="description-text">{{ colorData.description }}</text>
        </view>
        <!-- 添加文字链接 -->
        <text class="info-toggle-btn" @click="openPopup"> 查看全文 </text>
      </view>

      <!-- 颜色卡片列表 -->
      <view class="color-card-list">
        <!-- 空状态显示 -->
        <view v-if="colorData.colors.length === 0" class="empty-state">
          <text class="empty-title">暂无颜色数据</text>
          <text class="empty-desc">当前色谱暂时没有可用的颜色数据</text>
          <button class="refresh-btn" @click="loadChromatographyData">
            重新加载
          </button>
        </view>

        <!-- 颜色卡片 -->
        <preview-card
          v-else
          v-for="(color, index) in colorData.colors"
          :key="index"
          :color-name="color.name"
          :color-code="color.code"
          @click="goToColorDetail(color)"
          class="color-item"
        />

        <!-- 添加占位元素，确保最后一行正确对齐 -->
        <view
          class="color-card-placeholder"
          v-for="n in 2"
          :key="'placeholder' + n"
          v-if="colorData.colors.length > 0"
        ></view>
      </view>

      <!-- 弹窗组件 -->
      <popup-detail
        :visible="showPopup"
        :title="colorData.name"
        :description="colorData.fullDescription"
        @close="closePopup"
      />
    </view>
  </view>
</template>

<script>
import { getChromatographyDetail } from "../api/chromatography.js";
import PreviewCard from "@/components/chromatogarphy/preview-card.vue";
import PopupDetail from "@/components/chromatogarphy/popup-detail.vue";

export default {
  components: {
    PreviewCard,
    PopupDetail, // 注册弹窗组件
  },
  data() {
    return {
      id: null,
      title: "",
      colorData: {
        name: "",
        description: "", // 页面显示的部分文本
        fullDescription: "", // 完整文本，用于传递给弹窗
        imgurl: "",
        colors: [],
      },
      showPopup: false, // 控制弹窗显示状态
      loading: false, // 加载状态
    };
  },
  onLoad(options) {
    if (options.id && options.title) {
      this.id = options.id;
      this.title = decodeURIComponent(options.title);

      // 获取色谱数据
      this.loadChromatographyData();
    }

    uni.setNavigationBarTitle({
      title: this.title + "色谱",
    });

    uni.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#F8F8F8",
    });
  },
  methods: {
    // 加载色谱数据
    async loadChromatographyData() {
      // 防止重复加载
      if (this.loading) return;

      this.loading = true;

      // 显示加载提示
      uni.showLoading({
        title: "加载中...",
        mask: true,
      });

      try {
        const res = await getChromatographyDetail(this.id, this.title);
        if (res.status === "success") {
          // 更新页面标题和背景图
          uni.setNavigationBarTitle({
            title: (res.data.title || this.title) + "色谱",
          });

          // 设置顶部信息
          this.colorData.name = res.data.title || this.title;
          // 保存完整描述文本到fullDescription字段
          this.colorData.fullDescription = res.data.description;
          // 页面只显示部分文本（前几行）
          this.colorData.description =
            res.data.description?.desc || res.data.description || "";
          this.colorData.imgurl = res.data.headerImage || "";
          this.colorData.colors = res.data.colors || [];

          // 如果没有颜色数据，显示提示信息
          if (this.colorData.colors.length === 0) {
            uni.showToast({
              title: "暂无颜色数据",
              icon: "none",
              duration: 2000,
            });
          }
        } else {
          console.error("获取色谱数据失败:", res.message);
          uni.showToast({
            title: "获取数据失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取色谱数据异常:", error);
        uni.showToast({
          title: "数据加载异常",
          icon: "none",
        });
      } finally {
        this.loading = false;
        uni.hideLoading();
      }
    },

    // 跳转到颜色详情页面
    goToColorDetail(color) {
      uni.navigateTo({
        url:
          `/pages/display-package/colorblock/colorblock?` +
          `name=${encodeURIComponent(color.name)}&` +
          `id=${color.id || ""}&`,
      });
    },

    // 打开弹窗
    openPopup() {
      this.showPopup = true;
      console.log("打开弹窗");
    },

    // 关闭弹窗
    closePopup() {
      this.showPopup = false;
      console.log("关闭弹窗");
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #fffbf6;
  min-height: 150vh;
}

.content {
  display: flex;
  flex-direction: column;
}

.info {
  height: 400rpx;
  background-size: cover;
  background-position: center;
  margin-bottom: 20rpx;
  position: relative;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.description-overlay {
  position: absolute;
  top: 30%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 40rpx;
  color: white;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  letter-spacing: 3rpx;
  margin-bottom: 20rpx;
}

.info .description-text {
  font-size: 26rpx;
  letter-spacing: 3rpx;
  line-height: 30rpx;
  color: white !important;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}

/* 信息来源链接按钮 */
.info-toggle-btn {
  position: absolute;
  bottom: 10rpx;
  right: 20rpx;
  color: white;
  font-size: 24rpx;
  font-weight: bold;
  text-decoration: underline;
  z-index: 10;
  cursor: pointer;
}

.color-card-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: 30rpx;
  margin-right: 30rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
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
  min-height: 400rpx;
}

.color-item {
  width: calc(33.33% - 14rpx);
  margin-right: 20rpx;
  margin-bottom: 20rpx;
}

.color-item:nth-child(3n) {
  margin-right: 0;
}

/* 添加占位元素，确保最后一行正确对齐 */
.color-card-placeholder {
  width: calc(33.33% - 14rpx);
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  visibility: hidden;
  height: 0;
}

.color-card-placeholder:nth-child(3n) {
  margin-right: 0;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-title {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.empty-desc {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 50rpx;
  line-height: 1.6;
}

.refresh-btn {
  background-color: #deb67f;
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 20rpx 60rpx;
  font-size: 28rpx;
  box-shadow: 0 4rpx 12rpx rgba(222, 182, 127, 0.3);
}

.refresh-btn:active {
  background-color: #d4a86c;
  transform: translateY(2rpx);
}

.popup-detail {
  position: relative;
  z-index: 1000;
}
</style>