import type { ISizes } from "@interfaces/sizes.interfaces"
import type { PerspectiveCamera, WebGLRenderer } from "three"

export const addResizeEvent = (sizes: ISizes, camera: PerspectiveCamera, renderer: WebGLRenderer) => {
    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
}