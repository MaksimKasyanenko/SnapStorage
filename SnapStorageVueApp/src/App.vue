<script setup>
import TopPanel from './components/TopPanel.vue';
import Notification from './components/Notification.vue';
import EventEmitter from './components/EventEmitter.vue';
import Scroller from './components/Scroller.vue';
import TopModal from './components/TopModal.vue';
import PresetList from './components/PresetList.vue';
import PresetEditorForm from './components/PresetEditorForm.vue';
import { PresetRepository } from './PresetStorages.js';
import { ref } from 'vue';

const modalShown = ref(false);
const modalTitle = ref("");
const presetStorage = new PresetRepository();

const presets = ref([]);
presetStorage.loadPresets().then(res => presets.value = res);

function openModal(title) {
  modalTitle.value = title;
  modalShown.value = true;
}
</script>

<template>
  <EventEmitter />

  <TopPanel @new-preset="() => openModal('New Preset')" />
  <Scroller>
    <PresetList :presets="presets">
      <template v-slot:placeholder>
        <div class="empty-presets-message">
          <p>You don't have any preset created yet.</p>
          <div class="text-center">
            <button class="btn btn-primary" @click="() => openModal('New Preset')">Create Preset</button>
          </div>
        </div>
      </template>
    </PresetList>
  </Scroller>

  <TopModal :title="modalTitle" :open="modalShown" v-on:cancel="modalShown = false">
    <PresetEditorForm />
  </TopModal>

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
