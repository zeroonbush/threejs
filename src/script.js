import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import floor from "../assets/images/floor.jpeg";
import number1 from "../assets/images/number1.png";
import number2 from "../assets/images/number2.png";
import number3 from "../assets/images/number3.png";
import number4 from "../assets/images/number4.png";
import number5 from "../assets/images/number5.png";
import number6 from "../assets/images/number6.png";

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)


// camera.position.x = 5;
// camera.position.y = 5;
// camera.position.z = 10;
camera.position.set(5, 5, 10);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.pixelRatio = window.devicePixelRatio;
renderer.setSize(window.innerWidth, window.innerHeight)
// 渲染器能够渲染阴影效果
renderer.shadowMap.enabled = true;
// renderer.setClearColor('#e5e5e5', 1)
document.body.appendChild(renderer.domElement)





// 创建物体
const axis = new THREE.AxesHelper(5);
scene.add(axis)


const geometry = new THREE.BoxGeometry(4, 4, 4);
// 设置纹理颜色
// const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const texuretloader = new THREE.TextureLoader()

// x正方向轴的面，x负方向轴的面，y正方向轴的面，y负方向轴的面，z正方向轴的面，z负方向轴的面.
const material = [
  new THREE.MeshBasicMaterial({
    map: texuretloader.load(number1),
  }),
  new THREE.MeshBasicMaterial({
    map: texuretloader.load(number6),
  }),
  new THREE.MeshBasicMaterial({
    map: texuretloader.load(number3),
  }),
  new THREE.MeshBasicMaterial({
    map: texuretloader.load(number4),
  }),
  new THREE.MeshBasicMaterial({
    map: texuretloader.load(number5),
  }),
  new THREE.MeshBasicMaterial({
    map: texuretloader.load(number2),
  })
]

const cube = new THREE.Mesh(geometry, material);
// 该立方体会产生影像效果
cube.castShadow = true;
cube.rotation.y = Math.PI / 4;
scene.add(cube);



// 新建了一个平面，该平面能够接受投射过来的阴影效果
const planeGeometry = new THREE.PlaneGeometry(20, 20);

// 初始化纹理加载器
const textloader = new THREE.TextureLoader()

const planeMaterial = new THREE.MeshStandardMaterial({ 
  // color: 0xff00ff ,  // 设置地板的颜色
  map: textloader.load(floor),
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -0.5 * Math.PI;
planeMesh.position.set(0, -3, 0);
planeMesh.receiveShadow = true;
scene.add(planeMesh);




const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 0, 10);
// 该方向会投射阴影效果
directionalLight.castShadow = true;
scene.add(directionalLight);
// 方向光的辅助线 为了清晰展示方向光的方向和位置，添加了一个辅助线
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
scene.add(directionalLightHelper); // 辅助线



const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime(); // 返回已经过去的时间, 以秒为单位
  // cube.rotation.y = elapsedTime * Math.PI; // 两秒自转一圈
  renderer.render(scene, camera);  // 渲染
}
animate();