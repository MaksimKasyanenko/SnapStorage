<script setup>
import PresetListItem from './PresetListItem.vue';
import { defineProps } from 'vue';

const props = defineProps(["presets"]);
</script>

<template>
    <ul class="preset-list" v-if="props.presets && props.presets.length > 0">
        <PresetListItem v-for="preset in props.presets" 
                        :preset="preset" 
                        :key="preset.id" 
                        @delete="id => $emit('delete', id)"
                        @edit="id => $emit('edit', id)"
                        @apply="id => $emit('apply', id)" />
    </ul>
    <div v-else>
        <slot name="placeholder"></slot>
    </div>
</template>

<style scoped>
ul.preset-list {
    list-style: none;
    padding: 1rem .4rem 3.2rem .4rem;
}
</style>