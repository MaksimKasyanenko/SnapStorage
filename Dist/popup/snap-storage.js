
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