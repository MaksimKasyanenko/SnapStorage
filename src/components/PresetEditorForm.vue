<script setup>
import DeleteIcon from './icons/DeleteIcon.vue';
import { ref } from 'vue';
import { ContentScript } from '../ContentScript.js';

const preset = defineModel("presetData");
const isOpen = defineModel("open");
const emit = defineEmits(['save', 'close']);
const hasInvalid = ref(false);

const modalTitle = preset.value.id ? "Edit Preset" : "New Preset";

function addItem() {
    preset.value.items.push({ key: "", val: "" });
}

async function fillFromStorage() {
    const data = await new ContentScript().getDataFromStorage(preset.value.storageType);
    let newItems = preset.value.items.filter(i => !data.some(d => d.key === i.key));
    newItems = [...newItems, ...data];

    preset.value.items = newItems;
}

function deleteItem(index) {
    preset.value.items = preset.value.items.filter((item, i) => i != index)
}

function validateAndSave() {
    if (preset.value.name && preset.value.items.every(i => !!i.key))
        emit('save');
    else
        hasInvalid.value = true;
}

function closeModal() {
    hasInvalid.value = false;
    emit('close');
}
</script>

<template>
    <div class="modal-full" :class="{ 'd-none': !isOpen }">
        <div>
            <div class="header text-light p-2">{{ modalTitle }}</div>

            <form v-if="isOpen" class="scroller p-2" @change="hasInvalid = false">
                <input type="hidden" :value="preset.id" />
                <input type="text" class="text-bold mb-2" :class="{ 'not-valid': hasInvalid && !preset.name }"
                    placeholder="Enter name" v-model="preset.name" />

                <div class="hstack mb-5">
                    <select class="me-3" v-model="preset.storageType">
                        <option value="local">LocalStorage</option>
                        <option value="session">SessionStorage</option>
                        <option value="cookie">Cookie</option>
                    </select>
                    <label style="min-width: 8rem">
                        <input class="me-1" type="checkbox" v-model="preset.clearStorage" />
                        <small>Clear storage</small>
                    </label>
                </div>

                <div class="position-relative">
                    <div class="position-absolute right-top">
                        <button class="btn btn-secondary btn-small" type="button" @click="fillFromStorage()">
                            <small>Fill from storage</small>
                        </button>
                        <button class="btn btn-primary btn-small" type="button" @click="addItem()">
                            <small class="text-light">Add item</small>
                        </button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in preset.items">
                                <td>
                                    <input type="text" placeholder="key" v-model="item.key"
                                        :class="{ 'not-valid': hasInvalid && !item.key }" />
                                </td>
                                <td>
                                    <input type="text" placeholder="value" v-model="item.val" />
                                </td>
                                <td>
                                    <button type="button" class="btn" @click="deleteItem(index)">
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
            <button class="btn btn-secondary" type="button" @click="closeModal()">Cancel</button>
            <button class="btn btn-primary" @click="validateAndSave()">Save</button>
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