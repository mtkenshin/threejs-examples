import * as THREE from 'three';
import * as dat from 'dat-gui';
import type { ISizes } from '@interfaces/sizes.interfaces';
import {
  addSceneCamera,
  addSceneOrbitalControls,
  addSceneRenderer,
  addSceneLighting,
} from '@utility/core/commonFunctions';
import { eachFrame } from '@utility/core/eachFrame';
import { addResizeEvent } from '@utility/core/addResizeEvent';
import { Sky } from 'three/examples/jsm/Addons.js';
import { MathUtils } from 'three';

const textureLoader = new THREE.TextureLoader();

const loadParticleTextures = (particleFileName: string) => {
  return textureLoader.load(`/textures/particles/${particleFileName}`);
};

interface IParameters {
  count: number;
  size: number;
  radius: number;
  branches: number;
  spin: number;
  randomness: number;
  randomnessPower: number;
  insideColor: string;
  outsideColor: string;
  animationSpeed: number;
}
export class GalaxyGenerator {
  private scene;
  private canvas;
  private renderer;
  private camera;
  private sizes: ISizes;
  private controls;
  private gui;
  private parameters: IParameters;
  private geometry: THREE.BufferGeometry | null;
  private material: THREE.PointsMaterial | null;
  private points: THREE.Points | null;
  private textureLoader;

  constructor(canvas: HTMLCanvasElement, sizes: ISizes) {
    this.canvas = canvas;
    this.sizes = sizes;
    this.scene = new THREE.Scene();
    this.renderer = addSceneRenderer(canvas, sizes);
    this.camera = addSceneCamera(this.scene, sizes);
    this.controls = addSceneOrbitalControls(this.camera, canvas);
    this.gui = new dat.GUI({ width: 400 });
    this.parameters = {
      count: 100000,
      size: 0.001,
      radius: 5,
      branches: 4,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984',
      animationSpeed: 0.000004,
    };
    this.geometry = null;
    this.material = null;
    this.points = null;
    this.textureLoader = new THREE.TextureLoader();
  }

  loadParticleTextures = (particleFileName: string) => {
    return textureLoader.load(`/textures/particles/${particleFileName}`);
  };

  guiManager = () => {
    this.gui
      .add(this.parameters, 'count')
      .min(100)
      .max(1000000)
      .step(100)
      .onFinishChange(this.generateGalaxy);
    this.gui
      .add(this.parameters, 'size')
      .min(0.001)
      .max(0.1)
      .step(0.001)
      .onFinishChange(this.generateGalaxy);
    this.gui
      .add(this.parameters, 'radius')
      .min(0.01)
      .max(20)
      .step(0.01)
      .onFinishChange(this.generateGalaxy);
    this.gui
      .add(this.parameters, 'branches')
      .min(2)
      .max(20)
      .step(1)
      .onFinishChange(this.generateGalaxy);
    this.gui
      .add(this.parameters, 'spin')
      .min(-5)
      .max(5)
      .step(0.001)
      .onFinishChange(this.generateGalaxy);
    this.gui
      .add(this.parameters, 'randomness')
      .min(0)
      .max(2)
      .step(0.001)
      .onFinishChange(this.generateGalaxy);
    this.gui
      .add(this.parameters, 'randomnessPower')
      .min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(this.generateGalaxy);
    this.gui
      .addColor(this.parameters, 'insideColor')
      .onFinishChange(this.generateGalaxy);
    this.gui
      .addColor(this.parameters, 'outsideColor')
      .onFinishChange(this.generateGalaxy);
    this.gui
      .add(this.parameters, 'animationSpeed')
      .min(0.000004)
      .max(0.00001)
      .step(0.000001)
      .onFinishChange(this.generateGalaxy);
  };

  setCameraPos = () => {
    this.camera.position.set(0, 4, 4);
    this.camera.lookAt(
      new THREE.Vector3(
        this.points?.position.x,
        this.points?.position.y,
        this.points?.position.z,
      ),
    );
  };

  generateGalaxy = () => {
    if (this.points !== null) {
      this.geometry?.dispose();
      this.material?.dispose();
      this.scene.remove(this.points);
    }

    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(this.parameters.count * 3);
    const vertexColors = new Float32Array(this.parameters.count * 3);
    const starSizes = new Float32Array(this.parameters.count);

    const insideColor = new THREE.Color(this.parameters.insideColor);
    const outsideColor = new THREE.Color(this.parameters.outsideColor);

    for (let i = 0; i < this.parameters.count; i++) {
      const x = i * 3;
      const y = x + 1;
      const z = y + 1;

      const radius = Math.random() * this.parameters.radius;
      const spinAngle = radius * this.parameters.spin;
      const branchAngle =
        ((i % this.parameters.branches) / this.parameters.branches) *
        Math.PI *
        2;

      const randomX =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomZ =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);

      positions[x] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[y] = randomY;
      positions[z] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color XYZ => RGB
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / this.parameters.radius);

      vertexColors[x] = mixedColor.r;
      vertexColors[y] = mixedColor.g;
      vertexColors[z] = mixedColor.b;

      starSizes[i] =
        Math.random() * (0.001 - this.parameters.size) + this.parameters.size;

      if (i < 20) {
        console.log(starSizes[i]);
      }
    }

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );

    this.geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(vertexColors, 3),
    );

    this.geometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    this.material = new THREE.PointsMaterial({
      size: this.parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      alphaMap: loadParticleTextures('3.png'),
    });

    this.points = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.points);
  };

  start = () => {
    addResizeEvent(this.sizes, this.camera, this.renderer);
    addSceneLighting(this.scene);
    this.guiManager();
    this.generateGalaxy();
    this.setCameraPos();

    eachFrame(
      this.scene,
      this.camera,
      this.renderer,
      (elapsedTime: number) => {
        if (this.points) {
          this.points.rotation.y +=
            Math.PI * elapsedTime * this.parameters.animationSpeed;
        }
      },
      this.controls,
    );
  };
}
