<template>
    <ul class="preset-list" v-if="props.presets && props.presets.length > 0">
        <PresetListItem v-for="preset in props.presets" :preset="preset" :key="preset.id" />
    </ul>
    <div v-else class="empty-presets-message">
        <p>You don't have any preset created yet.</p>
        <div class="text-center">
            <button class="btn btn-primary" v-on:click="newPreset">Create Preset</button>
        </div>
    </div>
</template>

<script setup>
    import PresetListItem from './PresetListItem.vue';

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

.empty-presets-message p {
    color: #727272;
    font-size: .8rem;
    margin-top: .8rem;
    margin-bottom: .4rem;
    font-style: italic;
    text-align: center;
}
</style>