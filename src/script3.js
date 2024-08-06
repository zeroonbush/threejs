import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import imgUrl from "../assets/images/1.webp";
import imgUrl2 from "../assets/images/exam-test.webp";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 25;
camera.position.x = 5;
camera.position.y = 1;
camera.lookAt(1, 0, 4);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const sideTexture = textureLoader.load(imgUrl2, (texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.offset.set(0.0, -0.042);
  texture.repeat.set(0.1, 1);
});

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 1024;
const coverImage = new Image();
coverImage.src = imgUrl2;
coverImage.onload = () => {
  context.drawImage(
    coverImage,
    -80,
    -150,
    canvas.width + 170,
    canvas.height + 300
  );
  const fabricImage = new Image();
  fabricImage.src = imgUrl;
  fabricImage.onload = () => {
    context.globalAlpha = 0.1;
    context.drawImage(fabricImage, 0, 0, canvas.width, canvas.height);
    const combinedTexture = new THREE.CanvasTexture(canvas);
    const bookCoverMaterial = new THREE.MeshStandardMaterial({
      map: combinedTexture,
    });
    const bookSideMaterial = new THREE.MeshStandardMaterial({
      map: sideTexture,
    });
    const materials = [
      bookSideMaterial,
      bookSideMaterial,
      bookSideMaterial,
      bookSideMaterial,
      bookCoverMaterial,
      bookCoverMaterial,
    ];
    const geometry = new THREE.BoxGeometry(7, 7, 1, 1, 1, 1);
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.rotation.y = Math.PI / 10 + 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.castShadow = true;
    light.position.set(2, 2, 2).normalize();
    scene.add(light);

    // const axis = new THREE.AxesHelper(5);
    // scene.add(axis);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  };
};
