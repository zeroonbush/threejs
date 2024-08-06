import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(2, 2, 3);
camera.lookAt(0, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建物体
const axis = new THREE.AxesHelper(5);
scene.add(axis);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// 创建圆角立方体的几何体
function createRoundedBox(width, height, depth, radius, smoothness) {
  const shape = new THREE.Shape();
  const eps = 0.00001;
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(
    width - radius * 2,
    height - radius * 2,
    eps,
    Math.PI / 2,
    0,
    true
  );
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - radius * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius,
    curveSegments: smoothness,
  });

  geometry.center();
  return geometry;
}

// 创建材质
const material = new THREE.MeshPhongMaterial({ color: 0xff00f0 });

// 创建圆角立方体网格
const roundedBoxGeometry = createRoundedBox(1, 1, 1, 0.1, 10);
const roundedBox = new THREE.Mesh(roundedBoxGeometry, material);
roundedBox.rotation.x = 0.5;
roundedBox.rotation.y = 0.5;
scene.add(roundedBox);

// 添加光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  // roundedBox.rotation.x += 0.01;
  // roundedBox.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
