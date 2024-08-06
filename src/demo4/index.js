import * as THREE from "three";

const camera = new THREE.PerspectiveCamera();
camera.position.z = 500;

// 创建场景，并设置雾效果
const scene = new THREE.Scene();

// THREE.FogExp2 是 Three.js 中的一种雾效果类型，使用指数衰减来模拟雾的效果。它可以用于在场景中添加雾气，使得远处的物体逐渐变得模糊，从而增加场景的深度感和真实感
// 创建一个 FogExp2 对象，设置雾的颜色和浓度
const fog = new THREE.FogExp2(0x0000ff, 0.001);
// 将雾效果应用到场景中
scene.fog = fog;

// 创建粒子的几何体
const geometry = new THREE.BufferGeometry();

var vertices = [];
const size = 2000;
const colors = [];

// 随机生成坐标
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() * size + Math.random() * size) / 2 - size / 2;
  const y = (Math.random() * size + Math.random() * size) / 2 - size / 2;
  const z = (Math.random() * size + Math.random() * size) / 2 - size / 2;
  vertices.push(x, y, z);
  // 随机生成颜色
  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  colors.push(color.r, color.g, color.b);
}
// 将顶点数据添加到几何体中
geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(vertices, 3)
);

// 将颜色数据添加到几何体中
geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

// 创建一个 PointsMaterial 对象 粒子的材质
const material = new THREE.PointsMaterial({
  size: 2, // 点的大小
  vertexColors: true, // 启用顶点颜色
  sizeAttenuation: true, // 根据相机距离缩放点的大小
  transparent: true, // 启用透明度
  opacity: 0.75, // 设置透明度
});

scene.add(new THREE.Points(geometry, material));

// 创建 WebGL 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let mouseX = 0;
let mouseY = 0;

document.body.addEventListener("pointermove", (e) => {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = e.clientY - window.innerHeight / 2;
});

function render() {
  camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
  camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
  scene.rotation.x += 0.001;
  scene.rotation.y += 0.002;
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
animate();
