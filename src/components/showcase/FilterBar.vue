<template>
	<view class="filter-bar">
		<!-- 顶部筛选项 -->
		<view class="filters">
			<view v-for="item in filters" :key="item.key" class="filter-item" :class="{ 
					active: Array.isArray(selectedParentKey) ? selectedParentKey.includes(item.key) : item.key === selectedParentKey, 
					all: item.key === 'all',
					theme: item.key === 'theme'
				}" @tap="toggleDropdown(item.key)">

				<!-- 全部 -->
				<view v-if="item.key === 'all'" class="filter-all" @tap="[activeKey='all', selectOption('all')]">
					<text class="label"> {{ item.label }}</text>
				</view>
				
				<view v-else class="filter-content">
					<!-- 如果是 system 且有选中子项，用子项色块替换父 icon -->
					<template v-if="item.key === 'system'">
						<view v-if="selectedParentKeyArray && selectedParentKeyArray.some(i => i.key === 'system')" 
							class="icon-color" 
							:style="{ backgroundColor: getColorCode(selectedParentKeyArray.find(i => i.key === 'system').value), width:'40rpx', height:'40rpx', borderRadius:'50%' }">
						</view>
						<image v-else :src="item.icon" class="icon"></image>
						<text class="label" >
							{{ selectedParentKeyArray && selectedParentKeyArray.find(i => i.key === 'system') 
							? selectedParentKeyArray.find(i => i.key === 'system').value 
							: item.label }}
						</text>
					</template>

					<!-- 非 system 或 system 未选中 -->
					<template v-else>
						<image class="icon" 
							:src="item.key === selectedParentKey || (Array.isArray(selectedParentKey) && selectedParentKey.includes(item.key)) 
							? item.iconActive 
							: item.icon">
						</image>
						<!-- 有选中子项就显示子项文字，否则显示父类文字 -->
						<text class="label">
							{{
								selectedParentKeyArray && selectedParentKeyArray.find(i => i.key === item.key) 
								? selectedParentKeyArray.find(i => i.key === item.key).value 
								: item.label 
							}}
						</text>
					</template>

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
				<view v-for="opt in getActiveOptions()" :key="opt" :class="[activeKey === 'theme' ? 'option-c' : 'option', 
				         { selected: selectedParentKeyArray && selectedParentKeyArray.find(i => i.key === activeKey) && selectedParentKeyArray.find(i => i.key === activeKey).value === opt  }]"
					@tap="selectOption(opt)">
					<!-- 只有色系有icon -->
					<view v-if="activeKey === 'system'" class="icon-color"
						:style="{ backgroundColor: getColorCode(opt) }">
					</view>
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
					value: '',
				},
				selectedColor: [ // 色系图标
					{
						option: '红',
						code: '#ffb3b3'
					},
					{
						option: '橙',
						code: '#ffd3b3'
					},
					{
						option: '黄',
						code: '#fff9b3'
					},
					{
						option: '绿',
						code: '#b3ffcc'
					},
					{
						option: '紫',
						code: '#e3b3ff'
					},
					{
						option: '黑',
						code: '#b3b3b3'
					},
					{
						option: '白',
						code: '#f7f7f7'
					},
					{
						option: '灰',
						code: '#dadada'
					},
					{
						option: '青',
						code: '#b3fff3'
					}
				]

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
					this.selectedParentKeyArray = []; 
					this.$emit('filter-change', this.selectedParentKeyArray);
					this.activeKey = '';
					return;
				}
				// 展开／收起同一个下拉 
				if (this.activeKey === key) {
					this.activeKey = ''
				} else {
					this.activeKey = key
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

			//匹配色调icon
			getColorCode(optionName) {
				const match = this.selectedColor.find(item => item.option === optionName);
				return match ? match.code : '#ffffff'; // 没匹配到就默认白色
			},

			//选中选项后给父组件传值
			selectOption(value) {
				// 如果点击的是 all
				if (this.activeKey === 'all') {
					this.selectedParentKeyArray = [
						{ key: 'all', value: 'all' }
					];
					this.selectedParentKey = ['all'];
				
					// 通知父组件
					this.$emit('filter-change', this.selectedParentKeyArray);
					this.activeKey = '';
					return;
				}
				
				// 如果之前点过 all，这里点击其它选项时要清空 all
				if (this.selectedParentKeyArray?.some(item => item.key === 'all')) {
					this.selectedParentKeyArray = [];
					this.selectedParentKey = [];
				}
				
				// 正常选项逻辑
				this.selectedChildOption = {
					key: this.activeKey,
					value: value
				}
				// 使用数组保存所有父选项选中的子项
				if (!this.selectedParentKeyArray) this.selectedParentKeyArray = [];

				const index = this.selectedParentKeyArray.findIndex(item => item.key === this.activeKey);
				if (index > -1) {
					// 已存在该父项，更新子项
					this.selectedParentKeyArray[index].value = value;
				} else {
					// 新父项，添加到数组
					this.selectedParentKeyArray.push({
						key: this.activeKey,
						value: value
					});
				}

				// 父选项标记为多选显示状态（可以根据 UI 调整显示逻辑）
				if (!Array.isArray(this.selectedParentKey)) this.selectedParentKey = [];
				if (!this.selectedParentKey.includes(this.activeKey)) {
					this.selectedParentKey.push(this.activeKey);
				}

				// 向父组件传多选结果
				this.$emit('filter-change', this.selectedParentKeyArray);
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
		justify-content: flex-start;
		margin-bottom: 20rpx;
	}

	.filter-item {
		width: 214rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
		margin-right: 5rpx;
		border: 1rpx solid #deb67f;
		border-radius: 10rpx;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.filter-item.active {
		border-color: #5a3d2e;
	}

	.filter-item.all {
		background-color: #deb67f;
	}
	
	.filter-item.theme {
		width: 435rpx;
	}

	.filter-all {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.filter-all .label {
		font-size: 26rpx;
		color: #ffffff;
	}

	.filter-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.icon {
		width: 48rpx;
		height: 48rpx;
		margin-left: 16rpx;
	}

	.label {
		flex: 1;              
		text-align: center;     
		padding: 10rpx;
		font-size: 24rpx;
		margin: 0 16rpx;      
	}

	.arrow {
		width: 24rpx;
		height: 12rpx;
		margin-right: 16rpx;
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

	.option-c {
		display: flex;
		align-items: center;
		height: 64rpx;
		padding: 0 45rpx;
		border: 2rpx solid #ebebeb;
		border-radius: 10rpx;
	}

	.option {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 124rpx;
		height: 64rpx;
		border: 2rpx solid #ebebeb;
		border-radius: 10rpx;
	}

	.option.selected {
		border-color: #deb67f;
	}

	.option-c.selected {
		border-color: #deb67f;
	}

	.icon-color {
		width: 40rpx;
		height: 40rpx;
		border-radius: 200rpx;
		margin-right: 20rpx;
	}

	.option-text {
		font-size: 26rpx;
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