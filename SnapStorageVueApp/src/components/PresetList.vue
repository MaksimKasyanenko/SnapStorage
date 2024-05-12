<template>
    <ul class="preset-list" v-if="props.presets && props.presets.length > 0">
        <PresetListItem v-for="preset in props.presets" :preset="preset" :key="preset.id" />
    </ul>
    <div v-else>
        <slot name="placeholder"></slot>
    </div>
</template>

<script setup>
import PresetListItem from './PresetListItem.vue';
import { defineProps } from 'vue';

const props = defineProps(["presets"]);

function newPreset() {
    //FillPresetEditor('Create preset');
    //document.getElementById('presetEditorModal').classList.remove('d-none');
}
</script>

<style scoped>
ul.preset-list {
    list-style: none;
    padding: 1rem .4rem 3.2rem .4rem;
}
</style>