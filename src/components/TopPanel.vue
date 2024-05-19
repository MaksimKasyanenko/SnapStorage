<template>
  <div class="shadow">
        <header class="header">
            <div class="p-1">
                <img src="../../public/logo-32.png">
            </div>

            <div class="command-panel">
                <button title="Create a new preset" @click="$emit('newPreset')"><strong>New preset</strong></button>
                <button title="Clear localstorage" @click="$emit('clear', 'local')">Clear LocalStorage</button>
                <button title="Clear session storage" @click="$emit('clear', 'session')">Clear SessionStorage</button>
                <button title="Clear Cookie" @click="$emit('clear', 'cookie')">Clear Cookie</button>
            </div>
        </header>
    </div>
</template>

<script setup>
    
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