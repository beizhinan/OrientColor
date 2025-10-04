<template>
	<view class="card" @click="goToDetail">
		<view class="tag">{{ dimension }}</view>
		<!-- 切换按钮 -->
		<view v-if="button1 && button2" class="change-button">
			<view :class="['button', selectedButton === 'button1' ? 'selected' : '']"
				@click.stop="selectButton('button1')">
				{{ button1 }}
			</view>
			<view :class="['button', selectedButton === 'button2' ? 'selected' : '']"
				@click.stop="selectButton('button2')">
				{{ button2 }}
			</view>
		</view>

		<!-- 图表 -->
		<view class="chart-cube">
			<view class="chart" v-if="dimension == '3D'">
				<image mode="aspectFit" class="gif" src="/src/static/showcase/display-3d.gif"></image>
				<view v-if="showPopup" class="popup">
					<text class="text poptext">点击色立体图像查看三维模型，可以自动显示色谱在三维空间中的分视图，用户可以自主通过点击、捏合、滑动实现对模型的操作。</text>
					<text class="text know" @tap.stop="showPopup = false">✔明白了</text>
				</view>
			</view>
			<view class="chart" v-if="dimension == '2D'">
				<image class="gif" v-if="selectedButton === 'button1'" mode="aspectFit" src="/src/static/showcase/display-2drect.gif"></image>
				<image class="gif" v-if="selectedButton === 'button2'" mode="aspectFit" src="/src/static/showcase/display-2dpolar.gif"></image>
			</view>
			<view class="chart" v-if="dimension == '1D'">
				<image class="gif" v-if="selectedButton === 'button1'" mode="aspectFit" src="/src/static/showcase/display-1drect.gif"></image>
				<image class="gif" v-if="selectedButton === 'button2'" mode="aspectFit" src="/src/static/showcase/display-1dpolar.gif"></image>
			</view>
		</view>
		<!-- 文字栏 -->
		<view class="text-content">
			<view v-if="currentDisplay" class="title">{{ currentDisplay.text }}</view>
			<view class="desc">点击查看模型细节</view>
			<view v-if="dimension == '3D'" class="tips" @tap.stop="showPopup = true">
				<image class="tips-icon" src="/src/static/showcase/collection-info.png"></image>
				<text class="text tips-text">交互规则</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dimension: String,
			filterData: [Object, Array]
		},
		data() {
			return {
				selectedButton: 'button1',
				showPopup: false,
				colorPoints: [
					{ L: 23, a: -1, b: 3, C: 3, H: 108, name: "暗灰", code: "#373733" },
					{ L: 73, a: 5, b: 14, C: 15, H: 72, name: "黯白", code: "#C6B09A" },
					{ L: 39, a: -6, b: 6, C: 8, H: 133, name: "黯大绿", code: "#565E51" },
					{ L: 27, a: -11, b: 18, C: 21, H: 123, name: "偏黄的大绿", code: "#374323" },
					{ L: 25, a: -3, b: -4, C: 5, H: 229, name: "黯大青", code: "#343E42" },
					{ L: 49, a: -5, b: 15, C: 16, H: 109, name: "偏黄的二绿", code: "#76775B" },
					{ L: 46, a: -11, b: 11, C: 15, H: 134, name: "偏灰的黯二绿", code: "#61715A" },
					{ L: 38, a: -10, b: -23, C: 25, H: 247, name: "偏绿的二青", code: "#1C5F7D" },
					{ L: 45, a: -7, b: -5, C: 9, H: 216, name: "黯二青", code: "#596E73" },
					{ L: 40, a: 39, b: 23, C: 45, H: 31, name: "上好二朱", code: "#9F413C" },
					{ L: 67, a: 15, b: 44, C: 47, H: 71, name: "黯金", code: "#D19652" },
					{ L: 40, a: -20, b: -7, C: 21, H: 199, name: "孔雀蓝", code: "#286869" },
					{ L: 54, a: -19, b: -12, C: 22, H: 213, name: "浅孔雀蓝", code: "#478B95" },
					{ L: 35, a: -12, b: -10, C: 16, H: 220, name: "深孔雀蓝", code: "#2D5861" },
					{ L: 69, a: -14, b: 9, C: 17, H: 148, name: "黯绿华", code: "#94AF98" },
					{ L: 47, a: -4, b: 5, C: 6, H: 125, name: "绿灰", code: "#6C7066" },
					{ L: 7, a: 0, b: 7, C: 7, H: 90, name: "好墨", code: "#191406" },
					{ L: 87, a: 2, b: 7, C: 7, H: 74, name: "黯铅白", code: "#E3D8CD" },
					{ L: 55, a: 25, b: 33, C: 41, H: 53, name: "黯铅丹", code: "#BB724D" },
					{ L: 54, a: -7, b: -7, C: 10, H: 227, name: "黯青华", code: "#6E868E" },
					{ L: 55, a: -6, b: 0, C: 6, H: 183, name: "偏灰的黯青华", code: "#7A8885" },
					{ L: 54, a: -29, b: 12, C: 32, H: 158, name: "上好三绿", code: "#4C8F6D" },
					{ L: 61, a: -2, b: 11, C: 11, H: 102, name: "偏黄的三绿", code: "#97937F" },
					{ L: 54, a: -14, b: 11, C: 17, H: 141, name: "黯三绿", code: "#70876E" },
					{ L: 46, a: -11, b: -14, C: 18, H: 231, name: "偏绿的三青", code: "#437283" },
					{ L: 42, a: 27, b: 20, C: 33, H: 36, name: "鲜三朱", code: "#934F43" },
					{ L: 47, a: 13, b: 28, C: 31, H: 64, name: "深黄", code: "#926742" },
					{ L: 33, a: 1, b: 8, C: 8, H: 86, name: "深灰", code: "#524C41" },
					{ L: 25, a: 12, b: 14, C: 18, H: 49, name: "黯深朱", code: "#513326" },
					{ L: 25, a: 35, b: 19, C: 40, H: 29, name: "鲜深朱", code: "#6E1F20" },
					{ L: 59, a: 10, b: 23, C: 25, H: 67, name: "浅土黄", code: "#AC8766" },
					{ L: 37, a: 15, b: 15, C: 21, H: 45, name: "黯土朱", code: "#754E40" },
					{ L: 51, a: 14, b: 17, C: 21, H: 51, name: "浅土朱", code: "#9A6F5C" },

					],
				display: [
					{ dimension: '3D', text: '三维模型——色立体' },
					{ dimension: '2D', text: '二维模型——色彩坐标', button1: '直角坐标', button2: '极坐标' },
					{ dimension: '1D', text: '一维模型——色彩坐标', button1: '带状', button2: '环状' }
					]
				}
			},
			computed: {
				currentDisplay() {
					return this.display.find(item => item.dimension === this.dimension)
				},
				button1() {
					return this.currentDisplay?.button1 || ''
				},
				button2() {
					return this.currentDisplay?.button2 || ''
				}
			},
			mounted() {
			    if (this.dimension === '3D') {
			      this.showPopup = true
			    }
				
			},
			methods: {
				selectButton(buttonKey) {
					this.selectedButton = buttonKey
					this.$emit('button-change', {
						button: buttonKey === 'button1' ? this.button1 : this.button2,
						key: buttonKey
					})
				},
				
				// 给跳转页面传值
				goToDetail() {
					const selectedButton = this.selectedButton;
					const colorPointsStr = encodeURIComponent(JSON.stringify(this.colorPoints));
					
					// 筛选项标题
					const selectedFilters = (() => {
					  const str = ['system', 'hue', 'theme', 'category']
					    .map(field => this.filterData[field] || '')
					    .filter(Boolean) // 去掉空值
					    .join('-');
					
					  return str || '三维色谱';
					})();
					// 筛选项用于后端筛选
					const params = JSON.stringify(this.filterData)   
					console.log('selectedFilters:',selectedFilters)
					console.log('params:',params)
					let url = '';
					switch (this.dimension) {
						case '1D':
							url =
								`/pages/chart1D/chart1D?selectedButton=${selectedButton}&colorPoints=${colorPointsStr}
									&filterData=${encodeURIComponent(params)}&selectedFilters=${selectedFilters}`;
							break;
						case '2D':
							url =
								`/pages/chart2D/chart2D?selectedButton=${selectedButton}&colorPoints=${colorPointsStr}
									&filterData=${encodeURIComponent(params)}&selectedFilters=${selectedFilters}`;
							break;
						case '3D':
							url = `/pages/chart/chart?colorPoints=${colorPointsStr}&selectedFilters=${selectedFilters}
								&filterData=${encodeURIComponent(params)}`;
							break;
					}

					if (url) {
						uni.navigateTo({
							url
						});
					}
				}
			}
		}
