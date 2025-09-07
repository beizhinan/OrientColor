<template>
	<!-- 二维模型选项 -->
	<view class="tip-box" v-if="dimension == '2D'">
		<view class="button-group">
			<view 
			    v-for="dim in dimPairs1" 
			    :key="dim" 
			    class="button-wrapper"
			>
			    <!-- 图标 -->
			    <image 
			        class="dim-icon" 
			        :src="get2DIcon(dim)" 
			        mode="aspectFit"
			    />
			    <!-- 按钮 -->
			    <view 
			        :class="[
			          'dim-button',
			          dim === 'CH(ab)' ? 'CH-button' : '',  // CH(ab) 单独样式
			          current2DSelected === dim ? 'active' : ''
			        ]"
			        @tap="select2D(dim)"
			    >
			        {{ dim }}
			    </view>
			</view>
		</view>
	</view>

	<!-- 一维模型选项 -->
	<view class="tip-box" v-if="dimension == '1D'">
		<view class="button-group">
			<view
			    v-for="dim in dim1D" 
			    :key="dim" 
			    class="button-wrapper"
			>
			    <!-- 图标 -->
			    <image 
					:class="[
					  'dim-icon1',
					  dim === 'H' ? 'H-icon' : '',  // H图标单独样式
					]"
			        :src="get1DIcon(dim)" 
			        mode="aspectFit"
			    />
			    <!-- 按钮 -->
			    <view 
			      :class="['dim-button1', current1DSelected === dim ? 'active' : '']"
			      @tap="select1D(dim)">
			        {{ dim }}
			    </view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dimension: {
				type: String,
				required: true,
			},
			button: {
				type: String,
				required: true,
			},
		},
		name: "InteractionTip",
		data() {
			return {
				selected1DB1: 'L',
				selected1DB2: 'H',
				selected2DB1: 'LC',
				selected2DB2: 'LH',
				dim1D: ['L', 'a', 'b', 'C', 'H'],
				dimPairs1: ['LC', 'La', 'Lb', 'LH', 'CH(ab)']
			}
		},
		computed: {
		  current2DSelected() {
		    return this.button === 'button1' ? this.selected2DB1 : this.selected2DB2
		  },
		  current1DSelected() {
		    return this.button === 'button1' ? this.selected1DB1 : this.selected1DB2
		  }
		},
		methods: {
			select1D(dim) {
				this.selected1DB1 = dim;
				this.selected1DB2 = dim;
				this.$emit('select1D', dim);
				if (dim === 'H'){
					this.$emit('changeChart', 'polar');
				} else{
					this.$emit('changeChart', 'rect');
				}
			},
			select2D(dim) {
				this.selected2DB1 = dim
				this.selected2DB2 = dim
				this.$emit('select2DRect', dim);
				this.$emit('select2DPolar', dim);
				if (dim === 'LC' || dim === 'La' || dim === 'Lb'){
					this.$emit('changeChart', 'rect');
				} else{
					this.$emit('changeChart', 'polar');
				}
			},
			get1DIcon(dim) {
				switch (dim) {
					case 'L': return '/static/showcase/interaction-L.png';
					case 'a': return '/static/showcase/interaction-a.png';
					case 'b': return '/static/showcase/interaction-b.png';
					case 'C': return '/static/showcase/interaction-C.png';
					case 'H': return '/static/showcase/interaction-H.png';
					default: return '/static/showcase/interaction-H.png';
				}
			},
			get2DIcon(dim) {
				switch (dim) {
					case 'LC': return '/static/showcase/interaction-LC.png';
					case 'La': return '/static/showcase/interaction-La.png';
					case 'Lb': return '/static/showcase/interaction-Lb.png';
					case 'LH': return '/static/showcase/interaction-LH.png';
					case 'CH(ab)': return '/static/showcase/interaction-CH.png';
					default: return '/static/showcase/interaction-H.png';
				}
			}
		}
	}
</script>

<style scoped>
	.tip-box {
		width: 720rpx;
		height: 236rpx;
		background-image: url(/static/showcase/interaction-background.png);
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		padding: 10rpx;
		margin-top: 20rpx;
		display: flex;           
		flex-direction: column;  
		align-items: center;      
		justify-content: center;  
		box-sizing: border-box;
	}
	
	.button-group {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-top: 8rpx;
		justify-content: center;  
		width: 100%;  
	}
	
	.button-wrapper {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}
	
	.dim-icon {
	  width: 76rpx;
	  height: 76rpx;
	  margin-bottom: 20rpx;
	}
	
	.dim-icon1 {
	  width: 80rpx;
	  height: 80rpx;
	  margin-bottom: 20rpx;
	}
	
	.H-icon{
		width: 60rpx;
	}

	.dim-button {
		padding: 15rpx 40rpx;
		border-radius: 12rpx;
		font-size: 32rpx;
		background-color: #fff;
		color: #8e8e93;
		box-shadow: 0 0 8rpx rgba(129, 72, 72, 0.21);
	}
	
	 /* CH(ab) 单独样式 */
	.CH-button {
		padding: 15rpx 10rpx;
	}
	
	.dim-button1{
		padding: 15rpx 50rpx;
		border-radius: 12rpx;
		font-size: 32rpx;
		background-color: #fff;
		color: #8e8e93;
		box-shadow: 0 0 8rpx rgba(129, 72, 72, 0.21);
	}
	
	.active {
		color: #ed6e00;
	}
</style>