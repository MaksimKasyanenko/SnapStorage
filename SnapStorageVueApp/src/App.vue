<script setup>
import TopPanel from './components/TopPanel.vue';
import Notification from './components/Notification.vue';
import EventEmitter from './components/EventEmitter.vue';
import Scroller from './components/Scroller.vue';
import TopModal from './components/TopModal.vue';
import PresetList from './components/PresetList.vue';
//import PresetEditorForm from './components/PresetEditorForm.vue';
import { PresetStorage } from './PresetStorages.js';
import { ref } from 'vue';

const modalShown = ref(false);
const modalTitle = ref("");
const presetStorage = new PresetStorage();

function openModal(title) {
  modalTitle.value = title;
  modalShown.value = true;
}
</script>

<template>
  <EventEmitter />

  <TopPanel @new-preset="() => openModal('New Preset')" />
  <Scroller>
    <PresetList :preset-storage="presetStorage" />
  </Scroller>

  <TopModal :title="modalTitle" :open="modalShown" v-on:cancel="modalShown=false">
    test
  </TopModal>
  <Notification />
</template>

<style scoped></style>
