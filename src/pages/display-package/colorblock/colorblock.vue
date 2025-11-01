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

      <!-- 用于生成图片的canvas -->
      <canvas
        canvas-id="colorCanvas"
        id="colorCanvas"
        style="
          position: absolute;
          left: -1000px;
          top: -1000px;
          width: 500px;
          height: 500px;
        "
      >
      </canvas>

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
                <text class="info-label">LCH</text>
                <text
                  class="info-value"
                  @click="navigateToGroup('LCH', colorData.lch)"
                  >{{ colorData.lch || "-" }}</text
                >
              </view>
              <view class="info-item">
                <text class="info-label">前缀名</text>
                <text
                  class="info-value link"
                  @click="navigateToGroup('前缀名', colorData.prefix)"
                  >{{ colorData.prefix || "-" }}</text
                >
              </view>
              <view class="info-item">
                <text class="info-label">色调</text>
                <text
                  class="info-value link"
                  @click="navigateToGroup('色调', colorData.tone)"
                  >{{ colorData.tone || "-" }}</text
                >
              </view>
              <view class="info-item">
                <text class="info-label">色相</text>
                <text
                  class="info-value link"
                  @click="navigateToGroup('色相名', colorData.hue)"
                >
                  {{ colorData.hue
                  }}{{ colorData.englishHue ? " " + colorData.englishHue : "" }}
                </text>
              </view>
            </view>
          </view>
        </view>

        <view class="technical-details">
          <view class="info-grid-wrapper">
            <view class="info-grid with-dividers">
              <view class="info-item">
                <text class="info-label">彩度分列</text>
                <text
                  class="info-value link"
                  @click="navigateToGroup('彩度分列', colorData.chroma)"
                  >{{ colorData.chroma || "-" }}</text
                >
              </view>
              <view class="info-item">
                <text class="info-label">色谱分列</text>
                <text
                  class="info-value link"
                  @click="navigateToGroup('色谱分列', colorData.graphy)"
                  >{{ colorData.graphy || "-" }}</text
                >
              </view>
              <view class="info-item">
                <text class="info-label">明度级序</text>
                <text
                  class="info-value link"
                  @click="navigateToGroup('明度级序', colorData.lightness)"
                  >{{ colorData.lightness || "-" }}</text
                >
              </view>
              <view class="info-item">
                <text class="info-label">色彩来源类型</text>
                <text
                  class="info-value link"
                  @click="navigateToGroup('色彩来源类型', colorData.sourcetype)"
                  >{{ colorData.sourcetype || "-" }}</text
                >
              </view>
              <view class="info-item double-width">
                <text class="info-label">色彩来源</text>
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
                <text class="info-label">CMYK</text>
                <text class="info-value">{{ colorData.cmyk || "-" }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">CIE-Lab</text>
                <text class="info-value">{{ colorData.cielab || "-" }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">RGB</text>
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

    <!-- 保存成功弹窗 -->
    <SaveSuccessModal
      :visible="showSaveSuccessModal"
      title="保存色块壁纸成功！"
      description="请到系统相册中查看详情"
      iconSrc="/static/image.png"
      @confirm="showSaveSuccessModal = false"
    />
  </view>
</template>

<script>
import SaveSuccessModal from "@/components/colorblock/SaveSuccessModal.vue";
import { getColorDetail } from "../api/colorblock.js";

export default {
  components: {
    SaveSuccessModal,
  },
  data() {
    return {
      colorData: {
        sources: [],
      },
      parentColor: "",
      secondaryColor: "",
      tertiaryColor: "",
      titlePath: "",
      showSources: false,
      descriptionExpanded: false,
      originalPosition: null,
      descriptionWrapperHeight: "auto", // 用于保持占位高度
      scrollTop: 0, // 页面滚动位置
      showSaveSuccessModal: false, // 控制保存成功弹窗显示
    };
  },

  onLoad(options) {
    if (options.name) {
      // 构造请求参数
      const params = {};
      if (options.id) {
        params.id = options.id;
      }
      if (options.name) {
        params.name = decodeURIComponent(options.name);
      }

      // 调用API获取颜色详情
      this.fetchColorDetail(params);

      // 使用 colorData 中的 title 字段作为页面标题
      uni.setNavigationBarTitle({
        title:
          this.colorData.title ||
          this.colorData.name ||
          decodeURIComponent(options.name),
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
    // 获取颜色详情数据
    async fetchColorDetail(params) {
      try {
        const res = await getColorDetail(params);
        if (res.status === "success") {
          this.colorData = {
            ...this.colorData,
            ...res.data,
          };

          // 更新页面标题
          uni.setNavigationBarTitle({
            title: this.colorData.title || this.colorData.name,
          });
        } else {
          console.error("获取颜色详情失败:", res.message);
          uni.showToast({
            title: "获取数据失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取颜色详情异常:", error);
        uni.showToast({
          title: "数据加载异常",
          icon: "none",
        });
      }
    },

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
        query.select(".description-container-wrapper").boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec((res) => {
          if (res[0] && res[1]) {
            const containerRect = res[0];
            const scrollData = res[1];

            this.originalPosition = {
              top: containerRect.top + scrollData.scrollTop,
              left: containerRect.left,
              width: containerRect.width,
            };

            // 保存展开前的高度，用于占位 - 使用固定高度200rpx
            this.descriptionWrapperHeight = "200rpx";
            this.descriptionExpanded = true;
          }
        });
      } else {
        this.descriptionExpanded = false;
        // 收起时重置高度
        this.descriptionWrapperHeight = "auto";
      }
    },
    navigateToGroup(label, value) {
      if (value && value !== "-") {
        uni.navigateTo({
          url: `/pages/display-package/group/group?label=${encodeURIComponent(
            label
          )}&value=${encodeURIComponent(value)}`,
        });
      }
    },
    toggleFavorite() {
      console.log("toggleFavorite");
      // 生成纯色背景图片并保存到相册
      this.generateAndSaveImage();
    },

    // 生成纯色背景图片并保存到相册
    generateAndSaveImage() {
      // 创建画布上下文
      const ctx = uni.createCanvasContext("colorCanvas", this);

      // 设置画布大小
      const width = 500;
      const height = 500;

      // 绘制纯色背景
      ctx.setFillStyle(this.colorData.value);
      ctx.fillRect(0, 0, width, height);

      // 绘制颜色名称
      ctx.setFontSize(30);
      ctx.setFillStyle("#FFFFFF");
      ctx.setTextAlign("center");
      ctx.setTextBaseline("middle");
      ctx.fillText(this.colorData.name, width / 2, height / 2 - 20);

      // 绘制颜色值
      ctx.setFontSize(24);
      ctx.setFillStyle("rgba(255, 255, 255, 0.8)");
      ctx.fillText(this.colorData.value, width / 2, height / 2 + 20);

      // 绘制完成，导出图片并保存到相册
      ctx.draw(false, () => {
        // 延迟一会儿确保绘制完成
        setTimeout(() => {
          uni.canvasToTempFilePath(
            {
              canvasId: "colorCanvas",
              success: (res) => {
                // 保存到相册
                this.saveImageToPhotosAlbum(res.tempFilePath);
              },
              fail: (err) => {
                console.error("导出图片失败:", err);
                uni.showToast({
                  title: "图片生成失败",
                  icon: "none",
                });
              },
            },
            this
          );
        }, 100);
      });
    },

    // 保存图片到相册
    saveImageToPhotosAlbum(tempFilePath) {
      // 检查是否授权相册权限
      uni.getSetting({
        success: (res) => {
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            // 请求授权
            uni.authorize({
              scope: "scope.writePhotosAlbum",
              success: () => {
                // 授权成功，保存图片
                this.doSaveImage(tempFilePath);
              },
              fail: () => {
                // 用户拒绝授权，引导用户手动授权
                uni.showModal({
                  title: "保存图片需要授权",
                  content: "请在设置中手动授权相册权限",
                  confirmText: "去设置",
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      uni.openSetting();
                    }
                  },
                });
              },
            });
          } else {
            // 已有授权，直接保存图片
            this.doSaveImage(tempFilePath);
          }
        },
      });
    },

    // 执行保存图片操作
    doSaveImage(tempFilePath) {
      uni.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          console.log("图片保存成功，准备显示弹窗");
          // 使用 setTimeout 确保状态更新
          setTimeout(() => {
            console.log("设置showSaveSuccessModal为true");
            this.showSaveSuccessModal = true;
            console.log(
              "当前showSaveSuccessModal值:",
              this.showSaveSuccessModal
            );
          }, 0);
        },
        fail: (err) => {
          console.error("保存图片失败:", err);
          uni.showToast({
            title: "保存失败",
            icon: "none",
          });
        },
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
  width: calc(100% - 10rpx); /* 与原始容器保持一致的宽度计算 */
  box-sizing: border-box;
  max-height: 300rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
  left: 0; /* 确保定位准确 */
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
  height: 100rpx;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

/* 展开状态 - 滚动区域 */
.description-content.expanded {
  background-color: #e2f7dc;
  padding-bottom: 60rpx;
  max-height: 200rpx; /* 设置最大高度以启用滚动 */
  height: 200rpx;
  overflow-y: auto; /* 启用垂直滚动 */
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
  align-items: center;
  margin: 20rpx 0;
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
  padding: 15rpx;
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
  padding: 10rpx 5rpx;
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
  font-size: 22rpx;
  margin: 5rpx 0;
}

.info-content.info-grid .info-row .info-value {
  position: relative;
  width: 50%;
  text-align: center;
  font-size: 22rpx;
  margin: 5rpx 0;
}

.info-content.info-grid::before {
  content: "";
  position: absolute;
  top: 15%;
  bottom: 15%;
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

/* 基本信息区域的特殊样式 - 每行两个项目 */
.basic-info .info-grid.with-dividers .info-item {
  width: 50%;
}

.basic-info .info-grid.with-dividers .info-item.double-width {
  width: 100%;
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

/* 基本信息区域的垂直分割线 */
.basic-info .info-grid.with-dividers .info-item:not(:nth-child(2n))::before {
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

/* 基本信息区域的水平分割线 */
.basic-info .info-grid.with-dividers .info-item:nth-child(-n + 2)::after {
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