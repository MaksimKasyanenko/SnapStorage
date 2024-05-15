<script setup>
import TopPanel from './components/TopPanel.vue';
import Notification from './components/Notification.vue';
import EventEmitter from './components/EventEmitter.vue';
import Scroller from './components/Scroller.vue';
import PresetList from './components/PresetList.vue';
import PresetEditorForm from './components/PresetEditorForm.vue';
import { PresetRepository } from './PresetStorages.js';
import { ref } from 'vue';

const presetStorage = new PresetRepository();
const presets = ref([]);
const presetFormBoof = ref({});
const modalShown = ref(false);

presetStorage.loadPresets().then(res => presets.value = res);

function openPresetEditor(presetId) {
  if (presetId) {
    presetFormBoof.value = presets.value.find(p => p.id == presetId);
  } else {
    presetFormBoof.value = {
      id: '',
      name: '',
      items: [{
        key: '',
        val: ''
      }],
      clearStorage: false,
      storageType: "local"
    };
  }

  modalShown.value = true;
}

function savePreset() {
  presetStorage.savePreset(presetFormBoof.value)
    .then(() => {
      presetFormBoof.value = {};
      modalShown.value = false;
      presetStorage.loadPresets().then(res => presets.value = res);
    });
}

function deletePreset(presetId) {
  presetStorage.delete(presetId).then(() => {
    presetStorage.loadPresets().then(res => presets.value = res);
  });
}

function applyPreset(id) {
  if (props.preset.clearStorage) {
        //sendToContentScript("clear-storage", { storageType: presets[i].storageType });
    }
                
    //sendToContentScript("set-to-storage", { items: presets[i].items, storageType: presets[i].storageType });
    window.globalEventEmitter.emit('notify', `"${props.preset.name}" applied`);
}

function clearStorage(storageType) {
  let message = "";

  switch (storageType) {
    case "local": message = "The LocalStorage has been cleared."; break;
    case "session": message = "The SessionStorage has been cleared."; break;
    case "cookie": message = "The Cookie has been cleared."; break;
    default: throw new Error("Unknown storage type.");
  }
  //sendToContentScript("clear-storage", { storageType: storageType });
  window.globalEventEmitter.emit('notify', message);
}
</script>

<template>
  <EventEmitter />

  <TopPanel @new-preset="() => openPresetEditor()" @clear="clearStorage" />

  <Scroller>
    <PresetList :presets="presets" @delete="deletePreset" @edit="id => openPresetEditor(id)" @apply="applyPreset">
      <template v-slot:placeholder>
        <div class="empty-presets-message">
          <p>You don't have any preset created yet.</p>
          <div class="text-center">
            <button class="btn btn-primary" @click="() => openPresetEditor()">Create Preset</button>
          </div>
        </div>
      </template>
    </PresetList>
  </Scroller>

  <PresetEditorForm v-model:preset-data="presetFormBoof" v-model:open="modalShown" @save="savePreset()" />

  <Notification />
</template>

<style scoped>
.empty-presets-message p {
  color: #727272;
  font-size: .8rem;
  margin-top: .8rem;
  margin-bottom: .4rem;
  font-style: italic;
  text-align: center;
}
</style>
