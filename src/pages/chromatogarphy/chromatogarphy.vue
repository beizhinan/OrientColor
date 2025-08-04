<template>
  <view class="container">
    <view class="content">
      <!-- 顶部颜色信息展示 -->
      <view
        class="info"
        :style="{ backgroundImage: 'url(' + colorData.imgurl + ')' }"
      >
        <view class="description-overlay">
          <text class="title">{{ colorData.name }}：</text>
          <text class="description-text">{{ colorData.description }}</text>
        </view>
      </view>

      <!-- 主要内容区域 - 水平布局部分 -->
      <view class="horizontal-layout">
        <!-- 左侧色系选择tab -->
        <view class="color-tabs">
          <view
            v-for="color in colorList"
            :key="color"
            class="tab-item"
            :class="{ active: selectedColor === color }"
            @click="selectColor(color)"
          >
            {{ color }}
          </view>
        </view>

        <!-- 右侧颜色展示区域 -->
        <view class="right-content">
          <!-- 子颜色标签 -->
          <view class="color-tags">
            <view
              v-for="tag in currentColorTags"
              :key="tag"
              class="tag-item"
              :class="{ active: selectedTag === tag }"
              @click="selectTag(tag)"
            >
              {{ tag }}
            </view>
          </view>

          <!-- 颜色分组展示 -->
          <view class="color-groups">
            <view
              v-for="subColor in filteredColorGroups"
              :key="subColor.name"
              class="color-group"
            >
              <text class="group-description">{{ subColor.description }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 三级分类内容 - 单独放在底部 -->
      <view class="third-level-container">
        <view
          v-for="subColor in filteredColorGroups"
          :key="'filtered-' + subColor.name"
        >
          <view
            v-for="thirdLevel in subColor.children"
            :key="thirdLevel.name"
            class="third-level-group"
          >
            <view class="third-level-title">{{ thirdLevel.name }}</view>
            <view class="color-items">
              <view
                v-for="color in thirdLevel.children"
                :key="color.name"
                class="color-preview-container"
              >
                <view
                  class="color-preview"
                  :style="{ backgroundColor: color.value }"
                  @click="goToColorDetail(color)"
                >
                  <text class="color-name-label">{{ color.name }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 颜色数据定义
const colorDataMap = {
  绿色: {
    name: "绿色",
    imgurl: "https://placebear.com/350/160",
    description:
      "绿，为五间色之一，近于青色与黄色之间，可见属东方间色。绿色也常列入青色，象征生机。《说文》曰：'用青黄色也。'《释经》曰：'绿，树也。'荆秦之水干上视之，观察绿色，此似之也。可见绿是蓝与黄的结合，最早用在丝绸上，亦是'小'色。",
    categories: ["绿色", "白色", "黄色", "红色", "青色"],
    subColors: [
      {
        name: "石绿",
        description:
          '《本草纲目》载："石绿，阴石也。生铜坑中，乃铜之祖气也。铜得紫阳之气而生绿，绿久成石，谓之石绿。"\n石绿，即孔雀石，产自铜矿，常与蓝铜矿共生。孔雀石则因其颜色和特有得同心圆状花纹，犹如孔雀羽毛而得名。近现代学者惯用"石绿"统称以天然孔雀石（Malachite）研制而成的绿色颜料，其主要化学成分为碱式碳酸铜（Cu2CO3(OH)2），与石青成分一致。',
        children: [
          {
            name: "大绿",
            description: "大绿是石绿的一种，颜色较为鲜艳",
            children: [
              { id: 1, name: "上好大绿", value: "#2E8B57" },
              { id: 2, name: "偏黄的大绿", value: "#3CB371" },
              { id: 3, name: "黯大绿", value: "#228B22" },
              { id: 4, name: "带使大绿", value: "#006400" },
            ],
          },
          {
            name: "二绿",
            description: "二绿是石绿的另一种分类，颜色相对较淡",
            children: [
              { name: "头青二绿", value: "#66CDAA" },
              { name: "豆青二绿", value: "#3CB371" },
            ],
          },
        ],
      },
      {
        name: "巴黎绿",
        description: "巴黎绿是一种人工合成的绿色颜料，色泽鲜艳",
        children: [
          {
            name: "翠绿巴黎绿",
            description: "色泽翠绿的巴黎绿品种",
            children: [
              { name: "浅翠巴黎绿", value: "#00FF7F" },
              { name: "深翠巴黎绿", value: "#008080" },
            ],
          },
          {
            name: "深巴黎绿",
            description: "颜色较深的巴黎绿品种",
            children: [
              { name: "墨巴黎绿", value: "#006400" },
              { name: "浓巴黎绿", value: "#008000" },
            ],
          },
        ],
      },
    ],
  },
  白色: {
    name: "白色",
    imgurl: "https://placebear.com/350/161",
    description:
      "白，为五正色之一，象征纯洁与光明。《说文》曰：'白，西方色也。阴用事，物色白。'白色在东方文化中常代表洁净、朴素与空灵。",
    categories: ["绿色", "白色", "黄色", "红色", "青色"],
    subColors: [
      {
        name: "铅粉",
        description:
          "古代常用的白色颜料，主要成分为碱式碳酸铅。《本草纲目》载：'铅粉，即铅华也，出于铅，成于粉。'",
        children: [
          {
            name: "胡粉",
            description: "铅粉的别称，因产自胡地而得名",
            children: [
              { name: "上等胡粉", value: "#F8F8F8" },
              { name: "普通胡粉", value: "#F0F0F0" },
            ],
          },
          {
            name: "铅华",
            description: "铅粉的雅称，常用于化妆品",
            children: [
              { name: "脂铅华", value: "#F5F5F5" },
              { name: "粉铅华", value: "#FAFAFA" },
            ],
          },
        ],
      },
    ],
  },
  黄色: {},
  红色: {},
  青色: {},
};

export default {
  data() {
    const colorList = Object.keys(colorDataMap);
    const defaultColor = colorList[0];
    return {
      id: null,
      title: "",
      colorList: colorList,
      selectedColor: defaultColor,
      selectedTag: colorDataMap[defaultColor].subColors[0].name,
      allColorData: colorDataMap,
      colorData: colorDataMap[defaultColor],
    };
  },
  computed: {
    // 当前选中色系的所有标签
    currentColorTags() {
      return this.colorData.subColors?.map((subColor) => subColor.name) || [];
    },

    // 根据筛选条件过滤后的颜色分组
    filteredColorGroups() {
      if (!this.colorData.subColors) return [];

      const selectedGroup = this.colorData.subColors.find(
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
  },
  onLoad(options) {
    if (options.id && options.title) {
      this.id = options.id;
      this.title = decodeURIComponent(options.title);
      // 确保传入的 title 在 colorList 中存在
      if (this.colorList.includes(this.title)) {
        this.selectedColor = this.title;
        this.colorData = this.allColorData[this.title] || this.colorData;
        this.selectedTag = this.colorData.subColors[0].name;
      }
    }

    uni.setNavigationBarTitle({
      title: (this.title || this.selectedColor) + "色谱",
    });

    uni.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#F8F8F8",
    });
  },
  methods: {
    // 选择色系
    selectColor(color) {
      this.selectedColor = color;
      this.selectedTag = this.allColorData[color].subColors[0].name;
      this.colorData = this.allColorData[color];
    },

    // 选择标签
    selectTag(tag) {
      this.selectedTag = tag;
    },

    // 跳转到颜色详情页面
    goToColorDetail(color) {
      // 查找当前颜色的父级和祖父级信息
      let parentGroup = null;
      let grandParentGroup = null;

      // 遍历当前颜色数据找到父级和祖父级
      for (let subColor of this.colorData.subColors) {
        for (let child of subColor.children) {
          const foundColor = child.children.find(
            (c) => c.name === color.name && c.value === color.value
          );
          if (foundColor) {
            parentGroup = child;
            grandParentGroup = subColor;
            break;
          }
        }
        if (parentGroup) break;
      }

      // 构建完整路径标题
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
  },
};
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
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
  overflow: hidden;
}

.description-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 30rpx;
  color: white;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
}

.description-text {
  font-size: 24rpx;
}

/* 水平布局部分 */
.horizontal-layout {
  display: flex;
  flex-direction: row;
  margin-top: 20rpx;
  align-items: stretch; /* 确保子元素拉伸到相同高度 */
}

/* 左侧色系选择tab */
.color-tabs {
  width: 100rpx;
  margin-right: 20rpx;
  background-color: white;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.tab-item {
  padding: 18rpx 12rpx;
  text-align: center;
  background-color: transparent;
  margin-bottom: 10rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  transition: all 0.1s;
}

.tab-item.active {
  background-color: #40c860;
  color: white;
}

/* 右侧内容区域 */
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16rpx;
  padding: 20rpx;
  min-height: 100%;
}

/* 颜色标签 */
.color-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.tag-item {
  padding: 12rpx 28rpx;
  background-color: #f0f0f0;
  border-radius: 30rpx;
  margin-right: 15rpx;
  margin-bottom: 15rpx;
  font-size: 28rpx;
  color: #333;
  transition: all 0.3s;
}

.tag-item.active {
  background-color: white;
  color: #40c860;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

/* 颜色分组 */
.color-groups {
  flex: 1;
  border-radius: 12rpx;
  padding: 10rpx;
  overflow-y: auto;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.color-group {
  margin-bottom: 20rpx;
}

.group-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  color: #333;
}

.group-description {
  font-size: 20rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
  line-height: 1.5;
}

/* 三级分类容器 - 放在底部 */
.third-level-container {
  margin-top: 30rpx;
  background-color: white;
  border-radius: 16rpx;
  padding: 20rpx;
}

.third-level-group {
  margin-top: 30rpx;
}

.third-level-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
  color: #444;
}

.third-level-description {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 15rpx;
  display: block;
  line-height: 1.5;
}

.color-items {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20rpx;
}

.color-preview-container {
  width: 30%;
  margin-right: 3%;
  margin-bottom: 30rpx;
}

.color-preview-container:nth-child(3n) {
  margin-right: 0;
}

.color-preview {
  height: 80rpx;
  border-radius: 8rpx;
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.color-name-label {
  color: white;
  padding: 6rpx 10rpx;
  font-size: 22rpx;
  width: 100%;
  box-sizing: border-box;
}
</style>