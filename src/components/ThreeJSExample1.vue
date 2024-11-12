<template>
    <div class="canvas-wrapper">
        <canvas ref="example1"></canvas>
    </div>
</template>
<script lang="ts" setup>
import { type Ref, ref } from 'vue';

import { useParticleScene } from '@composables/particle.composable';
import { GalaxyGenerator } from '@composables/galaxy.composable';

const example1: Ref<HTMLCanvasElement | null> = ref(null);

onMounted(() => {
    if(example1.value !== null) {
        //useParticleScene(example1.value)
        const threeJSScene = new GalaxyGenerator(example1.value, {width: window.innerWidth, height: window.innerHeight});
        console.log(threeJSScene)
        threeJSScene.start();
    }
})

</script>