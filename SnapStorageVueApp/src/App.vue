<script setup>
import TopPanel from './components/TopPanel.vue';
import Notification from './components/Notification.vue';
import EventEmitter from './components/EventEmitter.vue';
import Scroller from './components/Scroller.vue';
import PresetList from './components/PresetList.vue';
import PresetEditorForm from './components/PresetEditorForm.vue';
import { PresetRepository } from './PresetStorages.js';
import { ref } from 'vue';

const modalShown = ref(false);
const presetStorage = new PresetRepository();

const presets = ref([]);
presetStorage.loadPresets().then(res => presets.value = res);

const presetFormBoof = ref({});

function openPresetEditor(presetId) {
  if(presetId) {
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
</script>

<template>
  <EventEmitter />

  <TopPanel @new-preset="() => openPresetEditor()" />

  <Scroller>
    <PresetList :presets="presets">
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

  <PresetEditorForm   v-model:preset-data="presetFormBoof"
                      v-model:open="modalShown"
                      @save="savePreset()" />

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
