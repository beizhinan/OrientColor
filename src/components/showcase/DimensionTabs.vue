<template>
	<view class="tabs">
		<view v-for="tab in tabs" :key="tab" :class="['tab', { active: tab === active }]" @tap="changeTab(tab)">
			{{ tabLabels[tab] }}
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
		margin-bottom: 10rpx;
		border-style: solid;
		border-width: 2rpx;
		border-color:#f0f0f0;
		border-radius: 8px;
	}

	.tab {
		margin: 8rpx 12rpx 6rpx 12rpx;
		padding: 12rpx 60rpx;
		border-radius: 6px;
		color: #667085;
	}

	.tab.active {
		background-color: #dedefa;
		color: #4543ae;
		font-weight: bold;
	}
</style>