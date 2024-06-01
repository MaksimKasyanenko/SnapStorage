<script setup>
import CloseIcon from './icons/CloseIcon.vue';

const item = defineModel("presetItem");
</script>

<template>
<div class="cover">
    <div class="modal-center shadow p-2">
        <div class="text-end mb-1">
            <button class="btn p-0" type="button" @click="$emit('close')"><CloseIcon /></button>
        </div>
        <input type="text" class="mb-2" placeholder="key" v-model="item.key">
        <textarea placeholder="value" rows="10" v-model="item.val"></textarea>
    </div>
</div>
</template>

<style scoped>
.cover {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background-color: rgba(153, 153, 153, 0.5);
}

.modal-center {
    width: 80%;
    min-height: 4rem;
    background-color: var(--kms-light-color);
    border-radius: 4px;
    margin: 4rem auto;
}

textarea {
    resize: none;
    font-size: .8rem;
    border-radius: 1rem !important;
}
</style>