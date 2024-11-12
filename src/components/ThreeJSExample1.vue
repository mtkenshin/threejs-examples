<template>
    <div class="canvas-wrapper">
        <canvas ref="example1"></canvas>
    </div>
</template>
<script lang="ts" setup>
import { type Ref, ref, watch } from 'vue';
import { useExample1Scene } from '../composables/particle.composable';
const example1: Ref<HTMLCanvasElement | null> = ref(null);

onMounted(() => {
    if(example1.value !== null) {
        useExample1Scene(example1.value)
    }
})

</script>