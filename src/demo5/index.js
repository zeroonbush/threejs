import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import images from "./data.json";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 2000;
// 渲染器
const renderer = new CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#container").appendChild(renderer.domElement);
//坐标初始化
const vector = new THREE.Vector3(); //三维坐标
//轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true; //为true时，相机自动围绕目标旋转,但必须在animation循环中调用update()
let objects = []; //存放转化为3D的照片对象
let spheres = []; //用来存放目标对象的位置
const tweenGroup = new TWEEN.Group();
function transform(spheres, duration) {
  for (let i = 0; i < objects.length; i++) {
    let object = objects[i];
    let target = spheres[i];
    new TWEEN.Tween(object.position, tweenGroup) //过渡图片移动的位置
      .to(
        { x: target.position.x, y: target.position.y, z: target.position.z },
        Math.random() * duration + duration
      ) //改变当前模型的位置
      .easing(TWEEN.Easing.Exponential.InOut) //运动曲线
      .start(); //开启动画

    new TWEEN.Tween(object.rotation, tweenGroup) //过渡图片旋转
      .to(
        { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }
}

window.addEventListener("mousedown", handlePopup);
// 鼠标单击事件
function handlePopup(e) {
  let name = e.target.name;
  if (!name) {
    let div = document.querySelector("#popup");
    div.style.display = "none";
  } else {
    let h = window.innerHeight;
    let div = document.querySelector("#popup");
    div.style.display = "block";
    div.style.backgroundImage = `url(${images[name]})`;
    div.style.backgroundSize = "cover";
    div.style.height = h * 0.7 + "px";
    div.style.width = h * 0.6 + "px";
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.right = "0px";
    div.style.top = "0px";
    div.style.bottom = "0px";
    div.style.margin = "auto";
    div.style.borderRadius = "5px";
  }
}

function init() {
  //放图片
  for (let i = 0; i < images.length; i++) {
    let element = document.createElement("div");
    element.className = "element"; //给图片加类名即设置对应的图片大小
    element.style.backgroundImage = `url(${images[i]})`;
    element.style.backgroundSize = "cover"; //保持图像的宽高比例，将图片缩放到正好完全覆盖定义的背景区域
    element.name = i; // 给元素的name属性赋值，以便获取鼠标点击的当前值
    let object = new CSS3DObject(element); //可以将HTML元素作为纹理添加到3D对象中，从而创建有趣的3D特效
    scene.add(object);
    objects.push(object); //为了知道被添加到照片元素的个数
  }
  let l = objects.length;
  // 根据球形排列公式计算每个元素的位置
  for (let i = 0; i < l; i++) {
    //该部分为固定的数学公式
    let phi = Math.acos(-1 + (2 * i) / l);
    let theta = Math.sqrt(l * Math.PI) * phi;
    // 计算元素在球面上的坐标
    let x = 800 * Math.cos(theta) * Math.sin(phi); //800代表球的半径
    let y = 800 * Math.sin(theta) * Math.sin(phi);
    let z = 800 * Math.cos(phi);
    let object = new THREE.Object3D();
    object.position.set(x, y, z); //设置对象的位置
    vector.copy(object.position).multiplyScalar(2); //将该向量与所传入的标量2进行相乘。
    object.lookAt(vector); //vector这个变量的作用，它用来作为'目标位置'，使用这个方法让这个位置的对象object看向vector这一点所在的方向
    spheres.push(object);
  }
  transform(spheres, 2000); //动画转换
}

function animate() {
  requestAnimationFrame(animate);
  tweenGroup.update(); // 更新 TWEEN.Group
  controls.update();
  renderer.render(scene, camera);
}

window.onload = function () {
  init(); //初始化并形成球体照片墙
  animate(); //每隔一段时间渲染
};
