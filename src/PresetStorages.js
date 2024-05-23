export class PresetRepository {
    async loadPresets() {
        const saved = (await browser.storage.local.get("presets")).presets

        if(saved && typeof saved === "object") {
            saved = JSON.stringify(saved);
        }

        return saved ? JSON.parse(saved) : [];
    }

    async savePreset(preset) {
        let presets = await this.loadPresets();
    
        if (preset.id) {
            let oldPreset = presets.find(p => p.id == preset.id);
            if (oldPreset) {
                oldPreset.name = preset.name;
                oldPreset.items = preset.items;
                oldPreset.clearStorage = preset.clearStorage;
                oldPreset.storageType = preset.storageType;
            } else {
                throw new Error(`Preset [${preset.id}] not found.`);
            }
        } else {
            preset.id = Math.random();
            presets.push(preset);
        }

        await this.__savePresets(presets)
    }

    async __savePresets(presetArray) {
        await browser.storage.local.set({ presets: JSON.stringify(presetArray) });
    }

    async delete(presetId) {
        let presets = await this.loadPresets();
        presets = presets.filter(p => p.id != presetId);
        await this.__savePresets(presets);
    }
}

export class TestPresetRepository {
    async loadPresets() {
        this.presets = this.presets ? [...this.presets] : [];
        return this.presets;
    }

    async savePreset(preset) {
        let presets = await this.loadPresets();
    
        if (!presets)
            presets = [];
    
        if (preset.id) {
            let oldPreset = presets.find(p => p.id == preset.id);
            if (oldPreset) {
                oldPreset.name = preset.name;
                oldPreset.items = preset.items;
                oldPreset.clearStorage = preset.clearStorage;
                oldPreset.storageType = preset.storageType;
            } else {
                throw new Error(`Preset [${preset.id}] not found.`);
            }
        } else {
            preset.id = Math.random();
            presets.push(preset);
        }

        this.presets = presets;
    }

    async delete(presetId) {
        let presets = await this.loadPresets();
        presets = presets.filter(p => p.id != presetId);
        this.presets = presets;
    }
}

export function createPresetStorage(test) {
    if(test)
        return new TestPresetRepository();
    else
        return new PresetRepository();
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