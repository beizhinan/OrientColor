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
// 颜色数据定义
const colorDataMap = {
  绿色: {
    name: "绿色",
    imgurl: "https://placebear.com/350/160",
    description:
      "绿，为五间色之一，近于青色与黄色之间，可见属东方间色。绿色也常列入青色，象征生机。《说文》曰：'用青黄色也。'《释经》曰：'绿，树也。'荆秦之水干上视之，观察绿色，此似之也。可见绿是蓝与黄的结合，最早用在丝绸上，亦是'小'色。",
    culturalInfo: [
      {
        title: "在东方文化中的象征意义",
        content:
          '在中国服饰色彩观念中，一直认为绿色是象征地位卑微的颜色。西汉时期，绿头巾是宫廷厨房奴仆们的头饰。晋朝李轨曾注疏西汉杨雄《杨子法言》言："绿衣虽有三百领，杂色不可入宗庙"。服饰色彩的这种观念也延续到了军事管理制度中。清朝为满人所统，满清政府为确立民族身份的等级差序，规定招募汉人组织的军队一律用绿旗，称为绿旗兵，兵营名叫绿营。',
      },
      {
        title: "与五行的关系",
        content:
          '绿，为五间色之一，位于青色与黄色之间，可归属东方间色。绿色也曾列入青色，象征生机。《说文》曰："帛青黄色也"。《释名》曰："绿，浏也。荆泉之水于上视之，浏然绿色，此似之也"。可见绿是蓝与黄的结合，最早用在丝绸上，亦是浏水之色。',
      },
    ],
    categories: ["绿色", "白色", "黄色", "红色", "青色"],
    subColors: [
      {
        name: "石绿",
        description:
          '色名释义\n\t\t《本草纲目》载："石绿，阴石也。生铜坑中，乃铜之祖气也。铜得紫阳之气而生绿，绿久成石，谓之石绿。" \n\t\t石绿，即孔雀石，产自铜矿，常与蓝铜矿共生。孔雀石则因其颜色和特有得同心圆状花纹，犹如孔雀羽毛而得名。近现代学者惯用"石绿"统称以天然孔雀石（Malachite）研制而成的绿色颜料，其主要化学成分为碱式碳酸铜（Cu2CO3(OH)2），与石青成分一致。\n\t\t下细分为"鲜石绿"和"黯石绿"两大类。"鲜石绿"代表以石绿颜料调和胶料所绘之物的初始色貌，色泽鲜丽，色彩载体来源于文献；"黯石绿"代表以石绿颜料调和胶料所绘之物留存至今的历史色貌，色泽黯然，色彩载体来源于现存建筑实体。\n\n历史文化背景\n\t\t石绿颜料在中国的应用可以追溯到战国时期。作为矿物颜料使用的石绿在中国历代文献记载中同样拥有其它别称，如"绿青"、"青琅俞"等等。它与石青相同，是最为重要的传统彩绘颜料之一，被广泛运用于绘画、建筑、雕塑、器物等不同形式的艺术门类。在国画中，它与"石青"并称"青绿"，"青绿山水"这一重要表现技法就于唐代则正式创立。\n\t\t石绿以云南会泽、东川、贡山出产为最好，广西南丹、宾阳次之。受矿源、矿层、加工工艺等因素影响，石绿可呈现为不同色调的绿色。一般而言原矿石越黑，研磨后的颜料越绿，上品孔雀石为黛黑色，称作狮头绿、虾蟆背，稍次孔雀石称为蜻蜓翅。它可按粉体粒径大小将石绿区分为3-4级不同的色阶使用，《营造法式》即将它分为大绿、二绿、三绿、绿华4种色阶用以绘制建筑彩画。',
        children: [
          {
            name: "大绿",
            description:
              '色名释义\n\t\t《本草纲目》载："石绿，阴石也。生铜坑中，乃铜之祖气也。铜得紫阳之气而生绿，绿久成石，谓之石绿。" \n\t\t石绿，即孔雀石，产自铜矿，常与蓝铜矿共生。孔雀石则因其颜色和特有得同心圆状花纹，犹如孔雀羽毛而得名。近现代学者惯用"石绿"统称以天然孔雀石（Malachite）研制而成的绿色颜料，其主要化学成分为碱式碳酸铜（Cu2CO3(OH)2），与石青成分一致。\n\t\t下细分为"鲜石绿"和"黯石绿"两大类。"鲜石绿"代表以石绿颜料调和胶料所绘之物的初始色貌，色泽鲜丽，色彩载体来源于文献；"黯石绿"代表以石绿颜料调和胶料所绘之物留存至今的历史色貌，色泽黯然，色彩载体来源于现存建筑实体。\n\n历史文化背景\n\t\t石绿颜料在中国的应用可以追溯到战国时期。作为矿物颜料使用的石绿在中国历代文献记载中同样拥有其它别称，如"绿青"、"青琅俞"等等。它与石青相同，是最为重要的传统彩绘颜料之一，被广泛运用于绘画、建筑、雕塑、器物等不同形式的艺术门类。在国画中，它与"石青"并称"青绿"，"青绿山水"这一重要表现技法就于唐代则正式创立。\n\t\t石绿以云南会泽、东川、贡山出产为最好，广西南丹、宾阳次之。受矿源、矿层、加工工艺等因素影响，石绿可呈现为不同色调的绿色。一般而言原矿石越黑，研磨后的颜料越绿，上品孔雀石为黛黑色，称作狮头绿、虾蟆背，稍次孔雀石称为蜻蜓翅。它可按粉体粒径大小将石绿区分为3-4级不同的色阶使用，《营造法式》即将它分为大绿、二绿、三绿、绿华4种色阶用以绘制建筑彩画。',
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
    culturalInfo: [
      {
        title: "白色的文化象征",
        content:
          "白色在中国传统文化中具有复杂的象征意义。一方面，白色象征着纯洁、光明和正直；另一方面，在某些语境中，白色也与死亡、丧事相关联。白色在五行中对应西方和秋季，是金属元素的颜色。",
      },
      {
        title: "白色在传统服饰中的应用",
        content:
          "在古代中国，白色是平民百姓常用的服装颜色，也是官员在特定场合穿着的颜色。例如，未得功名的读书人通常穿白色长衫，而官员在居丧期间也需穿白色服饰以示哀悼。",
      },
    ],
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

    // 获取当前选中颜色的主题色
    currentColorTheme() {
      return this.colorMap[this.selectedColor] || "#40c860"; // 默认使用绿色
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

    getThirdLevelKey(subIndex, thirdIndex) {
      return `${subIndex}-${thirdIndex}`;
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