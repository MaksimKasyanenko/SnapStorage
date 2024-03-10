start();

async function start() {
    await addListeners();
    await browser.tabs.executeScript({ file: "/content_scripts/main.js" });
    await drawPresetList();
}

async function addListeners() {
    document.getElementById('clearLocalStorageBtn')
        .addEventListener("click", () => sendToContentScript("clear-storage", { storageType: "local" }));
    document.getElementById('clearSessionStorageBtn')
        .addEventListener("click", () => sendToContentScript("clear-storage", { storageType: "session" }));
    document.getElementById('clearCookieBtn')
        .addEventListener("click", () => sendToContentScript("clear-storage", { storageType: "cookie" }));
    document.getElementById('createPresetBtn').addEventListener('click', () => openPresetEditor('Create preset'));
    document.getElementById('closePresetEditorBtn').addEventListener('click', () => closePresetEditor());
}

async function sendToContentScript(command, data) {
    let tabs = await browser.tabs.query({ active: true, currentWindow: true });
    browser.tabs.sendMessage(tabs[0].id, { command: command, ...data });
}

function openPresetEditor(title, presetData) {
    let modal = document.getElementById('presetEditorModal');
    let content = document.getElementById('presetEditorContent');

    let presetEditor = PresetEditor(title, presetData);

    content.appendChild(presetEditor);
    modal.classList.remove('d-none');
}

function closePresetEditor() {
    document.getElementById('presetEditorModal').classList.add('d-none');
    document.getElementById('presetEditorContent').innerHTML = '';
    let savePresetBtn = document.getElementById('savePresetBtn');
    savePresetBtn.replaceWith(savePresetBtn.cloneNode(true));
}

async function drawPresetList() {
    let presets = (await browser.storage.local.get("presets")).presets;
    let ul = document.getElementById('presetList');
    ul.innerHTML = '';

    for (let i = 0; i < presets.length; i++) {
        let li = document.createElement('li');

        let textDiv = document.createElement('div');
        textDiv.classList.add('cursor-pointer');
        textDiv.addEventListener("click", async function () {
            if(presets[i].clearStorage) 
                sendToContentScript("clear-storage", { storageType: presets[i].storageType });
            sendToContentScript("set-to-storage", { items: presets[i].items, storageType: presets[i].storageType });
        });
        textDiv.textContent = presets[i].name;
        li.appendChild(textDiv);

        const btnContainer = document.createElement('div');
        li.appendChild(btnContainer);

        let editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = `<img class="icon" src="../icons/edit-03-svgrepo-com.svg">`;
        editBtn.addEventListener('click', () => openPresetEditor('Edit preset', presets[i]));
        btnContainer.appendChild(editBtn);

        let delBtn = document.createElement('button');
        delBtn.classList.add('delete-btn');
        delBtn.innerHTML = `<img class="icon" src="../icons/delete-2-svgrepo-com.svg">`;
        delBtn.addEventListener('click', async function () {
            let psets = (await browser.storage.local.get("presets")).presets;
            psets.splice(i, 1);
            await browser.storage.local.set({ presets: psets });
            drawPresetList();
        });
        btnContainer.appendChild(delBtn);

        ul.appendChild(li);
    }
}

function PresetEditor(title, presetData) {
    let container = document.createElement('div');

    if(!presetData) {
        presetData = {
            id: '',
            name: 'new preset',
            items: [{
                key: 'key',
                val: 'value'
            }],
            clearStorage: false,
            storageType: "local"
        };
    }

    container.innerHTML = 
    `<h3>${title}</h3>
    <form name='createPresetForm'>
        <div>
            <label>Preset name</label>
            <input type="text" name="presetName" data-id="${presetData.id}" value="${presetData.name}" />
        </div>
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
        <div>
            <select name='storageType'></select>
            <label>
                <input type="checkbox" ${presetData.clearStorage ? 'checked' : ''} name='clearStorage' />
                Clear storage
            </label>
        </div>
        <button type="button" name="addItemBtn">Add item</button>
    </form>`;

    let tbody = container.querySelector('tbody');

    for(let item of (presetData.items || [])) {
        let itemTr = createNewPresetItem(item.key, item.val);
        tbody.appendChild(itemTr);
    }

    container.querySelector('[name="addItemBtn"]').addEventListener('click', function() {
        let newItem = createNewPresetItem();
        tbody.appendChild(newItem);
    });

    let form = container.querySelector('[name="createPresetForm"]');

    const storageTypeSelectBox = form.querySelector('[name="storageType"]');
    [{type: "local", name: "LocalStorage"}, {type: "session", name: "SessionStorage"}, {type: "cookie", name: "Cookie"}]
    .forEach(function(t) {
        const opt = document.createElement('option');
        opt.value = t.type;
        opt.textContent = t.name;
        if(t.type === presetData.storageType)
            opt.selected = true;

        storageTypeSelectBox.appendChild(opt);
    });

    document.getElementById('savePresetBtn')
        .addEventListener('click', async function (e) {
        let preset = presetFromForm(form);

        if (preset) {
            await savePreset(preset);
            closePresetEditor();
            await drawPresetList();
        }
    });

    return container;
}

function createNewPresetItem(key, val) {
    let tr = document.createElement('tr');
    tr.innerHTML = `<td><input type='text' placeholder='key' value="${key || ''}" /></td>
                    <td><input type='text' placeholder='value' value="${val || ''}" /></td>`;

    let thirdTD = document.createElement('td');
    let delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = 'X';
    delBtn.addEventListener('click', () => tr.remove());
    thirdTD.appendChild(delBtn);
    tr.appendChild(thirdTD);

    return tr;
}

function presetFromForm(form) {
    let validation = true;

    let presetNameInpt = form.querySelector('[name="presetName"]');
    presetNameInpt.classList.remove('bg-danger');
    let presetName = presetNameInpt.value;
    let presetId = presetNameInpt.dataset.id;

    if (!presetName) {
        validation = false;
        presetNameInpt.classList.add('bg-danger');
    }

    let presetItems = [];

    for (let itemTr of form.querySelectorAll('tbody tr')) {
        itemTr.classList.remove('bg-danger');

        let keyInpt = itemTr.getElementsByTagName('input')[0];
        let valInpt = itemTr.getElementsByTagName('input')[1];

        let item = {
            key: keyInpt.value,
            val: valInpt.value
        };

        if (!item.key || !item.val) {
            itemTr.classList.add('bg-danger');
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

    if(preset.id) {
        let oldPreset = presets.find(p => p.id == preset.id);
        if(oldPreset) {
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