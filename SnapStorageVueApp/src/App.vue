<script setup>
import TopPanel from './components/TopPanel.vue';
import Notification from './components/Notification.vue';
import EventEmitter from './components/EventEmitter.vue';
import Scroller from './components/Scroller.vue';

</script>

<template>
  <EventEmitter />

  <TopPanel />
  <Scroller>
    <ul class="preset-list" id="presetList"></ul>
  </Scroller>

  <Notification />
</template>

<style scoped></style>
