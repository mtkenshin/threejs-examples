import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Timer } from 'three/addons/misc/Timer.js'
import type { OrbitControls } from 'three/examples/jsm/Addons.js';

const timer = new Timer();

export const eachFrame = (scene: Scene, camera:PerspectiveCamera, renderer: WebGLRenderer, callback: Function, controls?: OrbitControls) => {
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed();
    callback(elapsedTime)

    // Update controls
    controls?.update()
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(() => eachFrame(scene, camera, renderer, callback, controls))
}