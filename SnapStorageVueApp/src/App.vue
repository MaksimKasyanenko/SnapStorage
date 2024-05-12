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

const presetFormData = ref({});

function openPresetEditor(preset) {
  if(preset) {
    presetFormData.value = preset;
  } else {
    presetFormData.value = {
        id: '',
        name: 'test test',
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

  <PresetEditorForm   v-model:preset-data="presetFormData"
                      v-model:open="modalShown" />

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