</script>

<style>
	.card {
		position: relative;
		border-radius: 32rpx;
		box-shadow: 4rpx 8rpx 32rpx rgba(0, 0, 0, 0.1);
	}

	.tag {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
		background: #ffffff;
		color: #c69c6d;
		padding: 14rpx 30rpx;
		font-size: 22rpx;
		font-weight: bold;
		border-radius: 16rpx;
	}

	.change-button {
		position: absolute;
		top: 20rpx;
		left: 12rpx;
		display: flex;
		gap: 12rpx;
	}

	.button {
		padding: 20rpx 40rpx;
		border: 1px solid #d2d3dd;
		border-radius: 32rpx;
		color: #ababad;
		font-size: 32rpx;
	}

	.button.selected {
		background-color: #deb67f;
		color: #fff;
		border-color: #deb67f;
	}

	.chart-cube {
		width: 100%;
		height: 730rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		border-radius: 32rpx 32rpx 0 0;
	}

	.chart {
		margin-top: 80rpx;
		height: 80%;
		width: 100%;
		z-index: 0;
		display: flex;
		justify-content: center;
		align-items: center;   
	}
	
	.gif {
	    width: 100%;      
	    height: 100%;     
	    object-fit: contain;
	}
	
	.text{
		font-size: 22rpx;
	}
	
	.popup{
		position: absolute;
		right: 5px;
		bottom: 100px;
		width: 390rpx;
		height: 110rpx;
		padding: 16px;
		background-image: url(/static/showcase/interaction-background.png);
		background-size: 100% 100%;
		background-position: center;
		background-repeat: no-repeat;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.poptext{
		color: #667085;
		line-height: 24rpx;
	}
	
	.know{
		display: block;
		color: #5c59e8;
		font-weight: 600;
		text-decoration: underline;
		align-self: flex-end; 
	}
	
	.tips{
		position: absolute;
		right: 30rpx;
		bottom: 120rpx;
	}
	
	.tips-text{
		text-decoration: underline;
	}
	
	.tips-icon{
		width: 20rpx;
		height: 20rpx;
		margin-right: 5rpx;
	}

	.text-content {
		height: 180rpx;
		background: #ffffff;
		border-radius: 0 0 32rpx 32rpx;
		padding: 12rpx 0 0 30rpx;
	}

	.title {
		font-weight: bold;
		font-size: 34rpx;
		color: #9f7735;
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
		margin-bottom: 10rpx;
		margin-top: 30rpx;
	}

	.desc {
		color: #4e4e4e;
		font-size: 24rpx;
	}
</style>