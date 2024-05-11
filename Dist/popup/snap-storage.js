
async function start() {
    try {
        await browser.tabs.executeScript({ file: "/content_scripts/main.js" });
        window.contentScriptInjected = true;
    }
    catch {
        window.contentScriptInjected = false;
    }
    await addListeners();
}


async function sendToContentScript(command, data) {
    if(!window.contentScriptInjected) {
        alert("This web page's policies forbid this action :(");
        return;
    }

    let tabs = await browser.tabs.query({ active: true, currentWindow: true });
    browser.tabs.sendMessage(tabs[0].id, { command: command, ...data });
}

function FillPresetEditor(title, presetData) {
    document.getElementById('presetEditorHeader').textContent = title;
    document.getElementById('presetNameInput').value = presetData.name;
    document.getElementById('presetId').value = presetData.id;
    document.getElementById('storageTypeInput').value = presetData.storageType;
    document.getElementById('clearStorageInput').checked = presetData.clearStorage;

    const editorContent = document.getElementById('presetEditorContent');
    let tbody = editorContent.querySelector('tbody');

    while (tbody.firstChild) {
        tbody.removeChild(tbody.lastChild);
    }

    for (let item of (presetData.items || [])) {
        let itemTr = createNewPresetItem(item.key, item.val);
        tbody.appendChild(itemTr);
    }

    editorContent.querySelector('[name="addItemBtn"]').onclick = function () {
        let newItem = createNewPresetItem();
        tbody.appendChild(newItem);
    };

    let form = editorContent.querySelector('[name="createPresetForm"]');

    form.onchange = function () {
        [].forEach.call(form.querySelectorAll('input'), function (inpt) {
            if (inpt.value)
                inpt.classList.remove('bg-danger');
        });
    };

    document.getElementById('savePresetBtn').onclick = async function () {
        let preset = presetFromForm(form);

        if (preset) {
            await savePreset(preset);
            await drawPresetList();
            document.getElementById('presetEditorModal').classList.add('d-none');
        }
    };
}

function createNewPresetItem(key, val) {
    let tr = document.createElement('tr');
    tr.appendChild(TableInput('key', key));
    tr.appendChild(TableInput('value', val));

    let thirdTD = document.createElement('td');
    let delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.classList.add('btn');
    const delImg = document.createElement('img');
    delImg.classList.add('icon');
    delImg.src = '/icons/delete-svgrepo-com.svg';
    delBtn.appendChild(delImg);
    delBtn.addEventListener('click', function () {
        if (tr.parentElement.children.length > 1)
            tr.remove();
    });
    thirdTD.appendChild(delBtn);
    tr.appendChild(thirdTD);

    return tr;
}

function TableInput(placeholderText, value) {
    const inpt = document.createElement('input');
    inpt.type = 'text';
    inpt.placeholder = placeholderText;
    inpt.value = value || '';

    const td = document.createElement('td');
    td.appendChild(inpt);

    return td;
}

function presetFromForm(form) {
    let validation = true;

    let presetNameInpt = form.querySelector('[name="presetName"]');
    let presetName = presetNameInpt.value;
    let presetId = document.getElementById('presetId').value;

    if (!presetName) {
        validation = false;
        presetNameInpt.classList.add('bg-danger');
    }

    let presetItems = [];

    for (let itemTr of form.querySelectorAll('tbody tr')) {
        let keyInpt = itemTr.getElementsByTagName('input')[0];
        let valInpt = itemTr.getElementsByTagName('input')[1];

        let item = {
            key: keyInpt.value,
            val: valInpt.value
        };

        if (!item.key) {
            keyInpt.classList.add('bg-danger');
            validation = false;
        }

        if (!item.val) {
            valInpt.classList.add('bg-danger');
            validation = false;
        }

        presetItems.push(item);
    }

    const clearStorage = form.querySelector('[name="clearStorage"]').checked;
    const storageType = form.querySelector('[name="storageType"]').value;

    if (validation)
        return {
            id: presetId,
            name: presetName,
            items: presetItems,
            clearStorage,
            storageType
        };

    return null;
}

async function savePreset(preset) {
    let presets = (await browser.storage.local.get("presets")).presets;

    if (!presets)
        presets = [];

    if (preset.id) {
        let oldPreset = presets.find(p => p.id == preset.id);
        if (oldPreset) {
            oldPreset.name = preset.name;
            oldPreset.items = preset.items;
            oldPreset.clearStorage = preset.clearStorage;
        } else {
            throw new Error(`Preset [${preset.id}] not found.`);
        }
    } else {
        preset.id = Math.random();
        presets.push(preset);
    }

    await browser.storage.local.set({ presets });
}