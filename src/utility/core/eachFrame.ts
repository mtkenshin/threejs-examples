import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Timer } from 'three/addons/misc/Timer.js'
import type { OrbitControls } from 'three/examples/jsm/Addons.js';

const timer = new Timer();

/**
 * 
 * @param scene Requires a Three JS Scene
 * @param camera Requires a Three JS Perspective Camera
 * @param renderer Requires a WebGLRenderer
 * @param callback Callback after each frame
 * @param controls Orbital Controls
 * 
 * Use this function if you want to run this on every frame. Used for updating and rendering.
 */
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