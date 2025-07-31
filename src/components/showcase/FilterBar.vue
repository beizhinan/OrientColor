<template>
	<view class="filter-bar">
		<!-- 顶部筛选项 -->
		<view class="filters">
			<view v-for="item in filters" :key="item.key" class="filter-item"
				:class="{ active: item.key === selectedParentKey }"
				@tap="toggleDropdown(item.key)"
				>
				<view class="filter-content">
					<image class="icon" :src=item.icon></image>
					<text class="lable">{{ item.label }}</text>
					<image v-if="item.key !== 'all'" class="arrow" :class="{ open: item.key === activeKey }"
						src="/static/showcase/filter-arrows.png">
					</image>
				</view>
			</view>
		</view>

		<!-- 子选项面板 -->
		<view v-if="activeKey && activeKey !== 'all'" class="dropdown-panel"
			:style="{ top: dropdownPosition.top + 'rpx', left: dropdownPosition.left + 'rpx' }">
			<view class="option-grid">
				<view v-for="opt in getActiveOptions()" :key="opt" class="option"
					:class="{ selected: selectedChildOption.key === activeKey && selectedChildOption.value === opt }" 
					@tap="selectOption(opt)"
					>
					<image class="icon-small" src="/static/showcase/filter-icon.png"></image>
					<text class="option-text">{{ opt }}</text>
				</view>
			</view>
		</view>
		<!-- 遮罩层，点击任意区域关闭 -->
		<view v-if="activeKey && activeKey !== 'all'" class="mask" @tap="activeKey = ''"></view>
	</view>
</template>

<script>
	export default {
		name: "FilterBar",
		props: {
			filters: Array
		},
		data() {
			return {
				activeKey: 'all', // 触发展开项
				dropdownPosition: { // 记录下拉位置
					top: 0,
					left: 0
				},
				selectedParentKey: '', // 当前选中的父项
				selectedChildOption: { // 当前选中的子项
					key: '',
					value: ''
				}
			}
		},
		methods: {
			// 下拉列表管理
			toggleDropdown(key) {
				// 点击 'all' 直接选中并关闭 any 下拉
				if (key === 'all') {
					this.selectedParentKey = 'all';
					this.selectedChildOption = {
						key: 'all',
						value: ''
					};
					this.activeKey = '';
					return;
				}
				// 展开／收起同一个下拉
				if (this.activeKey === key) {
					this.activeKey = ''
				} else {
					this.activeKey = key
					this.selectedParentKey = key
				}
			},

			//渲染子选项
			getActiveOptions() {
				const item = this.filters.find(filterItem => filterItem.key === this.activeKey)
				if (item) {
					this.dropdownPosition = {
						top: item.bottom,
						left: item.left
					}
					return item.options
				} else {
					return []
				}
			},

			//选中选项后给父组件传值
			selectOption(value) {
				this.selectedChildOption = {
					key: this.activeKey,
					value: value
				}
				this.selectedParentKey = this.activeKey
				this.$emit('filter-change', this.activeKey, value)
				this.activeKey = ''
			}
		}
	}
</script>

<style scoped>
	.filter-bar {
		position: relative;
		z-index: 10;
	}

	/* 顶部父选项 */
	.filters {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.filter-item {
		width: 214rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
		border: 1rpx solid #dedefa;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.filter-item.active {
		border-color: #a6a5f0;
	}

	.filter-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}


	.icon {
		width: 48rpx;
		height: 48rpx;
		margin-left: -16rpx;
		margin-right: 8rpx;
	}

	.lable {
		padding: 10rpx;
		font-size: 24rpx;
		margin-right: 16rpx;
	}

	.arrow {
		width: 24rpx;
		height: 12rpx;
		transition: transform 0.3s;
	}

	.arrow.open {
		transform: rotate(180deg);
	}

	/* 下拉子选项 */
	.dropdown-panel {
		position: absolute;
		width: 570rpx;
		background: #ffffff;
		border: 1px solid #eeeeee;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-top: 10rpx;
		z-index: 99;
		box-shadow: 4rpx 8rpx 40rpx rgba(0, 0, 0, 0.15);
	}

	.option-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 20rpx;
	}

	.option {
		display: flex;
		align-items: center;
		padding: 16rpx;
		border: 1rpx solid #dfdfdf;
		border-radius: 10rpx;
	}

	.option.selected {
		border-color: #a6a5f0;
	}

	.icon-small {
		width: 40rpx;
		height: 40rpx;
		margin-right: 12rpx;
	}

	.option-text {
		font-size: 26rpx;
		color: #333;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 50;
	}
</style>