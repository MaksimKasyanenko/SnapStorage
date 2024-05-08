<template>
<li>
    <div v-on:click="onPresetClick">{{ props.preset.name }}</div>
    <div class="btn-container">
        <button class="p-0 me-1" v-on:click="onEditButtonClick">
            <img class="icon" src="./icons/edit-ui-svgrepo-com.vue">
        </button>
        <button class="p-0" v-on:click="onDeleteButtonClick">
            <img class="icon" src="./icons/delete-svgrepo-com.vue">
        </button>
    </div>
</li>
</template>

<script setup>
const props = defineProps(['preset']);

async function onPresetClick() {
    if (preset.clearStorage) {
        //sendToContentScript("clear-storage", { storageType: presets[i].storageType });
    }
                
    //sendToContentScript("set-to-storage", { items: presets[i].items, storageType: presets[i].storageType });
    window.globalEventEmitter.emit('notify', `"${preset.name}" applied`);
}

function onEditButtonClick() {
    //FillPresetEditor('Edit preset', presets[i]);
    //document.getElementById('presetEditorModal').classList.remove('d-none');
}

async function onDeleteButtonClick() {
    if(!confirm('Are you sure you want to permanently delete this preset?')) return;
    //let psets = (await browser.storage.local.get("presets")).presets;
    //psets.splice(i, 1);
    //await browser.storage.local.set({ presets: psets });
    //drawPresetList();
}
</script>

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