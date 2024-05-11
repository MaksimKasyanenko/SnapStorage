<script setup>
const props = defineProps(["title", "open"]);
</script>

<template>
    <div class="modal-full" :class="{ 'd-none': !props.open }">
        <div>
            <div class="header text-light p-2">{{ props.title }}</div>
            <slot></slot>
        </div>
        <div class="modal-bottom-panel">
            <button class="btn btn-secondary" type="button" @click="$emit('cancel')">Cancel</button>
            <button class="btn btn-primary" @click="$emit('save')">Save</button>
        </div>
    </div>
</template>

<style scoped>
.modal-full {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    box-shadow: 0 0 .4rem #34343456;
    transition: all .3s;
    background-color: #f9f9f9;
}

.modal-full.d-none {
    display: block !important;
    transform: translate(0, -105%);
}

.modal-bottom-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: .3rem;
    display: flex;
    align-items: center;
    justify-content: end;
}
</style>