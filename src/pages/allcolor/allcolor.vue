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
            :key="color.id"
            class="tab-item"
            :class="{ active: selectedColor && selectedColor.id === color.id }"
            :style="
              selectedColor && selectedColor.id === color.id
                ? {
                    backgroundColor: colorMap[color.name] || '#40c860',
                    color: 'white',
                  }
                : {}
            "
            @click="selectColor(color)"
          >
            {{ color.name }}
          </view>
        </view>

        <!-- 右侧内容区域 -->
        <view class="right-section">
          <!-- 子颜色标签 -->
          <view class="color-tags">
            <view
              v-for="tag in currentColorTags"
              :key="tag.id"
              class="tag-item"
              :class="{ active: selectedTag && selectedTag.id === tag.id }"
              :style="
                selectedTag && selectedTag.id === tag.id
                  ? { color: currentColorTheme }
                  : {}
              "
              @click="selectTag(tag)"
            >
              {{ tag.name }}
            </view>
          </view>

          <!-- 可展开的描述区域 -->
          <view class="expandable-area">
            <view
              v-for="(subColor, index) in filteredColorGroups"
              :key="subColor.name"
              class="description-container"
              :class="{ 'expanded-container': expandedIndex === index }"
            >
              <!-- 未展开状态下的文本截断显示 -->
              <view
                v-if="expandedIndex !== index"
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

              <!-- 展开状态下的滚动显示 -->
              <scroll-view v-else class="description-content expanded" scroll-y>
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

              <text class="toggle-btn" @click="toggleExpand(index)">
                {{ expandedIndex === index ? "收起" : "词条详情" }}
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

            <view class="color-palette-container">
              <!-- 修改颜色展示布局 -->
              <view
                v-for="(row, rowIndex) in getColorRows(thirdLevel.children)"
                :key="rowIndex"
                class="color-row"
              >
                <view class="color-col special-col">
                  <view
                    v-if="row['上好']"
                    class="color-swatch"
                    :style="{ backgroundColor: row['上好'].value }"
                    @click="goToColorDetail(row['上好'])"
                  >
                    <view class="color-label">
                      <text class="prefix-line">{{
                        getPrefix(row["上好"].name)
                      }}</text>
                      <text class="suffix-line">{{
                        getSuffix(row["上好"].name)
                      }}</text>
                    </view>
                  </view>
                </view>

                <view class="color-col special-col">
                  <view
                    v-if="row['常使']"
                    class="color-swatch"
                    :style="{ backgroundColor: row['常使'].value }"
                    @click="goToColorDetail(row['常使'])"
                  >
                    <view class="color-label">
                      <text class="prefix-line">{{
                        getPrefix(row["常使"].name)
                      }}</text>
                      <text class="suffix-line">{{
                        getSuffix(row["常使"].name)
                      }}</text>
                    </view>
                  </view>
                </view>

                <view class="color-col normal-col">
                  <view
                    v-for="color in row.other"
                    :key="color.name"
                    class="color-swatch"
                    :style="{ backgroundColor: color.value }"
                    @click="goToColorDetail(color)"
                  >
                    <view class="color-label">
                      <text class="prefix-line">{{
                        getPrefix(color.name)
                      }}</text>
                      <text class="suffix-line">{{
                        getSuffix(color.name)
                      }}</text>
                    </view>
                  </view>
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
import {
  getLevelOneColors,
  getLevelTwoColors,
  getLevelThreeColors,
  getLevelFourColors,
} from "@/api/allcolor";

