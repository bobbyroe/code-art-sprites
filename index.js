import * as THREE from "three";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.131/examples/jsm/controls/OrbitControls.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const sceneData = {
  images: [],
  palette: [0x001524, 0x15616d, 0xffecd1, 0xff7d00, 0x78290f],
};
function getRandomColor () {
  const hex = sceneData.palette[Math.floor(Math.random() * sceneData.palette.length)];
  return new THREE.Color(hex);
}
function init() {
  const { images } = sceneData;

  function getSprite({ color, imgs, opacity, pos, range, hasRandomRotation, size }) {
    const layerImages = images.filter((img) => imgs.includes(img.name));
    const map = layerImages[Math.floor(Math.random() * layerImages.length)];

    color = Math.random() > 0.9 ? getRandomColor() : color;

    const spriteMat = new THREE.SpriteMaterial({ color, map, transparent: true, opacity });
    spriteMat.color.offsetHSL(0, 0, Math.random() * 0.2 - 0.1);
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(
      pos.x + Math.random() * range - range * 0.5,
      -pos.y + Math.random() * range - range * 0.5,
      pos.z,
    ); 
    size += Math.random() - 0.5;
    sprite.scale.set(size, size, size);
    sprite.material.rotation = hasRandomRotation ? Math.random() * Math.PI * 2 : 0;
    return sprite;
  }

  function getLayer ({ color, imgs, numSprites = 10, opacity = 1, range = 1, hasRandomRotation = false, size = 1, z = 0 }) {
    const length  = 4;
    for (let i = 0; i < numSprites; i += 1) {
      const pos = new THREE.Vector3(
        length * i / numSprites - length * 0.5,
        length * i / numSprites - length * 0.5,
        z + Math.random(),
      );
      const sprite = getSprite({ color, imgs, opacity, pos, range, hasRandomRotation, size });
      scene.add(sprite);
    }
  }
  getLayer({ 
    color: getRandomColor(),
    imgs: ['1', '2', '3'],
    numSprites: 20,
    range: 2,
  });
  getLayer({ 
    color: getRandomColor(),
    imgs: ['coin'],
    numSprites: 10,
    hasRandomRotation: true,
    size: 0.2,
    range: 5,
    opacity: 0.5,
    z: -0.5,
  });
  getLayer({ 
    color: getRandomColor(),
    imgs: ['saucer'],
    numSprites: 4,
    size: 2,
    range: 6,
    opacity: 0.4,
    z: -1.25,
  });
  getLayer({ 
    color: getRandomColor(),
    imgs: ['circle'],
    numSprites: 100,
    size: 0.1,
    range: 5,
    opacity: 0.1,
    z: -1,
  });
  getLayer({ 
    color: getRandomColor(),
    imgs: ['rad-grad'],
    numSprites: 20,
    opacity: 0.5,
    range: 3,
    size: 4,
    z: -1.5,
  });
  function animate(t = 0) {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}
const images = [
  '1',
  '2',
  '3',
  'base',
  'circle',
  'coin',
  'flame',
  'heart',
  'player',
  'rad-grad',
  'saucer',
  'skull',
]
const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);
manager.onLoad = init;
images.forEach((name) => {
  loader.load(`./images/${name}.png`, (img) => {
    img.name = name;
    sceneData.images.push(img);
  });
});

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);