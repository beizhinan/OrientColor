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
                {{ expandedIndex === index ? "收起" : "详情" }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 三级分类区域 -->
      <view class="third-level">
        <view
          v-for="subColor in filteredColorGroups"
          :key="'filtered-' + subColor.name"
        >
          <view
            v-for="thirdLevel in subColor.children"
            :key="thirdLevel.name"
            class="color-family"
          >
            <view class="family-title">{{ thirdLevel.name }}</view>
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
          '色名释义\n\t\t《本草纲目》载："石绿，阴石也。生铜坑中，乃铜之祖气也。铜得紫阳之气而生绿，绿久成石，谓之石绿。" \n\t\t石绿，即孔雀石，产自铜矿，常与蓝铜矿共生。孔雀石则因其颜色和特有得同心圆状花纹，犹如孔雀羽毛而得名。近现代学者惯用"石绿"统称以天然孔雀石（Malachite）研制而成的绿色颜料，其主要化学成分为碱式碳酸铜（Cu2CO3(OH)2），与石青成分一致。\n\t\t下细分为"鲜石绿"和"黯石绿"两大类。"鲜石绿"代表以石绿颜料调和胶料所绘之物的初始色貌，色泽鲜丽，色彩载体来源于文献；"黯石绿"代表以石绿颜料调和胶料所绘之物留存至今的历史色貌，色泽黯然，色彩载体来源于现存建筑实体。\n\n历史文化背景\n\t\t石绿颜料在中国的应用可以追溯到战国时期。作为矿物颜料使用的石绿在中国历代文献记载中同样拥有其它别称，如"绿青"、"青琅俞"等等。它与石青相同，是最为重要的传统彩绘颜料之一，被广泛运用于绘画、建筑、雕塑、器物等不同形式的艺术门类。在国画中，它与"石青"并称"青绿"，"青绿山水"这一重要表现技法就于唐代则正式创立。\n\t\t石绿以云南会泽、东川、贡山出产为最好，广西南丹、宾阳次之。受矿源、矿层、加工工艺等因素影响，石绿可呈现为不同色调的绿色。一般而言原矿石越黑，研磨后的颜料越绿，上品孔雀石为黛黑色，称作狮头绿、虾蟆背，稍次孔雀石称为蜻蜓翅。它可按粉体粒径大小将石绿区分为3-4级不同的色阶使用，《营造法式》即将它分为大绿、二绿、三绿、绿华4种色阶用以绘制建筑彩画。',
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
      isFavorite: false,
      expandedIndex: -1,
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

    // 跳转到颜色详情页面
    goToColorDetail(color) {
      let parentGroup = null;
      let grandParentGroup = null;

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

      console.log(paragraphs);
      console.log(result);

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
  },
};
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #fffbf6;
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

.description-text {
  font-size: 22rpx;
}

/* 主内容区域 */
.main-content {
  display: flex;
  margin-bottom: 20rpx;
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
  background-color: #40c860;
  color: white;
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
  color: #40c860;
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
  position: relative;
  z-index: 1;
  padding: 20rpx 30rpx;
}

.color-family {
  margin-bottom: 10rpx;
}

.family-title {
  font-size: 30rpx;
  font-weight: 600;
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
  background-color: rgba(0, 0, 0, 0.3);
}
</style>