export default {
  data() {
    return {
      id: null,
      title: "",
      colorList: [],
      selectedColor: null,
      selectedTag: null,
      levelOneData: {},
      levelTwoData: {},
      levelThreeData: {},
      levelFourData: {},
      colorData: {},
      isFavorite: false,
      expandedIndex: -1,
      isInfoExpanded: false, // 添加控制信息展开状态的变量
      thirdLevelExpandMap: {}, // 添加用于跟踪三级分类展开状态的对象
      // 颜色映射表，用于设置不同颜色类别的主题色
      colorMap: {
        绿色: "#40c860",
        白色: "#8e8e93",
        黄色: "#FFD700",
        红色: "#FF6B6B",
        青色: "#48C9B0",
      },
    };
  },
  computed: {
    // 当前选中色系的所有标签
    currentColorTags() {
      if (!this.selectedColor) return [];
      return this.levelTwoData[this.selectedColor.id] || [];
    },

    // 根据筛选条件过滤后的颜色分组
    filteredColorGroups() {
      if (!this.selectedColor || !this.selectedTag) return [];

      const levelTwos = this.levelTwoData[this.selectedColor.id] || [];
      const selectedGroup = levelTwos.find(
        (subColor) => subColor.id === this.selectedTag.id
      );

      if (!selectedGroup) return [];

      return [
        {
          name: selectedGroup.name,
          description: selectedGroup.description,
          children:
            this.levelThreeData[selectedGroup.id]?.map((thirdLevel) => ({
              ...thirdLevel,
              children: this.levelFourData[thirdLevel.id] || [],
            })) || [],
        },
      ];
    },

    // 获取当前选中颜色的主题色
    currentColorTheme() {
      if (!this.selectedColor) return "#40c860";
      return this.colorMap[this.selectedColor.name] || "#40c860"; // 默认使用绿色
    },
  },
  onLoad(options) {
    // 初始化加载一级颜色数据
    this.loadLevelOneColors();
  },
  methods: {
    // 加载一级颜色数据
    async loadLevelOneColors() {
      try {
        const res = await getLevelOneColors();
        if (res.status === "success") {
          this.colorList = res.data;
          if (res.data.length > 0) {
            this.selectedColor = res.data[0];
            this.colorData = res.data[0];
            // 加载二级颜色数据
            this.loadLevelTwoColors(this.selectedColor.id);
          }
        }
      } catch (error) {
        console.error("获取一级颜色数据失败:", error);
      }
    },

    // 加载二级颜色数据
    async loadLevelTwoColors(parentId) {
      try {
        const res = await getLevelTwoColors(parentId);
        if (res.status === "success") {
          // 使用Vue的$set方法确保响应式更新
          this.$set(this.levelTwoData, parentId, res.data);
          if (res.data.length > 0) {
            this.selectedTag = res.data[0];
            // 加载三级颜色数据
            this.loadLevelThreeColors(res.data[0].id);
          }
        }
      } catch (error) {
        console.error("获取二级颜色数据失败:", error);
      }
    },

    // 加载三级颜色数据
    async loadLevelThreeColors(parentId) {
      try {
        const res = await getLevelThreeColors(parentId);
        if (res.status === "success") {
          this.$set(this.levelThreeData, parentId, res.data);

          // 加载四级颜色数据
          for (const item of res.data) {
            this.loadLevelFourColors(item.id);
          }
        }
      } catch (error) {
        console.error("获取三级颜色数据失败:", error);
      }
    },

    // 加载四级颜色数据
    async loadLevelFourColors(parentId) {
      try {
        const res = await getLevelFourColors(parentId);
        if (res.status === "success") {
          this.$set(this.levelFourData, parentId, res.data);
        }
      } catch (error) {
        console.error("获取四级颜色数据失败:", error);
      }
    },

    // 选择色系
    selectColor(color) {
      this.selectedColor = color;
      this.colorData = color;
      this.expandedIndex = -1;

      // 如果该颜色的二级数据尚未加载，则加载
      if (!this.levelTwoData[color.id]) {
        this.loadLevelTwoColors(color.id);
      } else if (this.levelTwoData[color.id].length > 0) {
        this.selectedTag = this.levelTwoData[color.id][0];
      }
    },

    // 选择标签
    selectTag(tag) {
      this.selectedTag = tag;
      this.expandedIndex = -1;

      // 如果该标签的三级数据尚未加载，则加载
      if (!this.levelThreeData[tag.id]) {
        this.loadLevelThreeColors(tag.id);
      }
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

      // 查找当前颜色的父级和祖父级分组
      if (this.filteredColorGroups && this.filteredColorGroups.length > 0) {
        const currentGroup = this.filteredColorGroups[0];
        for (let child of currentGroup.children) {
          const foundColor = child.children.find(
            (c) => c.name === color.name && c.value === color.value
          );
          if (foundColor) {
            parentGroup = child;
            grandParentGroup = currentGroup;
            break;
          }
        }
      }

      let titlePath = this.selectedColor ? this.selectedColor.name : "";
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
          `parentColor=${encodeURIComponent(this.selectedColor?.name || "")}&` +
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

    getColorRows(colors) {
      if (!colors || !colors.length) return [];

      const rows = [];
      let currentRow = { 上好: null, 常使: null, other: [] };

      // 先筛选出"上好"和"常使"前缀的颜色
      const specialColors = {
        上好: colors.find((color) => color.name.startsWith("上好")),
        常使: colors.find(
          (color) => color.name.includes("使") && !color.name.startsWith("上好")
        ),
      };

      // 筛选出其他颜色
      const otherColors = colors.filter(
        (color) =>
          !color.name.startsWith("上好") &&
          !(color.name.includes("使") && !color.name.startsWith("上好"))
      );

      // 如果有特殊颜色，添加第一行
      if (specialColors["上好"] || specialColors["常使"]) {
        currentRow["上好"] = specialColors["上好"];
        currentRow["常使"] = specialColors["常使"];

        // 填充其他颜色到第一行（最多3个）
        currentRow.other = otherColors.slice(0, 3);
        rows.push(currentRow);

        // 处理剩余的其他颜色（每行3个）
        const remainingColors = otherColors.slice(3);
        for (let i = 0; i < remainingColors.length; i += 3) {
          rows.push({
            上好: null,
            常使: null,
            other: remainingColors.slice(i, i + 3),
          });
        }
      } else {
        // 没有特殊颜色，直接按每行5个排列
        for (let i = 0; i < otherColors.length; i += 5) {
          rows.push({
            上好: null,
            常使: null,
            other: otherColors.slice(i, i + 5),
          });
        }
      }

      return rows;
    },

    // 获取颜色名称的前缀（如"上好"、"偏黄的"）
    getPrefix(colorName) {
      // 常见前缀列表
      const prefixes = [
        "上好",
        "偏黄的",
        "偏淡的",
        "黯",
        "带使",
        "头青",
        "豆青",
        "浅翠",
        "深翠",
        "墨",
        "浓",
        "上等",
        "普通",
        "脂",
        "粉",
      ];

      for (const prefix of prefixes) {
        if (colorName.startsWith(prefix)) {
          return prefix;
        }
      }

      // 对于包含"使"字但不以"上好"开头的情况
      if (colorName.includes("使") && !colorName.startsWith("上好")) {
        // 找到"使"字的位置并返回前面的部分+使
        const shiIndex = colorName.indexOf("使");
        return colorName.substring(0, shiIndex + 1);
      }

      // 如果没有找到匹配的前缀，返回空字符串
      return "";
    },

    // 获取颜色名称的后缀（如"大绿"）
    getSuffix(colorName) {
      const prefix = this.getPrefix(colorName);
      if (prefix) {
        return colorName.substring(prefix.length);
      }
      return colorName;
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
}

.description-container.expanded-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
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

/* 展开状态下的样式 */
.description-content.expanded {
  height: 520rpx;
  width: 92%;
  white-space: pre-wrap;
  background-color: #e2f7dc;
  padding-bottom: 50rpx;
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
}

/* 当展开时，调整按钮位置 */
.description-container.expanded-container .toggle-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center; /* 居中对齐 */
  margin-top: 0;
  background-color: #e2f7dc;
  padding: 10rpx 0;
  border-radius: 0 0 8rpx 8rpx;
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

.third-level-description-container.expanded-third-level-container
  .third-level-toggle-btn {
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

/* 颜色展示容器 */
.color-palette-container {
  margin-top: 20rpx;
}

/* 颜色行 */
.color-row {
  display: flex;
  margin-bottom: 20rpx;
}

/* 颜色列 */
.color-col {
  display: flex;
}

/* 特殊列（上好、常使） */
.special-col {
  width: 20%;
  margin-right: 2%;
}

/* 普通列（其他颜色） */
.normal-col {
  width: 66%;
}

.normal-col .color-swatch {
  width: 30%;
  margin-right: 4%;
  margin-bottom: 20rpx;
}

.normal-col .color-swatch:nth-child(3n) {
  margin-right: 0;
}

.color-swatch {
  height: 120rpx;
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-end;
  /* 确保色块占满容器 */
  width: 100%;
}

.color-label {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: white;
  padding: 6rpx 10rpx;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  font-size: 18rpx;
  line-height: 1.2;
}
</style>