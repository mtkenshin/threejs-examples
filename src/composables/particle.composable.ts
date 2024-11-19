import * as THREE from 'three'
import { addResizeEvent } from '@utility/core/addResizeEvent';
import { eachFrame } from '@utility/core/eachFrame';
import { addSceneCamera, addSceneLighting, addSceneOrbitalControls, addSceneRenderer } from '@utility/core/commonFunctions';

const textureLoader = new THREE.TextureLoader();

const loadParticleTextures = (particleFileName: string) => {
    return textureLoader.load(`/textures/particles/${particleFileName}`);
}

const addSceneObjects = (scene: THREE.Scene) => {
    //addParticles1(scene);
    const particles = addParticles2(scene);
    return { particles };
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
    const count = 20000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
        colors[i] = Math.random();
    } 
    particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color',new THREE.BufferAttribute(colors, 3))

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        alphaMap: loadParticleTextures('2.png'),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    const particles = new THREE.Points(
        particlesGeometry,
        particlesMaterial
    )
    scene.add(particles)
    return particles;
}

export const useParticleScene = (canvas: HTMLCanvasElement) => {
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    const scene = new THREE.Scene();

    // Add Camera
    const camera = addSceneCamera(scene, sizes);
    const renderer = addSceneRenderer(canvas, sizes);
    const controls = addSceneOrbitalControls(camera, canvas);
    
    
    addSceneLighting(scene);
    const { particles } = addSceneObjects(scene);

    eachFrame(scene, camera, renderer, (elapsedTime: number) => {
        // Update particles
        const animationSpeed = 0.2;
        const count = particles.geometry.attributes.position.array.length / 3;

        for(let i = 0; i < count; i++) {
            const x = i * 3
            const y = x + 1;
            const z = x + 2;
            const xPos = particles.geometry.attributes.position.array[x];
            particles.geometry.attributes.position.array[y] = Math.sin(elapsedTime + xPos);
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }, controls)

    // Events
    addResizeEvent(sizes, camera, renderer);
}

