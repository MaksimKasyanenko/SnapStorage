<template>
  <div class="shadow">
        <header class="header">
            <div class="p-1">
                <img src="../assets/logo-32.png">
            </div>

            <div class="command-panel">
                <button title="Create a new preset"><strong>New preset</strong></button>
                <button title="Clear localstorage" @click="clearLocalStorage">Clear LocalStorage</button>
                <button title="Clear session storage" @click="clearSessionStorage">Clear SessionStorage</button>
                <button title="Clear Cookie" @click="clearCookie">Clear Cookie</button>
            </div>
        </header>
    </div>
</template>

<script setup>
    function clearLocalStorage() {
        //sendToContentScript("clear-storage", { storageType: "local" });
        window.globalEventEmitter.emit('notify', 'The LocalStorage has been cleared.');
    }

    function clearSessionStorage() {
        //sendToContentScript("clear-storage", { storageType: "session" });
        window.globalEventEmitter.emit('notify', 'The SessionStorage has been cleared.');
    }

    function clearCookie() {
        //sendToContentScript("clear-storage", { storageType: "cookie" });
        window.globalEventEmitter.emit('notify', 'The Cookie for current tab has been cleared.');
    }
</script>

<style scoped>
img {
    max-width: 16px;
}

header {
    display: flex;
    align-items: stretch;
}

header button {
    background: transparent;
    border: none;
    padding: .2rem .2rem;
    text-align: center;
    color: white;
    font-size: .6rem;
    cursor: pointer;
    transition: all 0.5s;
}

header button:hover {
    background-color: #dddddd23;
}

.command-panel {
    display: flex;
    align-items: stretch;
    padding: 0.1rem 0.2rem;
    margin-left: auto;
}
</style>