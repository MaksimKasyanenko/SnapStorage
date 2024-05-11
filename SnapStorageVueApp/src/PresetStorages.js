export class PresetStorage {
    async loadPresets() {
        //let presets = (await browser.storage.local.get("presets")).presets;

        const presets = [];

        for(let i=0; i<30; i++) {
            presets.push({
                id: Math.random().toString(),
                name: 'test preset '+i,
                items: [{
                    key: 'test key '+(i+1),
                    val: 'test val '+(i+1)
                },{
                    key: 'test key '+(i+2),
                    val: 'test val '+(i+2)
                }],
                clearStorage: false,
                storageType: "local"
            });
        }

        return presets;
    }
}