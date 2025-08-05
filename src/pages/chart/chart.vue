<template>
	<view class="container">
		<!-- 色立体 -->
		<view class="color-cube">
			<view class="chart">
				<canvas 
					type="webgl2" 
					id="canvas" 
					@touchstart="canvasEventHandler" 
					@touchmove="canvasEventHandler"
					@touchcancel="canvasEventHandler" 
					@touchend="canvasEventHandler"
					@tap="canvasEventHandler"/>
			</view>
		</view>
		<!-- 收藏组件-->
		<Collection 
		  @received="hideChart"
		  :color-name="selectedColor.name"
		  :color-code="selectedColor.code"
		  :show-detail="showDetail"
		></Collection> 
	</view>
</template>

<script setup>
	import {ref} from 'vue'
	import * as THREE from 'three';
	import {adapter} from '@minisheep/three-platform-adapter';
	import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
	import '@minisheep/mini-program-polyfill-core/wechat-polyfill';
	import {wechat} from '@minisheep/three-platform-adapter/wechat';
	import Collection from "@/components/chart/collection.vue";

	defineOptions({
			name: 'ColorCubePage'
		})
		const selectedColor = ref({
		  name: '',
		  code: ''
		})
		const showDetail = ref(false)
		const colorPoints = [
			// 示例数据
			{ x: 2.3, y: -0.1, z: 0.3, name: "暗灰", code: "#373733" },
			{ x: 7.3, y: 0.5, z: 1.4, name: "黯白", code: "#C6B09A" },
			{ x: 3.9, y: -0.6, z: 0.6, name: "黯大绿", code: "#565E51" },
			{ x: 2.7, y: -1.1, z: 1.8, name: "偏黄的大绿", code: "#374323" },
			{ x: 2.5, y: -0.3, z: -0.4, name: "黯大青", code: "#343E42" },
			{ x: 4.9, y: -0.5, z: 1.5, name: "偏黄的二绿", code: "#76775B" },
			{ x: 4.6, y: -1.1, z: 1.1, name: "偏灰的黯二绿", code: "#61715A" },
			{ x: 3.8, y: -1.0, z: -2.3, name: "偏绿的二青", code: "#1C5F7D" },
			{ x: 4.5, y: -0.7, z: -0.5, name: "黯二青", code: "#596E73" },
			{ x: 4.0, y: 3.9, z: 2.3, name: "上好二朱", code: "#9F413C" },
			{ x: 6.7, y: 1.5, z: 4.4, name: "黯金", code: "#D19652" },
			{ x: 4.0, y: -2.0, z: -0.7, name: "孔雀蓝", code: "#286869" },
			{ x: 5.4, y: -1.9, z: -1.2, name: "浅孔雀蓝", code: "#478B95" },
			{ x: 3.5, y: -1.2, z: -1.0, name: "深孔雀蓝", code: "#2D5861" },
			{ x: 6.9, y: -1.4, z: 0.9, name: "黯绿华", code: "#94AF98" },
			{ x: 4.7, y: -0.4, z: 0.5, name: "绿灰", code: "#6C7066" },
			{ x: 0.7, y: 0.0, z: 0.7, name: "好墨", code: "#191406" },
			{ x: 8.7, y: 0.2, z: 0.7, name: "黯铅白", code: "#E3D8CD" },
			{ x: 5.5, y: 2.5, z: 3.3, name: "黯铅丹", code: "#BB724D" },
			{ x: 5.4, y: -0.7, z: -0.7, name: "黯青华", code: "#6E868E" },
			{ x: 5.5, y: -0.6, z: 0.0, name: "偏灰的黯青华", code: "#7A8885" },
			{ x: 5.4, y: -2.9, z: 1.2, name: "上好三绿", code: "#4C8F6D" },
			{ x: 6.1, y: -0.2, z: 1.1, name: "偏黄的三绿", code: "#97937F" },
			{ x: 5.4, y: -1.4, z: 1.1, name: "黯三绿", code: "#70876E" },
			{ x: 4.6, y: -1.1, z: -1.4, name: "偏绿的三青", code: "#437283" },
			{ x: 4.2, y: 2.7, z: 2.0, name: "鲜三朱", code: "#934F43" },
			{ x: 4.7, y: 1.3, z: 2.8, name: "深黄", code: "#926742" },
			{ x: 3.3, y: 0.1, z: 0.8, name: "深灰", code: "#524C41" },
			{ x: 2.5, y: 1.2, z: 1.4, name: "黯深朱", code: "#513326" },
			{ x: 2.5, y: 3.5, z: 1.9, name: "鲜深朱", code: "#6E1F20" },
			{ x: 5.9, y: 1.0, z: 2.3, name: "浅土黄", code: "#AC8766" },
			{ x: 3.7, y: 1.5, z: 1.5, name: "黯土朱", code: "#754E40" },
			{ x: 5.1, y: 1.4, z: 1.7, name: "浅土朱", code: "#9A6F5C" },

		]
	
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
			colorPoints.forEach((point) => {
				const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
				const material = new THREE.MeshBasicMaterial({
					color: new THREE.Color(point.code),
				});
				const cube = new THREE.Mesh(geometry, material);
				cube.position.set(point.x, point.y, point.z);
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
		
		//跳转色彩详情页
		function goToDetailPage() {
		  uni.navigateTo({
		    //url: /pages/colorDetail/colorDetail?name=${selectedColor.value.name}&code=${selectedColor.value.code}
		  });
		}
	
	</script>

<style>
	.container {
		padding: 70rpx 60rpx 10rpx 60rpx;
	}

	.color-cube {
		width: 100%;
		height: 802rpx;
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


</style>