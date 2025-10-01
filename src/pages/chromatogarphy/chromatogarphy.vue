<template>
  <view class="container">
    <view class="content">
      <!-- 顶部颜色信息展示 -->
      <view
        class="info"
        :style="{ backgroundImage: 'url(' + colorData.imgurl + ')' }"
      >
        <view class="description-overlay">
          <text class="title">{{ colorData.name }}：\n</text>
          <text class="description-text">{{ colorData.description }}</text>
        </view>
        <!-- 添加文字链接 -->
        <text class="info-toggle-btn" @click="toggleInfoExpand">
          {{ isInfoExpanded ? "收起" : "词条详情" }}
        </text>
      </view>

      <!-- 主要内容区域 -->
      <view class="main-content">
        <!-- 左侧色系选择tab -->
        <view class="color-tabs">
          <view
            v-for="color in colorList"
            :key="color"
            class="tab-item"
            :class="{ active: selectedColor === color }"
            :style="
              selectedColor === color
                ? {
                    backgroundColor: colorMap[color] || '#40c860',
                    color: 'white',
                  }
                : {}
            "
            @click="selectColor(color)"
          >
            {{ color }}
          </view>
        </view>

        <!-- 右侧内容区域 -->
        <view class="right-section">
          <!-- 子颜色标签 -->
          <view class="color-tags">
            <view
              v-for="tag in currentColorTags"
              :key="tag"
              class="tag-item"
              :class="{ active: selectedTag === tag }"
              :style="selectedTag === tag ? { color: currentColorTheme } : {}"
              @click="selectTag(tag)"
            >
              {{ tag }}
            </view>
          </view>

          <!-- 可展开的描述区域 -->
          <view class="expandable-area">
            <view
              v-for="(subColor, index) in filteredColorGroups"
              :key="subColor.name"
              class="description-container"
            >
              <!-- 未展开状态下的文本截断显示 -->
              <view
                class="description-content collapsed"
              >
                <text
                  v-for="(paragraph, idx) in formatDescription(
                    subColor.description
                  )"
                  :key="idx"
                >
                  <text v-if="paragraph.isEmptyLine">\n</text>
                  <text v-else-if="paragraph.isTitle" class="section-title">{{
                    paragraph.text + "\n"
                  }}</text>
                  <text v-else>{{ paragraph.text + "\n" }}</text>
                </text>
              </view>

              <!-- 展开状态下的滚动显示（覆盖层） -->
              <view 
                v-if="expandedIndex === index" 
                class="description-content expanded overlay"
              >
                <scroll-view class="expanded-scroll" scroll-y>
                  <text
                    v-for="(paragraph, idx) in formatDescription(
                      subColor.description
                    )"
                    :key="idx"
                  >
                    <text v-if="paragraph.isEmptyLine">\n</text>
                    <text v-else-if="paragraph.isTitle" class="section-title">{{
                      paragraph.text + "\n"
                    }}</text>
                    <text v-else>{{ paragraph.text + "\n" }}</text>
                  </text>
                </scroll-view>
                
                <text class="toggle-btn overlay-btn" @click="toggleExpand(index)">
                  收起
                </text>
              </view>

              <text class="toggle-btn" @click="toggleExpand(index)" v-if="expandedIndex !== index">
                词条详情
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 三级分类区域 -->
      <view class="third-level">
        <view
          v-for="(subColor, subIndex) in filteredColorGroups"
          :key="'filtered-' + subColor.name"
        >
          <view
            v-for="(thirdLevel, thirdIndex) in subColor.children"
            :key="thirdLevel.name"
            class="color-family"
          >
            <view class="family-header">
              <text class="family-title">{{ thirdLevel.name }}</text>
              <text
                class="family-toggle-btn"
                @click="toggleThirdLevelExpand(subIndex + '-' + thirdIndex)"
              >
                {{
                  thirdLevelExpandMap[subIndex + "-" + thirdIndex]
                    ? "收起"
                    : "词条详情"
                }}
              </text>
            </view>

            <!-- 三级分类详情描述 -->
            <view
              v-if="thirdLevelExpandMap[getThirdLevelKey(subIndex, thirdIndex)]"
              class="third-level-description-container expanded-third-level-container"
            >
              <!-- 展开状态下的滚动显示 -->
              <scroll-view class="third-level-description expanded" scroll-y>
                <text
                  v-for="(paragraph, idx) in formatDescription(
                    thirdLevel.description
                  )"
                  :key="idx"
                >
                  <text v-if="paragraph.isEmptyLine">\n</text>
                  <text v-else-if="paragraph.isTitle" class="section-title">{{
                    paragraph.text + "\n"
                  }}</text>
                  <text v-else>{{ paragraph.text + "\n" }}</text>
                </text>
              </scroll-view>

              <text
                class="third-level-toggle-btn"
                @click="toggleThirdLevelExpand(subIndex + '-' + thirdIndex)"
              >
                {{
                  thirdLevelExpandMap[subIndex + "-" + thirdIndex]
                    ? "收起"
                    : "词条详情"
                }}
              </text>
            </view>

            <view class="color-palette">
              <view
                v-for="color in thirdLevel.children"
                :key="color.name"
                class="color-item"
              >
                <view
                  class="color-swatch"
                  :style="{ backgroundColor: color.value }"
                  @click="goToColorDetail(color)"
                >
                  <text class="color-label">{{ color.name }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 全屏浮层 -->
    <view v-if="isInfoExpanded" class="top-overlay">
      <scroll-view class="info-content" scroll-y>
        <text
          v-for="(info, index) in colorData.culturalInfo"
          :key="index"
          class="info-section"
        >
          <text class="info-title">{{ info.title }}</text>
          <text class="info-text">{{ info.content }}</text>
        </text>
      </scroll-view>
      <text class="info-collapse-btn" @click="toggleInfoExpand">收起</text>
    </view>
  </view>
</template>

<script>
import { getChromatographyDetail } from "@/api/chromatography.js";

export default {
  data() {
    return {
      id: null,
      title: "",
      colorList: [],
      selectedColor: "",
      selectedTag: "",
      allColorData: {},
      colorData: {
        name: "",
        imgurl: "",
        description: "",
        culturalInfo: [],
      },
      isFavorite: false,
      expandedIndex: -1,
      isInfoExpanded: false,
      thirdLevelExpandMap: {},
      // 颜色映射表，用于设置不同颜色类别的主题色
      colorMap: {
        绿: "#40c860",
        白: "#8e8e93",
        黄: "#FFD700",
        红: "#FF6B6B",
        青: "#48C9B0",
        黑: "#000000",
      },
    };
  },
  computed: {
    // 当前选中色系的所有标签
    currentColorTags() {
      const colorKey = this.selectedColor;
      // 确保数据存在再访问
      if (
        !this.allColorData[colorKey] ||
        !this.allColorData[colorKey].subColors
      ) {
        return [];
      }
      return (
        this.allColorData[colorKey].subColors.map(
          (subColor) => subColor.name
        ) || []
      );
    },

    // 根据筛选条件过滤后的颜色分组
    filteredColorGroups() {
      const colorKey = this.selectedColor;
      // 确保数据存在再访问
      if (
        !this.allColorData[colorKey] ||
        !this.allColorData[colorKey].subColors
      ) {
        return [];
      }

      const selectedGroup = this.allColorData[colorKey].subColors.find(
        (subColor) => subColor.name === this.selectedTag
      );

      return selectedGroup
        ? [
            {
              name: selectedGroup.name,
              description: selectedGroup.description,
              children: selectedGroup.children,
            },
          ]
        : [];
    },

    // 获取当前选中颜色的主题色
    currentColorTheme() {
      return this.colorMap[this.selectedColor] || "#40c860"; // 默认使用绿色
    },
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
      try {
        const res = await getChromatographyDetail(this.id, this.title);
        if (res.status === "success") {
          // 设置获取到的数据
          // 转换新数据结构为旧结构以适配UI
          const convertedData = {};
          res.data.colorOne.forEach((color) => {
            convertedData[color.name] = {
              name: color.name,
              imgurl: color.imgurl,
              description: color.description,
              culturalInfo: color.culturalInfo,
              subColors: color.colorTwo.map((subColor) => ({
                name: subColor.name,
                description: subColor.description,
                children: subColor.colorThree.map((thirdLevel) => ({
                  name: thirdLevel.name,
                  description: thirdLevel.description,
                  children: thirdLevel.colorFour,
                })),
              })),
            };
          });

          this.allColorData = convertedData;

          // 初始化颜色列表
          this.colorList = res.data.categories;

          // 设置默认选中颜色
          if (this.colorList.length > 0) {
            this.selectedColor = this.colorList[0];
            this.colorData = convertedData[this.selectedColor];

            // 更新页面标题和背景图
            uni.setNavigationBarTitle({
              title: res.data.title + "色谱",
            });

            // 设置顶部信息
            this.colorData.name = res.data.title;
            this.colorData.description = res.data.description;
            this.colorData.imgurl = res.data.headerImage;

            // 设置默认选中的标签
            if (
              this.colorData.subColors &&
              this.colorData.subColors.length > 0
            ) {
              this.selectedTag = this.colorData.subColors[0].name;
            }
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
      }
    },

    // 选择色系
    selectColor(color) {
      this.selectedColor = color;
      this.colorData = this.allColorData[color];
      // 确保数据存在再访问
      if (
        this.colorData &&
        this.colorData.subColors &&
        this.colorData.subColors.length > 0
      ) {
        this.selectedTag = this.colorData.subColors[0].name;
      }
      this.expandedIndex = -1;
    },

    // 选择标签
    selectTag(tag) {
      this.selectedTag = tag;
      this.expandedIndex = -1;
    },

    // 添加收藏切换方法
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      console.log(`收藏状态: ${this.isFavorite ? "已收藏" : "取消收藏"}`);
    },

    getThirdLevelKey(subIndex, thirdIndex) {
      return `${subIndex}-${thirdIndex}`;
    },

    // 跳转到颜色详情页面
    goToColorDetail(color) {
      let parentGroup = null;
      let grandParentGroup = null;

      // 确保数据存在再访问
      if (this.colorData.subColors) {
        for (let subColor of this.colorData.subColors) {
          for (let child of subColor.children) {
            // 确保child.children存在再访问
            if (child.children && Array.isArray(child.children)) {
              const foundColor = child.children.find(
                (c) => c.name === color.name && c.value === color.value
              );
              if (foundColor) {
                parentGroup = child;
                grandParentGroup = subColor;
                break;
              }
            }
          }
          if (parentGroup) break;
        }
      }

      let titlePath = this.selectedColor;
      if (grandParentGroup) {
        titlePath += "-" + grandParentGroup.name;
      }
      if (parentGroup) {
        titlePath += "-" + parentGroup.name;
      }

      uni.navigateTo({
        url:
          `/pages/colorblock/colorblock?` +
          `name=${encodeURIComponent(color.name)}&` +
          `value=${encodeURIComponent(color.value)}&` +
          `id=${color.id || ""}&` +
          `parentColor=${encodeURIComponent(this.selectedColor)}&` +
          `secondaryColor=${
            grandParentGroup ? encodeURIComponent(grandParentGroup.name) : ""
          }&` +
          `tertiaryColor=${
            parentGroup ? encodeURIComponent(parentGroup.name) : ""
          }&` +
          `titlePath=${encodeURIComponent(titlePath)}`,
      });
    },

    formatDescription(description) {
      if (!description) return [];

      // 按换行符分割文本
      const paragraphs = description.split("\n");
      const result = [];

      paragraphs.forEach((para) => {
        // 不再过滤空行，而是标记为空行
        if (!para.trim()) {
          result.push({
            text: "", // 空文本表示换行
            isEmptyLine: true,
            isTitle: false,
          });
          return;
        }

        // 判断是否是标题段落
        const isTitle =
          para.includes("色名释义") ||
          para.includes("历史文化背景") ||
          para.trim().endsWith("：");

        // 处理制表符
        const processedText = para.replace(/\t/g, "  ");

        result.push({
          text: processedText,
          isTitle,
          isEmptyLine: false,
        });
      });

      return result;
    },

    // 切换展开/收起方法
    toggleExpand(index) {
      this.expandedIndex = this.expandedIndex === index ? -1 : index;
    },

    // 切换信息展开状态的方法
    toggleInfoExpand() {
      this.isInfoExpanded = !this.isInfoExpanded;
    },

    // 切换三级分类详情展开状态的方法
    toggleThirdLevelExpand(index) {
      // 使用对象来存储每个三级分类的展开状态
      if (this.thirdLevelExpandMap[index]) {
        // Vue 3中可以直接删除属性
        delete this.thirdLevelExpandMap[index];
      } else {
        // Vue 3中可以直接设置属性
        this.thirdLevelExpandMap[index] = true;
      }
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
  height: 350rpx;
  background-size: cover;
  background-position: center;
  margin-bottom: 20rpx;
  position: relative;
}

.description-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 30rpx 20rpx;
  color: white;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 3rpx;
}

.info .description-text {
  font-size: 22rpx;
  color: white !important;
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
}

/* 信息浮层 */
.info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: #e2f7dc;
  padding: 20rpx;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

/* 全屏浮层 */
.top-overlay {
  position: fixed;
  top: 40rpx; /* 与顶部有一定间隔 */
  left: 0;
  right: 0;
  height: 40vh; /* 屏幕高度的三分之一 */
  background-color: #e2f7dc;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  margin: 0 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.info-content {
  flex: 1;
  font-size: 22rpx;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
}

.info-section {
  display: block;
  margin-bottom: 20rpx;
}

.info-title {
  font-size: 26rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  display: block;
}

.info-text {
  display: block;
}

.info-collapse-btn {
  align-self: center;
  color: #007aff;
  font-size: 24rpx;
  font-weight: bold;
  text-decoration: underline;
  margin-top: 10rpx;
  padding: 10rpx 20rpx;
}

/* 主内容区域 */
.main-content {
  display: flex;
  margin-bottom: 20rpx;
  padding: 0 20rpx;
}

/* 左侧tab */
.color-tabs {
  width: 120rpx;
  margin-right: 20rpx;
  background-color: white;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.tab-item {
  padding: 18rpx 12rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
}

.tab-item.active {
  border-radius: 12rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  margin: 10rpx;
}

/* 右侧内容 */
.right-section {
  flex: 1;
  border-radius: 16rpx;
  position: relative;
}

.color-tags {
  display: flex;
  flex-wrap: wrap;
}

.tag-item {
  padding: 12rpx 28rpx;
  background-color: #f0f0f0;
  color: #8e8e93;
  border-radius: 30rpx;
  margin-right: 15rpx;
  margin-bottom: 15rpx;
  font-size: 28rpx;
}

.tag-item.active {
  background-color: white;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 可展开区域 */
.expandable-area {
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.description-container {
  margin-bottom: 20rpx;
  position: relative;
  /* 固定高度以避免展开/收起时影响布局 */
  height: 270rpx;
}

.description-content {
  font-size: 22rpx;
  color: #666;
  line-height: 1.5;
  background-color: white;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  position: relative;
}

.description-content .section-title {
  font-size: 24rpx;
  color: #333;
  margin: 15rpx 0 8rpx 0;
  display: block;
}

/* 未展开状态下的样式 - 文本截断并显示省略号 */
.description-content.collapsed {
  height: 220rpx;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  white-space: pre-wrap;
  background-color: rgba(226, 247, 220, 0.2); /* #e2f7dc 透明度0.2 */
}

/* 展开状态下的样式（覆盖层） */
.description-content.expanded.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 520rpx;
  width: 92%;
  white-space: pre-wrap;
  background-color: #e2f7dc;
  z-index: 100;
  border-radius: 8rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.expanded-scroll {
  height: 450rpx;
  padding: 10rpx 20rpx;
}

.toggle-btn {
  display: block;
  text-align: right;
  color: #007aff;
  font-size: 24rpx;
  font-weight: bold;
  padding: 10rpx 0;
  text-decoration: underline;
  background-color: rgba(226, 247, 220, 0.2); /* #e2f7dc 透明度0.2 */
  border-radius: 0 0 8rpx 8rpx;
  position: relative;
  z-index: 101;
  margin-top: -20rpx; /* 往上移一点 */
  margin-left: auto;
  width: fit-content;
}

/* 展开状态下的按钮 */
.toggle-btn.overlay-btn {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  margin-top: 0;
  background-color: #e2f7dc;
  padding: 10rpx 20rpx;
  border-radius: 0 0 8rpx 8rpx;
  z-index: 102;
  width: fit-content;
}

/* 三级分类容器 */
.third-level {
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
  min-height: 600rpx; /* 增加最小高度 */
  position: relative;
  z-index: 1;
  padding: 20rpx 30rpx;
  margin: 0 20rpx;
}

/* 三级分类容器样式 */
.third-level-description-container {
  position: relative;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  background-color: rgba(226, 247, 220, 0.2);
  margin: 20rpx 0;
}

.third-level-description-container.expanded-third-level-container {
  position: absolute;
  z-index: 1000;
  width: calc(100% - 80rpx);
  box-sizing: border-box;
  left: 20rpx;
  right: 40rpx;
}

.third-level-description {
  padding: 20rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #333;
}

.section-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #000;
  margin: 15rpx 0 8rpx 0;
  display: block;
}

.third-level-description.collapsed {
  height: 140rpx;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.third-level-description.expanded {
  background-color: #e2f7dc;
  padding-bottom: 60rpx;
  max-height: 300rpx;
}

.third-level-toggle-btn {
  display: block;
  text-align: right;
  color: #007aff;
  font-size: 24rpx;
  padding: 10rpx 20rpx;
  text-decoration: underline;
  background-color: inherit;
}

.third-level-description-container.expanded-third-level-container .third-level-toggle-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-color: #e2f7dc;
  z-index: 1001;
}

.color-family {
  margin-bottom: 10rpx;
}

.family-header {
  display: flex;
  align-items: center;
}

.family-title {
  font-size: 30rpx;
  font-weight: 600;
}

.family-toggle-btn {
  color: #007aff;
  font-size: 24rpx;
  text-decoration: underline;
  margin-left: 10rpx;
}

.third-level-description {
  margin-top: 10rpx;
  background-color: #f0f0f0;
  padding: 20rpx;
  border-radius: 8rpx;
  position: relative;
}

.description-text {
  font-size: 22rpx;
  color: #666;
  line-height: 1.5;
}

.color-palette {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20rpx;
}

.color-item {
  width: 30%;
  margin-right: 3%;
  margin-bottom: 20rpx;
}

.color-item:nth-child(3n) {
  margin-right: 0;
}

.color-swatch {
  height: 80rpx;
  border-radius: 8rpx;
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-end;
}

.color-label {
  color: white;
  padding: 6rpx 10rpx;
  font-size: 22rpx;
  width: 100%;
}
</style>