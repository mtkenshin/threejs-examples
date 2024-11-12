import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import GUI from 'lil-gui'
import { resizeEvent } from '../utility/resizeEvent';
import { eachFrame } from '../utility/eachFrame';
import type { ISizes } from 'src/interfaces/sizes.interfaces';

const textureLoader = new THREE.TextureLoader();

const loadParticleTextures = (particleFileName: string) => {
    return textureLoader.load(`/textures/particles/${particleFileName}`);
}

const addSceneLighting = (scene: THREE.Scene) => {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
    scene.add(ambientLight)

    // Directional light
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
    directionalLight.position.set(3, 2, -8)
    scene.add(directionalLight)

    return { ambientLight, directionalLight }
}

const addSceneCamera = (scene:THREE.Scene, sizes: ISizes) => {
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 4
    camera.position.y = 2
    camera.position.z = 5
    scene.add(camera)
    return camera;
}

const addSceneOrbitalControls = (camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) => {
    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    return controls
}

const addSceneRenderer = (canvas: HTMLCanvasElement, sizes: ISizes) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    return renderer
}
const addSceneObjects = (scene: THREE.Scene) => {
    //addParticles1(scene);
    addParticles2(scene);


}
const addParticles1 = (scene: THREE.Scene) => {
    const particles = new THREE.Points(
        new THREE.SphereGeometry(1,32,32), 
        new THREE.PointsMaterial({
            size: 0.02,
            sizeAttenuation: true
        })
    )
    scene.add(particles)
}
const addParticles2 = (scene: THREE.Scene) => {
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i< count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    } 
    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )

    const particlesMaterial = new THREE.PointsMaterial()
    particlesMaterial.size = 0.1;
    particlesMaterial.sizeAttenuation = true;
    particlesMaterial.alphaMap = loadParticleTextures('2.png');
    // particlesMaterial.alphaTest = 0.001; //dont render black part of texture
    particlesMaterial.transparent = true; // When using alpha add transparent
    // particlesMaterial.depthTest = false;
    particlesMaterial.depthWrite = false

    const particles = new THREE.Points(
        particlesGeometry,
        particlesMaterial
    )
    scene.add(particles)
}

export const useExample1Scene = (canvas: HTMLCanvasElement) => {
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    const gui = new GUI();
    const scene = new THREE.Scene();

    // Add Camera
    const camera = addSceneCamera(scene, sizes);
    const renderer = addSceneRenderer(canvas, sizes);
    const controls = addSceneOrbitalControls(camera, canvas);
    
    
    addSceneLighting(scene);
    addSceneObjects(scene);

    eachFrame(scene,camera,renderer,(el: number) => {
        //console.log(el)
    }, controls)

    // Events
    resizeEvent(sizes, camera, renderer);
}

