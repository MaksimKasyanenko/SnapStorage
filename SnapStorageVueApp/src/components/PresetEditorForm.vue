<script setup>
import { ref } from 'vue';
import DeleteIcon from './icons/DeleteIcon.vue';

const preset = defineModel("presetData");
const isOpen = defineModel("open");

const modalTitle = preset.value.id ? "Edit Preset" : "New Preset";
</script>

<template>
    <div class="modal-full" :class="{ 'd-none': !isOpen }">
        <div>
            <div class="header text-light p-2">{{ modalTitle }}</div>

            <form v-if="isOpen" class="scroller p-2">
                <input type="hidden" :value="preset.id" />
                <input type="text" class="text-bold mb-2" placeholder="Enter name" v-model="preset.name" />

                <div class="hstack mb-4">
                    <select class="me-2" v-model="preset.storageType">
                        <option value="local">LocalStorage</option>
                        <option value="session">SessionStorage</option>
                        <option value="cookie">Cookie</option>
                    </select>
                    <label style="min-width: 8rem">
                        <input type="checkbox" v-model="preset.clearStorage" />
                        <small>Clear storage</small>
                    </label>
                </div>

                <div class="position-relative">
                    <button class="btn btn-primary btn-small position-absolute right-top" type="button">
                        <small class="text-light">Add item</small>
                    </button>

                    <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in preset.items">
                                <td>
                                    <input type="text" placeholder="key" :value="item.key" />
                                </td>
                                <td>
                                    <input type="text" placeholder="value" :value="item.val" />
                                </td>
                                <td>
                                    <button type="button" class="btn">
                                        <DeleteIcon />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style='height: 4rem'></div>
            </form>

        </div>
        <div class="modal-bottom-panel">
            <button class="btn btn-secondary" type="button" @click="isOpen = false">Cancel</button>
            <button class="btn btn-primary" @click="$emit('save')">Save</button>
        </div>
    </div>
</template>

<style scoped>
.modal-full {
    position: absolute;
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