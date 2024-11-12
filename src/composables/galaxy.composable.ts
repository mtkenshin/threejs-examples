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

export class GalaxyGenerator {
    private scene;
    private canvas;
    private renderer;
    private camera;
    private sizes: ISizes;
    private controls;
    private gui;

    constructor(canvas: HTMLCanvasElement, sizes: ISizes) {
        this.canvas = canvas;
        this.sizes = sizes;
        this.scene = new THREE.Scene();
        this.renderer = addSceneRenderer(canvas, sizes);
        this.camera = addSceneCamera(this.scene, sizes);
        this.controls = addSceneOrbitalControls(this.camera, canvas);
        this.gui = new dat.GUI();
    }


    addObjects = () => {
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshStandardMaterial({color: 'white'})
        )
        this.scene.add(cube);
    }

    start = () => {
        addResizeEvent(this.sizes,this.camera, this.renderer);
        addSceneLighting(this.scene);


        this.addObjects();

        eachFrame(this.scene, this.camera, this.renderer, (elapsedTime: number) => {

        }, this.controls)
    }
}