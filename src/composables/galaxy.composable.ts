import * as THREE from 'three'
import * as dat from 'dat-gui'
import type { ISizes } from '@interfaces/sizes.interfaces';
import { addSceneCamera, addSceneOrbitalControls, addSceneRenderer, addSceneLighting } from '@utility/core/commonFunctions';
import { eachFrame } from '@utility/core/eachFrame';
import { addResizeEvent } from '@utility/core/addResizeEvent';

const textureLoader = new THREE.TextureLoader();

const loadParticleTextures = (particleFileName: string) => {
    return textureLoader.load(`/textures/particles/${particleFileName}`);
}

interface IParameters {
    count: number;
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

    constructor(canvas: HTMLCanvasElement, sizes: ISizes) {
        this.canvas = canvas;
        this.sizes = sizes;
        this.scene = new THREE.Scene();
        this.renderer = addSceneRenderer(canvas, sizes);
        this.camera = addSceneCamera(this.scene, sizes);
        this.controls = addSceneOrbitalControls(this.camera, canvas);
        this.gui = new dat.GUI();
        this.parameters = {
            count: 1000
        }
    }


    generateGalaxy = () => {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(this.parameters.count * 3)
        
        for(let i = 0; i< this.parameters.count; i++) {
            const x = i * 3;
            const y = x + 1;
            const z = y + 1;

            positions[x] = Math.random();
            positions[y] = Math.random();
            positions[z] = Math.random();
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        )


    }

    start = () => {
        addResizeEvent(this.sizes,this.camera, this.renderer);
        addSceneLighting(this.scene);
        
        this.generateGalaxy();
        
        eachFrame(this.scene, this.camera, this.renderer, (elapsedTime: number) => {

        }, this.controls)
    }
}