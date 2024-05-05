<template>
    <div class="notification">
        <p>{{ message }}</p>
    </div>
</template>

<script setup>
defineProps({
    message: String
});
</script>

<style scoped>
.notification {
    background: var(--kms-main-color);
    position: fixed;
    bottom: .2rem;
    left: 70%;
    right: .2rem;
    text-align: center;
    padding: .4rem .6rem;
    border-radius: 6px;
    opacity: 0;
    animation-duration: 1.6s;
    animation-name: notif;
}

.notification p {
    color: white;
    font-size: .6rem;
    font-style: italic;
}

@keyframes notif {
    0% {
        opacity: 0;
        transform: translate(0, 4rem);
    }

    20% {
        opacity: 1;
        transform: translate(0);
    }

    80% {
        opacity: 1;
        transform: translate(0);
    }

    100% {
        opacity: 0;
        transform: translate(0, -4rem);
    }
}
</style>