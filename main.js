import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

// Current view height and view width sizes.
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const randomColor = Math.floor(Math.random() * 16777215).toString(16);

const scene = new THREE.Scene();

// Mesh parts
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: '#' + randomColor, roughness: 0.7 });

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lighting
const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(20, 15, 15);
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.5, 100);
camera.position.z = 28;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.sphere');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;

controls.autoRotate = true;
controls.autoRotateSpeed = 8;

// Resize event listener. Updates the current width for the camera and renderer.
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    renderer.setSize(sizes.width, sizes.height);
    camera.updateProjectionMatrix();
});


// Updates the scene and controls.
const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
};
loop();

// Animations
const tl = gsap.timeline({ defaults: { duration: 0.8 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('h2', { opacity: 0 }, { opacity: 1 });

// Mouse drag color changing
let mouseDown = false;
let rgb;
window.addEventListener('mousedown', () => mouseDown = true);
window.addEventListener('mouseup', () => mouseDown = false);

window.addEventListener('mousemove', (event) => {
    if (mouseDown) {
        rgb = [
            Math.round(event.pageX / sizes.width * 255),
            Math.round(event.pageY / sizes.height * 255),
            125
        ];

        const newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
        gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b });
    }
});