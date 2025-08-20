<template>
  <view class="container">
    <view class="color-detail">
      <!-- 大型颜色预览块 (始终显示) -->
      <view
        class="color-preview-large"
        :style="{ backgroundColor: colorData.value }"
      >
        <text class="color-id" v-if="colorData.no">{{ colorData.no }}</text>
        <view class="color-name-row">
          <text class="color-name">{{ colorData.name }}</text>
          <image
            class="favorite-icon"
            src="/static/favorite.png"
            @click="toggleFavorite"
          />
        </view>
      </view>

      <!-- 切换内容区域 -->
      <view v-if="!showSources" class="description-wrapper">
        <!-- 默认显示的颜色信息 -->
        <view
          class="description-container-wrapper"
          :style="{ height: descriptionWrapperHeight }"
        >
          <view
            class="description-container"
            :class="{ 'expanded-container': descriptionExpanded }"
          >
            <!-- 未展开状态下的文本截断显示 -->
            <view
              v-if="!descriptionExpanded"
              class="description-content collapsed"
            >
              <rich-text :nodes="formattedDescription"></rich-text>
            </view>

            <!-- 展开状态下的滚动显示 -->
            <scroll-view v-else class="description-content expanded" scroll-y>
              <rich-text :nodes="formattedDescription"></rich-text>
            </scroll-view>

            <text class="toggle-btn" @click="toggleDescription">
              {{ descriptionExpanded ? "收起" : "详情" }}
            </text>
          </view>
        </view>

        <view class="basic-info">
          <view class="section-title">颜色信息</view>
          <view class="info-grid-wrapper">
            <view class="info-grid with-dividers">
              <view class="info-item">
                <text class="info-label">近似色编号</text>
                <text class="info-value">{{
                  colorData.approxColorCode || "-"
                }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">LCH</text>
                <text class="info-value">{{ colorData.lch || "-" }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">前缀名</text>
                <text class="info-value">{{ colorData.prefix || "-" }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">色调</text>
                <text class="info-value">{{ colorData.tone || "-" }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">色相</text>
                <text class="info-value">{{ colorData.hue || "-" }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">英文色相名</text>
                <text class="info-value">{{
                  colorData.englishHue || "-"
                }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="technical-details">
          <view class="info-grid-wrapper">
            <view class="info-grid with-dividers">
              <view class="info-item">
                <text class="info-label">彩度分列</text>
                <text class="info-value">{{ colorData.chroma || "-" }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">色谱分列</text>
                <text class="info-value">{{ colorData.graphy || "-" }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">明度级序</text>
                <text class="info-value">{{ colorData.lightness || "-" }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">色彩来源类型</text>
                <text class="info-value">{{
                  colorData.sourcetype || "-"
                }}</text>
              </view>
              <view class="info-item double-width">
                <text class="info-label">图形来源</text>
                <text class="info-value link" @click="toggleSources">
                  点击查看图片来源→
                </text>
              </view>
            </view>
          </view>
        </view>

        <view class="technical-info">
          <view class="section-title-horizontal">
            <text class="title-text">颜色模型</text>
            <view class="info-content info-grid">
              <view class="info-row">
                <text class="info-label">Labch值</text>
                <text class="info-value">{{ colorData.labch || "-" }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">RGB值</text>
                <text class="info-value">{{ colorData.rgb || "-" }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 来源信息展示区 (点击后显示) -->
      <view v-else class="sources-view">
        <view class="section-title">色彩来源</view>
        <view class="back-link-container">
          <text class="hint-text">点击图片查看大图</text>
          <text class="hint-text link" @click="toggleSources"
            >← 返回颜色信息</text
          >
        </view>

        <view class="source-list">
          <view
            class="source-item"
            v-for="(source, index) in colorData.sources"
            :key="index"
          >
            <view class="source-content">
              <!-- 左侧：信息项 -->
              <view class="source-info">
                <view class="info-item">
                  <text class="info-label">来源 ：</text>
                  <text class="info-value info-value-bold">{{
                    source.name
                  }}</text>
                </view>
                <view class="info-item">
                  <text class="info-label">取样位置\n</text>
                  <text class="info-value">{{ source.location }}</text>
                </view>
                <view class="info-item">
                  <text class="info-label">微观照片</text>
                  <image
                    class="source-image-thumb"
                    :src="source.microcosmic"
                    @click="viewPhoto(source.microcosmic)"
                    mode="aspectFill"
                  />
                </view>
              </view>

              <!-- 右侧：宏观图片 -->
              <view class="source-image">
                <text class="info-label">宏观照片</text>
                <image
                  class="source-image-large"
                  :src="source.macro"
                  @click="viewPhoto(source.macro)"
                  mode="aspectFill"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const colorDatabase = {
  id: 1,
  no: "B-1-12",
  name: "上好大绿",
  value: "#2E8B57",
  description:
    "主要来自永乐宫色谱。\n鲜三绿是永乐宫色彩中彩度较高的三绿。\n鲜三绿见于三清殿、纯阳殿彩画中色彩较为鲜艳的部分，可能是老化、污染较轻的元代彩画色彩，也有可能是后世补绘的色彩。相较于三绿，鲜三绿在视觉上略少几分温润，更有青春活力。\n也可见于开化寺色谱和明清官式建筑彩画色谱。",
  approxColorCode: "45",
  lch: "L69C60H",
  prefix: "上好",
  tone: "暗",
  hue: "绿色",
  englishHue: "G",
  chroma: "45",
  graphy: "L69C60H",
  lightness: "上好",
  sourcetype: "暗",
  labch: "L69C60H",
  rgb: "(44, 108, 76)",
  sources: [
    {
      name: "纯阳殿彩画",
      location: "纯阳殿前檐内侧 明间额枋 4",
      macro: "https://placebear.com/180/200",
      microcosmic: "https://placebear.com/440/440",
    },
    {
      name: "三清殿彩画",
      location: "三清殿当心间 西缝四椽袱 5",
      macro: "https://placebear.com/180/200",
      microcosmic: "https://placebear.com/640/640",
    },
  ],
};

export default {
  data() {
    return {
      colorData: {},
      parentColor: "",
      secondaryColor: "",
      tertiaryColor: "",
      titlePath: "",
      showSources: false,
      descriptionExpanded: false,
      originalPosition: null,
      descriptionWrapperHeight: "auto", // 用于保持占位高度
      scrollTop: 0, // 页面滚动位置
    };
  },

  onLoad(options) {
    if (options.name) {
      const colorName = decodeURIComponent(options.name);
      const staticColorData = colorDatabase;

      if (staticColorData) {
        this.colorData = {
          ...staticColorData,
          id: options.id || staticColorData.id,
          name: colorName,
          value: staticColorData.value,
        };
      } else {
        this.colorData = {
          name: colorName,
          value: options.value ? decodeURIComponent(options.value) : "#ccc",
          id: options.id || null,
          description: options.description || "",
          no: options.no || "",
          approxColorCode: options.approxColorCode || "",
          lch: options.lch || "",
          prefix: options.prefix || "",
          tone: options.tone || "",
          hue: options.hue || "",
          englishHue: options.englishHue || "",
          chroma: options.chroma || "",
          graphy: options.graphy || "",
          lightness: options.lightness || "",
          sourcetype: options.sourcetype || "",
          labch: options.labch || "",
          rgb: options.rgb || "",
          sources: options.sources || [],
        };
      }

      this.parentColor = options.parentColor
        ? decodeURIComponent(options.parentColor)
        : "";
      this.secondaryColor = options.secondaryColor
        ? decodeURIComponent(options.secondaryColor)
        : "";
      this.tertiaryColor = options.tertiaryColor
        ? decodeURIComponent(options.tertiaryColor)
        : "";
      this.titlePath = options.titlePath
        ? decodeURIComponent(options.titlePath)
        : colorName;

      uni.setNavigationBarTitle({
        title: this.titlePath,
      });
    }
  },

  computed: {
    formattedDescription() {
      if (!this.colorData.description) return "";

      // 处理换行和缩进
      let desc = this.colorData.description
        .replace(/\n/g, "<br>")
        .replace(/\t/g, "&emsp;&emsp;");

      return `<div style="line-height:1.6;">${desc}</div>`;
    },

    expandedStyle() {
      if (!this.originalPosition) return {};
      return {
        position: "absolute",
        top: this.originalPosition.top - this.scrollTop + "px",
        left: this.originalPosition.left + "px",
        width: this.originalPosition.width + "px",
        zIndex: "1000",
      };
    },
  },

  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },

  methods: {
    toggleSources() {
      this.showSources = !this.showSources;
    },
    viewPhoto(url) {
      if (url) {
        uni.previewImage({
          urls: [url],
        });
      }
    },
    toggleDescription() {
      if (!this.descriptionExpanded) {
        // 获取原始位置信息
        const query = uni.createSelectorQuery();
        query.select(".description-container").boundingClientRect();
        query.exec((res) => {
          if (res[0]) {
            this.originalPosition = {
              top: res[0].top + this.scrollTop, // 加上滚动位置
              left: res[0].left,
              width: res[0].width,
            };

            // 保存展开前的高度，用于占位
            this.descriptionWrapperHeight = res[0].height + "px";
            this.descriptionExpanded = true;
          }
        });
      } else {
        this.descriptionExpanded = false;
        // 收起时重置高度
        this.descriptionWrapperHeight = "auto";
      }
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

.color-detail {
  border-radius: 16rpx;
  padding: 30rpx;
  position: relative;
}

.color-preview-large {
  height: 200rpx;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40rpx;
  position: relative;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.color-name {
  font-size: 42rpx;
  font-weight: bold;
  color: white;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.color-id {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10rpx;
}

.color-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.favorite-icon {
  width: 40rpx;
  height: 40rpx;
  cursor: pointer;
}

/* 描述容器包装器 - 保持占位 */
.description-container-wrapper {
  position: relative;
  margin-bottom: 30rpx;
}

/* 描述容器 - 基础样式 */
.description-container {
  position: relative;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  background-color: rgba(226, 247, 220, 0.2);
}

/* 展开状态 */
.description-container.expanded-container {
  position: absolute;
  z-index: 1000;
  width: calc(100% - 40rpx); /* 减去左右padding */
  box-sizing: border-box; /* 确保padding不影响宽度计算 */
}

/* 描述内容 */
.description-content {
  padding: 20rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #333;
}

/* 收起状态 - 文本截断显示 */
.description-content.collapsed {
  height: 140rpx;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

/* 展开状态 - 滚动区域 */
.description-content.expanded {
  background-color: #e2f7dc;
  padding-bottom: 60rpx;
}

/* 切换按钮 */
.toggle-btn {
  display: block;
  text-align: right;
  color: #007aff;
  font-size: 24rpx;
  padding: 10rpx 20rpx;
  text-decoration: underline;
  background-color: inherit;
}

/* 展开时按钮居中显示 */
.description-container.expanded-container .toggle-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-color: #e2f7dc;
  z-index: 1001;
}

.basic-info,
.technical-details,
.technical-info {
  position: relative;
  z-index: 1;
}

.color-description {
  font-size: 24rpx;
  line-height: 1.5;
  color: #333;
  margin-bottom: 40rpx;
}

.basic-info {
  z-index: 100;
  position: sticky;
  top: 0;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #9f7735;
  margin: 30rpx 0 20rpx;
  padding-bottom: 10rpx;
  text-align: center;
}

.section-title-horizontal {
  display: flex;
  margin: 30rpx 0;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #9f7735;
  width: 160rpx;
  display: flex;
  align-items: center;
}

.info-content {
  flex: 1;
  padding: 20rpx;
}

.info-content.info-grid {
  flex-direction: column;
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
  display: flex;
  position: relative;
}

.info-content.info-grid .info-row {
  position: relative;
  padding: 15rpx 10rpx;
  display: flex;
  width: 100%;
  z-index: 1;
}

.info-content.info-grid .info-row:not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20rpx;
  right: 20rpx;
  height: 1px;
  background-color: #e8e1d7;
  z-index: 0;
}

.info-content.info-grid .info-row .info-label {
  position: relative;
  width: 50%;
  text-align: center;
}

.info-content.info-grid .info-row .info-value {
  position: relative;
  width: 50%;
  text-align: center;
}

.info-content.info-grid::before {
  content: "";
  position: absolute;
  top: 20%;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  background-color: #e8e1d7;
  z-index: 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 24rpx;
  font-weight: bold;
  margin-top: 10rpx;
  margin-bottom: 20rpx;
  text-align: center;
}

.info-value {
  font-size: 24rpx;
  font-weight: bold;
  color: #c69c6d;
  text-align: center;
}

.info-grid.with-dividers {
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

.info-grid.with-dividers .info-item {
  width: 33.33%;
  box-sizing: border-box;
  position: relative;
  padding: 15rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.info-grid.with-dividers .info-item.double-width {
  width: 66.66%;
}

/* 垂直分割线 */
.info-grid.with-dividers .info-item:not(:nth-child(3n))::before {
  content: "";
  position: absolute;
  right: 0;
  top: 20%;
  height: 70%;
  width: 1px;
  background-color: #e8e1d7;
}

/* 双宽度项不需要右边框 */
.info-grid.with-dividers .info-item.double-width::before {
  display: none;
}

/* 水平分割线 - 前三项 */
.info-grid.with-dividers .info-item:nth-child(-n + 3)::after {
  content: "";
  position: absolute;
  bottom: -15rpx;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e8e1d7;
}

/* 水平分割线 - 第四项 */
.info-grid.with-dividers .info-item:nth-child(4)::after {
  content: "";
  position: absolute;
  bottom: -15rpx;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e8e1d7;
}

/* 双宽度项不需要底部边框 */
.info-grid.with-dividers .info-item.double-width::after {
  display: none;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20rpx;
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
}

.link {
  color: #007aff;
  text-decoration: underline;
}

/* 来源信息区域样式 */
.sources-view {
  margin-top: 20rpx;
}

.back-link-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.hint-text {
  font-size: 24rpx;
  color: #999;
}

.source-list {
  margin-top: 20rpx;
}

.source-content {
  display: flex;
  flex-direction: row;
  margin-bottom: 40rpx;
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 12rpx;
  max-height: 500rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.source-info {
  flex: 1;
  padding-right: 20rpx;
  display: flex;
  flex-direction: column;
}

.source-image {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.source-info .info-item:not(:first-child) {
  margin-bottom: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.source-info .info-item:last-child {
  margin-bottom: 0;
}

.source-info .info-item:not(:last-child) {
  border-bottom: 1px solid #e8e1d7;
  padding-bottom: 10rpx;
}

.source-info .info-label {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
  text-align: center;
}

.source-info .info-value {
  font-size: 28rpx;
  color: #333;
  text-align: center;
  font-weight: normal;
}

/* 只对"取样位置"的值应用样式 */
.source-info .info-item:nth-child(2) .info-value {
  padding: 0 10rpx;
  color: #c69c6d;
}

.source-info .info-value.info-value-bold {
  font-weight: bold;
}

.source-image-thumb {
  width: 100%;
  height: 160rpx;
  background-color: #e8e1d7;
  margin-bottom: 10rpx;
}

.source-image-large {
  width: 100%;
  flex: 1;
  min-height: 200rpx;
  background-color: #e8e1d7;
  margin-bottom: 10rpx;
}

.source-image .info-label {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
  text-align: center;
}
</style>