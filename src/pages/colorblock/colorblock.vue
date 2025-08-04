<template>
  <view class="container">
    <view class="color-detail">
      <!-- 大型颜色预览块 -->
      <view
        class="color-preview-large"
        :style="{ backgroundColor: colorData.value }"
      >
        <text class="color-id" v-if="colorData.no">{{ colorData.no }}</text>
        <text class="color-name">{{ colorData.name }}</text>
      </view>

      <!-- 颜色描述 -->
      <view class="color-description">
        <text>{{ colorData.description }}</text>
      </view>

      <!-- 基本信息区域 -->
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
              <text class="info-value">{{ colorData.englishHue || "-" }}</text>
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
              <text class="info-value">{{ colorData.sourcetype || "-" }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">图形类型1</text>
              <text class="info-value link" @click="viewMacroPhoto">
                查看宏观照片
              </text>
            </view>
            <view class="info-item">
              <text class="info-label">图像类型2</text>
              <text class="info-value link" @click="viewMicroPhoto">
                查看微观照片
              </text>
            </view>
          </view>
        </view>
      </view>

      <view class="technical-info">
        <view class="section-title-horizontal">
          <text class="title-text">颜色模型</text>
          <!-- 给 info-content 添加切角边框样式 -->
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
  </view>
</template>

<script>
// 静态数据定义保持不变
const colorDatabase = {
  上好大绿: {
    id: 1,
    no: "B-1-12",
    name: "上好大绿",
    value: "#2E8B57",
    description:
      "来自明清官式建筑彩画标准色谱。单色样块使用的实验颜料来源包括日本中川凤凰堂和国产姜思序堂特级二青等。彩度较高，给人奢华贵重、典雅的视觉感受。",
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
    macro: "https://placebear.com/340/340",
    microcosmic: "https://placebear.com/440/440",
    labch: "L69C60H",
    rgb: "(44, 108, 76)",
  },
};

export default {
  data() {
    return {
      colorData: {},
      parentColor: "",
      secondaryColor: "",
      tertiaryColor: "",
      titlePath: "",
    };
  },

  onLoad(options) {
    // 接收传递的参数
    if (options.name) {
      const colorName = decodeURIComponent(options.name);

      // 从静态数据库获取数据或使用传递的参数
      this.colorData = colorDatabase[colorName] || {
        name: colorName,
        value: options.value ? decodeURIComponent(options.value) : "#ccc",
        id: options.id || null,
        description: options.description || "",
      };

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

      // 设置导航栏标题
      uni.setNavigationBarTitle({
        title: this.titlePath,
      });
    }
  },

  methods: {
    viewMacroPhoto() {
      if (this.colorData.macro) {
        uni.previewImage({
          urls: [this.colorData.macro],
        });
      }
    },

    viewMicroPhoto() {
      if (this.colorData.microcosmic) {
        uni.previewImage({
          urls: [this.colorData.microcosmic],
        });
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
}

.color-detail {
  background-color: white;
  border-radius: 16rpx;
  padding: 30rpx;
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

.color-description {
  font-size: 24rpx;
  line-height: 1.5;
  color: #333;
  margin-bottom: 40rpx;
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

/* 为颜色模型区域添加分割线样式 */
.info-content.info-grid .info-row {
  position: relative;
  padding: 15rpx 10rpx;
  display: flex;
  width: 100%;
  z-index: 1; /* 确保内容在分割线上方 */
}

/* 添加底部水平分割线 */
.info-content.info-grid .info-row:not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20rpx;
  right: 20rpx;
  height: 1px;
  background-color: #e8e1d7;
  z-index: 0; /* 确保分割线在内容下方 */
}

/* 添加列分割线 - 在Labch值和RGB值之间 */
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


/* 在整个区域添加垂直中线，使其贯穿所有行 */
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

/* 新增分割线样式 */
.info-grid.with-dividers {
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

.info-grid.with-dividers .info-item {
  width: 33.33%;
  box-sizing: border-box;
  position: relative;
}

/* 使用伪元素创建更短的分割线 */
.info-grid.with-dividers .info-item:not(:nth-child(3n))::before {
  content: "";
  position: absolute;
  right: 0;
  top: 20%;
  height: 70%;
  width: 1px;
  background-color: #e8e1d7;
}

/* 移除最后一个信息项的右边框 */
.info-grid.with-dividers .info-item:nth-child(3n) {
  border-right: none;
}

.info-grid.with-dividers .info-item:not(:nth-last-child(-n + 3))::after {
  content: "";
  position: absolute;
  bottom: -15rpx; /* 调整与信息项的距离 */
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e8e1d7;
}

/* 保持原有的clip-path和背景效果 */
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

.info-item {
  width: 33.33%;
  padding: 15rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 链接样式 */
.link {
  color: #c69c6d;
  text-decoration: underline;
}

.link:active {
  color: #c69c6d;
}
</style>