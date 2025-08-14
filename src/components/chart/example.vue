<template>
	<view class="container">
		<view class="title">
			<text class="title-content">xx色系</text>
		</view>
		<scroll-view scroll-y class="color-list">
			<view class="color-grid">
				<view class="color-card" v-for="(item, index) in colorList" :key="index" @click="goToDetail(item)">
					<!-- LABCH 表格 -->
					<view class="labch-table">
						<view class="labch-row">
							<view class="labch-cell" v-for="letter in ['L','a','b','C','H']" :key="letter">
								{{ letter }}
							</view>
						</view>
						<view class="labch-row">
							<view class="labch-cell" v-for="letter in ['L','a','b','C','H']" :key="letter">
								{{ item[letter] }}
							</view>
						</view>
					</view>

					<!-- 色卡 -->
					<view class="color-box" :style="{ backgroundColor: item.colorCode }">
						<view class="color-info" :style="{ color: getTextColor(item.colorCode) }">
							<!-- 左侧 -->
							<view class="info left-info">
								<text class="text">{{ item.code }}</text>
								<text class="text">{{ item.category }}</text>
							</view>
							<!-- 右侧 -->
							<view class="info right-info">
								<text class="text">{{ item.source }}</text>
								<text class="text">{{ item.name }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				colorList: [{
						L: 87,
						a: 2,
						b: 7,
						C: 7,
						H: 74,
						code: 'No-0-17',
						category: '实物色',
						source: '白土, 鹤白',
						name: '鹤白',
						colorCode: '#EAE3D7'
					},
					{
						L: 78,
						a: 13,
						b: 13,
						C: 13,
						H: 81,
						code: 'No-0-15',
						category: '实物色',
						source: '高岭土',
						name: '赭白土',
						colorCode: '#00007f'
					},
					{
						L: 87,
						a: 2,
						b: 7,
						C: 7,
						H: 74,
						code: 'No-0-17',
						category: '实物色',
						source: '白土, 鹤白',
						name: '鹤白',
						colorCode: '#EAE3D7'
					},
					{
						L: 87,
						a: 2,
						b: 7,
						C: 7,
						H: 74,
						code: 'No-0-17',
						category: '实物色',
						source: '白土, 鹤白',
						name: '鹤白',
						colorCode: '#EAE3D7'
					},
					{
						L: 87,
						a: 2,
						b: 7,
						C: 7,
						H: 74,
						code: 'No-0-17',
						category: '实物色',
						source: '白土, 鹤白',
						name: '鹤白',
						colorCode: '#EAE3D7'
					},
					{
						L: 87,
						a: 2,
						b: 7,
						C: 7,
						H: 74,
						code: 'No-0-17',
						category: '实物色',
						source: '白土, 鹤白',
						name: '鹤白',
						colorCode: '#EAE3D7'
					},
					{
						L: 87,
						a: 2,
						b: 7,
						C: 7,
						H: 74,
						code: 'No-0-17',
						category: '实物色',
						source: '白土, 鹤白',
						name: '鹤白',
						colorCode: '#EAE3D7'
					},
					{
						L: 87,
						a: 2,
						b: 7,
						C: 7,
						H: 74,
						code: 'No-0-17',
						category: '实物色',
						source: '白土, 鹤白',
						name: '鹤白',
						colorCode: '#EAE3D7'
					},
				]
			}
		},
		methods: {
			// 根据背景色计算文字颜色
			getTextColor(hex) {
				const rgb = this.hexToRgb(hex)
				if (!rgb) return '#000'
				// 计算亮度
				const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
				return yiq >= 128 ? '#000' : '#fff'
			},
			hexToRgb(hex) {
				let c
				if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
					c = hex.substring(1).split('')
					if (c.length == 3) {
						c = [c[0], c[0], c[1], c[1], c[2], c[2]]
					}
					c = '0x' + c.join('')
					return {
						r: (c >> 16) & 255,
						g: (c >> 8) & 255,
						b: c & 255
					}
				}
				return null
			},
			// 跳转到详情页
			goToDetail(item) {
				uni.navigateTo({
					url: `/pages/colorblock/colorblock`
				})
			}
		}
	}
</script>

<style scoped>
	.container {
		padding: 20rpx;
	}
	
	.title{
		text-align: center;
		margin-bottom: 10rpx;
	}
	
	.title-content{
		font-size: 34rpx;
		font-weight: 900;
		color: #9f7735;
	}

	.color-list {
		height: 800rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		background-color: #fff;
		padding-top: 10rpx;
	}

	.color-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		max-width: 690rpx;
		margin: 0 auto; 
	}

	.color-card {
		width: 48%;
		margin: 1%;
		background: #f2f2f2;
		overflow: hidden;
	}

	.labch-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 16rpx;
		font-weight: 900;
		color: #5a3d2e;
	}

	.labch-row {
		display: flex;
	}

	.labch-cell {
		flex: 1;
		text-align: center;
		border-top: 1rpx solid #5a3d2e;
		border-left: 1rpx solid #5a3d2e;
		padding: 6rpx 0;
	}
	
	.labch-row:first-child .labch-cell {
	  border-top-color: transparent;
	}
	
	.labch-cell:first-child {
	  border-left-color: transparent;
	}

	.color-box {
		height: 120rpx;
		position: relative;
		padding: 20rpx;
	}

	.color-info {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 8rpx;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}
	
	.info{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 30%;
	}

	.right-info{
		align-items: flex-end; 
	}

	.text {
		font-size: 16rpx;
		font-weight: 500;
	}
</style>