import * as THREE from 'three';
import * as dat from 'dat-gui';
import type { ISizes } from '@interfaces/sizes.interfaces';
import * as CANNON from 'cannon';

import {
  addSceneCamera,
  addSceneOrbitalControls,
  addSceneRenderer,
} from '@utility/core/commonFunctions';
import { eachFrame } from '@utility/core/eachFrame';
import { addResizeEvent } from '@utility/core/addResizeEvent';
import { OrbitControls } from 'three/examples/jsm/Addons';


const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png'
])

export class PhysicsScene {
  private scene: THREE.Scene;
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private sizes: ISizes;
  private controls: OrbitControls;
  private gui;
  private world: CANNON.World;
  private sphere: THREE.Mesh;
  private sphereBody: CANNON.Body;
  private floor: THREE.Mesh;
  private floorBody: CANNON.Body;

  constructor(canvas: HTMLCanvasElement, sizes: ISizes) {
    this.canvas = canvas;
    this.sizes = sizes;
    this.scene = new THREE.Scene();
    this.renderer = addSceneRenderer(canvas, sizes);
    this.camera = addSceneCamera(this.scene, sizes);
    this.controls = addSceneOrbitalControls(this.camera, canvas);
    this.gui = new dat.GUI({ width: 400 });
    this.world = new CANNON.World();
  }

  guiManager = () => {
   
  };

  setCameraPos = () => {
    this.camera.position.set(-7, 7, 7)
  };

  addLights = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.camera.left = - 7
    directionalLight.shadow.camera.top = 7
    directionalLight.shadow.camera.right = 7
    directionalLight.shadow.camera.bottom = - 7
    directionalLight.position.set(5, 5, 5)
    this.scene.add(directionalLight);
  }

  setRendererOptions = () => {
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  generateSceneItems = () => {
    this.floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10,10),
        new THREE.MeshStandardMaterial({
          color: '#777777',
          metalness: 0.3,
          roughness: 0.4,
          envMap: environmentMapTexture,
          envMapIntensity: 0.5,
          side: THREE.DoubleSide
      })
    )
    this.floor.receiveShadow = true
    this.floor.rotation.x = - Math.PI * 0.5;
    this.scene.add(this.floor);


    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({
          metalness: 0.6,
          roughness: 0.4,
          envMap: environmentMapTexture,
          envMapIntensity: 0.5
      })
  )
    this.sphere.castShadow = true
    this.sphere.position.y = 0.5
    this.scene.add(this.sphere)
  };

  setPhysics = () => {
    this.world.gravity.set(0, -9.82, 0);
    

    // Material 
    const defaultMaterial = new CANNON.Material('default');

    const defaultMaterialContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial, 
      {
        friction: 0.1,
        restitution: 0.7
      }
    );

    this.world.addContactMaterial(defaultMaterialContactMaterial)
    this.world.defaultContactMaterial = defaultMaterialContactMaterial;

    // Sphere
    const sphereShape = new CANNON.Sphere(0.5)
    this.sphereBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0,3,0),
      shape: sphereShape,
    })
    
    
    this.world.addBody(this.sphereBody)

    const floorShape = new CANNON.Plane();
    this.floorBody = new CANNON.Body({
      mass: 0,
      shape: floorShape
    });

    this.floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1,0,0), 
      Math.PI / 2
    )
    this.world.addBody(this.floorBody)
  }

  start = () => {
    addResizeEvent(this.sizes, this.camera, this.renderer);
    this.addLights();
    this.guiManager();
    this.generateSceneItems();
    this.setCameraPos();
    this.setRendererOptions();
    this.setPhysics();


    this.controls.enableDamping = true

    let oldElapsedTime = 0;
    eachFrame(
      this.scene,
      this.camera,
      this.renderer,
      (elapsedTime: number) => {
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;
        this.world.step(1 / 60, deltaTime,3);
        this.sphere.position.copy(this.sphereBody.position)
      },
      this.controls,
    );
  };
}
