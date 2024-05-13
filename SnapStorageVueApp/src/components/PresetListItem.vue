<script setup>
import EditIcon from './icons/EditIcon.vue';
import DeleteIcon from './icons/DeleteIcon.vue';

const props = defineProps(['preset']);
const emit = defineEmits(['edit', 'delete']);

async function onPresetClick() {
    if (props.preset.clearStorage) {
        //sendToContentScript("clear-storage", { storageType: presets[i].storageType });
    }
                
    //sendToContentScript("set-to-storage", { items: presets[i].items, storageType: presets[i].storageType });
    window.globalEventEmitter.emit('notify', `"${props.preset.name}" applied`);
}

function onEditButtonClick() {
    emit('edit', props.preset.id);
}

async function onDeleteButtonClick() {
    if(!confirm('Are you sure you want to permanently delete this preset?')) 
        return;

    emit('delete', props.preset.id);
}
</script>

<template>
<li>
    <div class="preset-name-text" v-on:click="onPresetClick">{{ props.preset.name }}</div>
    <div class="btn-container">
        <button class="p-0 me-1" v-on:click="onEditButtonClick">
            <EditIcon />
        </button>
        <button class="p-0" v-on:click="onDeleteButtonClick">
            <DeleteIcon />
        </button>
    </div>
</li>
</template>

<style scoped>
li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    box-shadow: 0px 1px 2px #30303023;
    border-radius: .4rem;
    font-size: .8rem;
    text-transform: capitalize;
    padding: .8rem 1.2rem;
    margin-bottom: .4rem;
    transition: all .4s;
}

li:hover {
    box-shadow: 0px 2px 4px #30303066;
}

.preset-name-text {
    width: 100%;
    cursor: pointer;
}

.btn-container {
    width: 4.4rem;
    text-align: right;
}

li button {
    background: none;
    border: none;
}
</style>