import * as THREE from 'three';

import { type ISizes } from '@interfaces/sizes.interfaces';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const addSceneRenderer = (canvas: HTMLCanvasElement, sizes: ISizes) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  if (window) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  return renderer;
};

export const addSceneLighting = (scene: THREE.Scene) => {
  // Ambient Light
  const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5);
  directionalLight.position.set(3, 2, -8);
  scene.add(directionalLight);

  return { ambientLight, directionalLight };
};

export const addSceneCamera = (scene: THREE.Scene, sizes: ISizes) => {
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.x = 4;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);
  return camera;
};

export const addSceneOrbitalControls = (
  camera: THREE.PerspectiveCamera,
  canvas: HTMLCanvasElement,
) => {
  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  return controls;
};
