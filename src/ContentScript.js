export class ContentScript {
    constructor(testMode) {
        this.testMode = testMode;
    }

    async inject() {
        try {
            if(!this.testMode)
                await browser.tabs.executeScript({ file: "/content_script.js" });

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

        if(!this.testMode) {
            let tabs = await browser.tabs.query({ active: true, currentWindow: true });
            const message = JSON.stringify({ command: command, ...data });
            await browser.tabs.sendMessage(tabs[0].id, message);
        }
    }
}