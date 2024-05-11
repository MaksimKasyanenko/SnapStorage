/*
message = {
    command: "",
    storageType: "",
    items: [
        {
            key: "",
            val: "",
            maxAge: 0 (optinally),
            expires: Date (optinally)
        }
    ]
}
*/

(function () {
    if (window.yoCookieUsed) {
        return;
    }
    window.yoCookieUsed = true;

    browser.runtime.onMessage.addListener(function (message) {
        const storage = getStorageManager(message.storageType);

        if (message.command === 'set-to-storage') {
            storage.addRecords(message.items);
        }
        else if (message.command === 'clear-storage') {
            storage.clear();
        }
    });

    function getStorageManager(type) {
        if (type === "local")
            return new LocalStorageManager();

        if (type === "session")
            return new SessionStorageManager();

        if (type === "cookie")
            return new CookieStorageManager();
    }

    class LocalStorageManager {
        addRecords(records) {
            for (let item of records) {
                localStorage.setItem(item.key, item.val);
            }
        }

        clear() {
            localStorage.clear();
        }
    }

    class SessionStorageManager {
        addRecords(records) {
            for (let item of records) {
                sessionStorage.setItem(item.key, item.val);
            }
        }

        clear() {
            sessionStorage.clear();
        }
    }

    class CookieStorageManager {
        addRecords(records) {
            for(let record of records) {
                if(!record.key) continue;

                let cookieStr = `${record.key}=${encodeURIComponent(record.val || '')};`

                if(record.maxAge)
                    cookieStr += `max-age=${record.maxAge}`;
                if(record.expires)
                    cookieStr += `expires=${record.expires.toUTCString()}`;

                document.cookie = cookieStr;
            }
        }

        clear() {
            const cookies = document.cookie.split(";");

            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                if(cookie.indexOf("=") > -1) {
                    const name = cookie.split("=")[0].trim();
                    document.cookie = `${name}=;expires=${new Date(0).toUTCString()}`;
                }
            }
        }
    }
})();