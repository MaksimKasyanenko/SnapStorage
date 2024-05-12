export class PresetRepository {
    async loadPresets() {
        //let presets = (await browser.storage.local.get("presets")).presets;
        this.presets = [];
        return presets;
    }
}

/*
{
    id: Math.random().toString(),
    name: 'test preset '+i,
    items: [{
            key: 'test key '+(i+1),
            val: 'test val '+(i+1)
    },],
    clearStorage: false,
    storageType: "local"
}
*/