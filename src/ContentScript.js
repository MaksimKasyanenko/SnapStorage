export class ContentScript {
    async inject() {
        try {
            await browser.tabs.executeScript({ file: "/content_scripts/main.js" });
            this.contentScriptInjected = true;
        }
        catch {
            this.contentScriptInjected = false;
        }
    }

    async execute(command, data) {
        if(!this.contentScriptInjected) {
            alert("This web page's policies forbid this action :(");
            return;
        }
    
        let tabs = await browser.tabs.query({ active: true, currentWindow: true });
        browser.tabs.sendMessage(tabs[0].id, { command: command, ...data });
    }
}