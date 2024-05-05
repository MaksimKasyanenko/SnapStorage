<script setup>
import TopPanel from './components/TopPanel.vue';
import Notification from './components/Notification.vue';

let notifMessage = null;
</script>

<template>
  <TopPanel v-on:notify="m => notifMessage = m" />

  <Notification v-if="notifMessage" message="notifMessage" />
</template>

<style scoped></style>
