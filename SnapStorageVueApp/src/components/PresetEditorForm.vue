<script setup>
const props = defineProps(['presetData']);

if (!props.presetData) {
    props.presetData = {
        id: '',
        name: '',
        items: [{
            key: '',
            val: ''
        }],
        clearStorage: false,
        storageType: "local"
    };
}
</script>

<template>
    <form name='createPresetForm' class="scroller p-2">
        <input type="hidden" id="presetId" value="" />
        <input type="text" class="text-bold mb-2" name="presetName" placeholder="Enter name" data-id="" value=""
            id="presetNameInput" />

        <div class="hstack mb-4">
            <select class="me-2" id="storageTypeInput" name="storageType">
                <option value="local">LocalStorage</option>
                <option value="session">SessionStorage</option>
                <option value="cookie">Cookie</option>
            </select>
            <label style="min-width: 8rem">
                <input type="checkbox" name='clearStorage' id="clearStorageInput" />
                <small>Clear storage</small>
            </label>
        </div>

        <div class="position-relative">
            <button class="btn btn-primary btn-small position-absolute right-top" type="button" name="addItemBtn">
                <small class="text-light">Add item</small>
            </button>

            <table name="presetItemTable">
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div style='height: 4rem'></div>
    </form>
</template>

<style scoped>

</style>