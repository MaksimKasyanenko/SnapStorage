<script setup>
import TopPanel from './components/TopPanel.vue';
import Notification from './components/Notification.vue';
import EventEmitter from './components/EventEmitter.vue';
import Scroller from './components/Scroller.vue';
import PresetList from './components/PresetList.vue';

let presets = (await browser.storage.local.get("presets")).presets;
</script>

<template>
  <EventEmitter />

  <TopPanel />
  <Scroller>
    <PresetList presets="presets" />
  </Scroller>

  <Notification />
</template>

<style scoped></style>
