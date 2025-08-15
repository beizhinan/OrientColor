<template>
	<view class="tabs">
		<view v-for="tab in tabs" :key="tab" :class="['tab', { active: tab === active }]" @tap="changeTab(tab)">
			<view :class="['tab-text', { active: tab === active }]">
				{{ tabLabels[tab] }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "DimensionTabs",
		props: ['active'],
		data() {
			return {
				tabs: ['3D', '2D', '1D'],
				tabLabels: {
					'3D': '三维',
					'2D': '二维',
					'1D': '一维'
				}
			}
		},
		methods: {
			changeTab(tab) {
				this.$emit('change', tab)
			}
		}
	}
</script>

<style scoped>
	.tabs {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-bottom: 10rpx;
		height: 112rpx;
	}

	.tab {
		width: 222rpx;
		height: 112rpx;
		background: url(/static/showcase/filter-dimUnchoose.png) no-repeat center center;
		background-size: cover;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tab.active {
		background-image: url(/static/showcase/filter-dimChoose.png);
		
	}

	.tab-text {
		font-size: 26;
		color: #979797;
		font-weight: 500;
	}

	.tab-text.active {
		color: #c55b0f;
		font-weight: 600;
	}
</style>