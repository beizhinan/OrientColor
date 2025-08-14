<template>
	<view class="container">
		<!-- 色立体 -->
		<view class="color-cube">
			<view class="chart">
				<canvas 
					type="webgl2" 
					id="canvas" 
					v-if="showCanvas"
					@touchstart="canvasEventHandler" 
					@touchmove="canvasEventHandler"
					@touchcancel="canvasEventHandler" 
					@touchend="canvasEventHandler"
					@tap="canvasEventHandler"/>
			</view>
		</view>
		
		<!-- 交互规则 -->
		<view class="rule">
			<image class="tips-icon" src="/src/static/showcase/collection-info.png"></image>
			<text class="tips-title">交互规则</text>
			<text class="tips">双指滑动可对模型进行缩放，点击某一色块可查看细节</text>
		</view>
		
		<!-- 色彩详情组件 -->
		<detail-card
		  :color-name="selectedColor.name"
		  :color-code="selectedColor.code"
		  :cardStyle="'2d'"
		  v-if="showDetail">
		</detail-card>
		
		<!-- 收藏组件-->
		<view class="collection-container">
			<collection></collection>
		</view>
		
		<!-- 底部导航-->
		<buttomTabVue></buttomTabVue>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onShow, onHide, onLoad } from '@dcloudio/uni-app'
	import * as THREE from 'three';
	import {adapter} from '@minisheep/three-platform-adapter';
	import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
	import '@minisheep/mini-program-polyfill-core/wechat-polyfill';
	import {wechat} from '@minisheep/three-platform-adapter/wechat';
	import detailCard from "@/components/chart/detailCard.vue"
	import collection from "@/components/chart/collection.vue";
	import buttomTabVue from '@/components/buttomTab/buttomTab.vue'

	defineOptions({
			name: 'ColorCubePage'
		})
		const selectedColor = ref({
		  name: '',
		  code: ''
		})
		const showDetail = ref(false)
		const showCanvas= ref(true)
		const colorPoints = ref([])
		
		onLoad((options) => {
		  colorPoints.value = JSON.parse(decodeURIComponent(options.colorPoints)) || []
		})
	
		const canvasEventHandler = ref(() => {});
		adapter
			.useCanvas('#canvas')
			.then(({
				canvas,
				requestAnimationFrame,
				eventHandler,
			}) => {
				canvasEventHandler.value = eventHandler;
				initThree(canvas, requestAnimationFrame);
			});
		
		function initThree(canvas, requestAnimationFrame){
			const scene = new THREE.Scene();
			scene.background = new THREE.Color(0xffffff);
			
			const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
			camera.position.set(10,0,0);
			camera.lookAt(scene.position);
			
			const renderer = new THREE.WebGLRenderer({
				canvas
			});
			renderer.setSize(canvas.clientWidth, canvas.clientHeight);
			
			const controls = new OrbitControls(camera, renderer.domElement);
			controls.enableDamping = true;
			controls.minDistance = 2;  // 最小缩放距离（越小越近）
			controls.maxDistance = 10; // 最大缩放距离（越大越远）
			
			const group = new THREE.Group();
			
			//坐标系
			const axesHelper = new THREE.AxesHelper(4)
			group.add(axesHelper)
			// XZ 平面
			const gridXZ = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee);
			gridXZ.rotation.x = 0;
			group.add(gridXZ);
			gridXZ.position.x = 5
			// XY 平面
			const gridXY = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee);
			gridXY.rotation.x = Math.PI / 2;
			gridXY.position.x = 5
			group.add(gridXY);
			// YZ 平面
			const gridYZ = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee);
			gridYZ.rotation.z = Math.PI / 2;
			group.add(gridYZ);
			
			// 用于点击检测
			const raycaster = new THREE.Raycaster();
			const mouse = new THREE.Vector2();
			
			// 所有小立方体的引用
			const cubeList = [];
			
			// 添加颜色点
			colorPoints.value.forEach((point) => {
				const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
				const material = new THREE.MeshBasicMaterial({
					color: new THREE.Color(point.code),
				});
				const cube = new THREE.Mesh(geometry, material);
				cube.position.set(point.L/ 10, point.a/ 10, point.b/ 10);
				cube.userData = {
					name: point.name,
					color: point.code,
				};
				cubeList.push(cube);
				group.add(cube)
			})
			
			//使用group控制模型
			group.visible = true;
			scene.add(group)
			
			// 绑定点击事件
			canvas.addEventListener('click', function(event) {
				// 获取 canvas 尺寸
				const rect = canvas.getBoundingClientRect();
				mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
				mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
			
				raycaster.setFromCamera(mouse, camera);
				const intersects = raycaster.intersectObjects(cubeList);
			
				if (intersects.length > 0) {
					const cube = intersects[0].object;
					const data = cube.userData;
					selectedColor.value = {
					    name: data.name,
					    code: data.color
					};
					showDetail.value = true;
				}
			});
			
			
			function animate() {
				requestAnimationFrame(animate);
				controls.update();
				renderer.render(scene, camera);
			}
			
			animate();
		}
		
		//控制canvas的显示
		function handleHideChart(val){
			showCanvas.value = val
		}
		onHide(() => {
			// 清理事件绑定（如果是自定义事件）
			if (canvasEventHandler.value && canvasEventHandler.value.dispose) {
				canvasEventHandler.value.dispose();
			}
		})
		onShow(() => {
		  showCanvas.value = true
		  console.log(showCanvas.value)
		  const canvasEventHandler = ref(() => {});
		  adapter
		  	.useCanvas('#canvas')
		  	.then(({
		  		canvas,
		  		requestAnimationFrame,
		  		eventHandler,
		  	}) => {
		  		canvasEventHandler.value = eventHandler;
		  		initThree(canvas, requestAnimationFrame);
		  	});
		})
		
	
	</script>

<style>
	.container {
		padding: 70rpx 60rpx 10rpx 60rpx;
		background-color: #fffbf6;
		height: 100vh;
		box-sizing: border-box;
	}

	.color-cube {
		width: 100%;
		height: 802rpx;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 24rpx;
		border-radius: 32rpx;
		box-shadow: 4rpx 4rpx 42rpx rgba(0, 0, 0, 0.25);
	}
	
	.chart{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		padding: 20rpx;
	}

	canvas {
		width: 100%;
		height: 100%;
	}
	
	.color-card{
		position: absolute;
		right:0rpx;
		top: 30rpx;
		z-index: 9999;
	}
	
	.overlay{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}
	
	.tips-icon {
		height: 20rpx;
		width: 20rpx;
		margin-right: 5rpx;
	}
	
	.tips-title {
		font-weight: 500;
		font-size: 20rpx;
		color: #5a3d2e;
		font-weight: 700;
		margin-right: 5rpx;
	}
	
	.tips {
		font-size: 17.4rpx;
		color: #7d6e5d;
	}
	
	.collection-container {
		
	}

	
</style>