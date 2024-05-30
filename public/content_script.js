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
    console.log("Snap Storage inject");
    if (window.snapStorageInjected) {
        return;
    }
    window.snapStorageInjected = true;

    browser.runtime.onMessage.addListener(function (message) {
        message = JSON.parse(message);
        const storage = getStorageManager(message.storageType);

        if (message.command === 'set-to-storage') {
            storage.addRecords(message.items);
        }
        else if (message.command === 'clear-storage') {
            storage.clear();
        }
        else if (message.command === 'getStorageData') {
            return storage.getStorageData();
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

        getStorageData() {
            const result = [];
            for (const key of Object.keys(localStorage)) {
                result.push({
                    key: key,
                    val: localStorage.getItem(key)
                });
            }

            return Promise.resolve({ response: JSON.stringify(result) });
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

        getStorageData() {
            const result = [];
            for (const key of Object.keys(sessionStorage)) {
                result.push({
                    key: key,
                    val: sessionStorage.getItem(key)
                });
            }

            return Promise.resolve({ response: JSON.stringify(result) });
        }
    }

    class CookieStorageManager {
        addRecords(records) {
            for (let record of records) {
                if (!record.key) continue;

                let cookieStr = `${record.key}=${encodeURIComponent(record.val || '')};`

                if (record.maxAge)
                    cookieStr += `max-age=${record.maxAge}`;
                if (record.expires)
                    cookieStr += `expires=${record.expires.toUTCString()}`;

                document.cookie = cookieStr;
            }
        }

        clear() {
            const cookies = document.cookie.split(";");

            for (let i = 0; i < cookies.length; i++) {
                const cookie = this.__getKeyValPair(cookies[i]);
                if (cookie) {
                    document.cookie = `${cookie.key}=;expires=${new Date(0).toUTCString()}`;
                }
            }
        }

        __getKeyValPair(cookie) {
            let cutIndex = cookie.indexOf("=");
            if (cutIndex < 0)
                return null;

            return {
                key: cookie.substring(0, cutIndex++).trim(),
                val: cutIndex >= cookie.length ? '' : cookie.substring(cutIndex)
            };
        }

        getStorageData() {
            const cookies = document.cookie.split(";");
            const result = [];

            for (let i = 0; i < cookies.length; i++) {
                const c = this.__getKeyValPair(cookies[i]);

                if (c)
                    result.push(c);
            }

            return Promise.resolve({ response: JSON.stringify(result) });
        }
    }
})();