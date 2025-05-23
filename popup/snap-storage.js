window.addEventListener('load', start);

async function start() {
    await drawPresetList();
    try {
        await browser.tabs.executeScript({ file: "/content_scripts/main.js" });
        window.contentScriptInjected = true;
    }
    catch {
        window.contentScriptInjected = false;
    }
    await addListeners();
}

async function addListeners() {
    document.getElementById('clearLocalStorageBtn')
        .addEventListener("click", () => { 
            sendToContentScript("clear-storage", { storageType: "local" });
            notify('The LocalStorage has been cleared.');
         });
    document.getElementById('clearSessionStorageBtn')
        .addEventListener("click", () => {
            sendToContentScript("clear-storage", { storageType: "session" });
            notify('The SessionStorage has been cleared.');
        });
    document.getElementById('clearCookieBtn')
        .addEventListener("click", () => {
            sendToContentScript("clear-storage", { storageType: "cookie" });
            notify('The Cookie for current tab has been cleared.');
        });

    document.getElementById('createPresetBtn').addEventListener('click', () => {
        FillPresetEditor('Create preset');
        document.getElementById('presetEditorModal').classList.remove('d-none');
    });
    document.getElementById('closePresetEditorBtn').addEventListener('click', 
                () => document.getElementById('presetEditorModal').classList.add('d-none'));
}

async function sendToContentScript(command, data) {
    if(!window.contentScriptInjected) {
        alert("This web page's policies forbid this action :(");
        return;
    }

    let tabs = await browser.tabs.query({ active: true, currentWindow: true });
    browser.tabs.sendMessage(tabs[0].id, { command: command, ...data });
}

async function drawPresetList() {
    let presets = (await browser.storage.local.get("presets")).presets;
    let ul = document.getElementById('presetList');
    ul.innerHTML = '';

    if (!presets || presets.length == 0) {
        const li = document.createElement('li');
        li.classList.add('empty-presets-message');
        li.innerHTML = "<p class='text-center'>You don't have any preset created yet.</p>";

        const centerDiv = document.createElement('div');
        centerDiv.classList.add('text-center');
        li.appendChild(centerDiv);

        const newPresetBtn = document.createElement('button');
        newPresetBtn.textContent = 'Create Preset';
        newPresetBtn.classList.add('btn', 'btn-primary');
        newPresetBtn.addEventListener('click', () => {
            FillPresetEditor('Create preset');
            document.getElementById('presetEditorModal').classList.remove('d-none');
        });
        centerDiv.appendChild(newPresetBtn);

        ul.appendChild(li);

        return;
    }

    for (let i = 0; i < presets.length; i++) {
        let li = document.createElement('li');

        let textDiv = document.createElement('div');
        textDiv.classList.add('cursor-pointer');
        textDiv.style.width = "100%";
        textDiv.textContent = presets[i].name;
        textDiv.addEventListener("click", async function () {
            if (presets[i].clearStorage)
                sendToContentScript("clear-storage", { storageType: presets[i].storageType });
            sendToContentScript("set-to-storage", { items: presets[i].items, storageType: presets[i].storageType });
            notify(`"${presets[i].name}" applied`);
        });
        li.appendChild(textDiv);

        const btnContainer = document.createElement('div');
        btnContainer.style.width = "4.4rem";
        btnContainer.style.textAlign = "right";
        li.appendChild(btnContainer);

        let editBtn = document.createElement('button');
        editBtn.classList.add('p-0', 'me-1');
        editBtn.innerHTML = `<img class="icon" src="../icons/edit-ui-svgrepo-com.svg">`;
        editBtn.addEventListener('click', () => {
            FillPresetEditor('Edit preset', presets[i]);
            document.getElementById('presetEditorModal').classList.remove('d-none');
        });
        btnContainer.appendChild(editBtn);

        let delBtn = document.createElement('button');
        delBtn.classList.add('p-0');
        delBtn.innerHTML = `<img class="icon" src="../icons/delete-svgrepo-com.svg">`;
        delBtn.addEventListener('click', async function () {
            if(!confirm('Are you sure you want to permanently delete this preset?')) return;
            let psets = (await browser.storage.local.get("presets")).presets;
            psets.splice(i, 1);
            await browser.storage.local.set({ presets: psets });
            drawPresetList();
        });
        btnContainer.appendChild(delBtn);

        ul.appendChild(li);
    }
}

function FillPresetEditor(title, presetData) {
    if (!presetData) {
        presetData = {
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


function notify(message) {
    if(!window.contentScriptInjected) 
        return;
    
    if(window.notificationElement) {
        clearTimeout(window.removeNotifTimeout);
        window.notificationElement.remove();
    }
        
    window.notificationElement = document.createElement('div');
    window.notificationElement.classList.add('notification');
    const p = document.createElement('p');
    p.textContent = message;
    window.notificationElement.appendChild(p);

    document.body.appendChild(window.notificationElement);
    window.removeNotifTimeout = setTimeout(function () {
        window.notificationElement.remove();
    }, 2000);
}