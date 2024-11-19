<template>
    <div class="canvas-wrapper">
        <canvas ref="example1"></canvas>
    </div>
</template>
<script lang="ts" setup>
import { type Ref, ref } from 'vue';
import { GalaxyGenerator } from '@composables/galaxy.composable';

const example1: Ref<HTMLCanvasElement | null> = ref(null);

onMounted(() => {
    if(example1.value !== null && window) {
        const threeJSScene = new GalaxyGenerator(example1.value, {width: window.innerWidth, height: window.innerHeight});
        threeJSScene.start();
    }
});
</script>