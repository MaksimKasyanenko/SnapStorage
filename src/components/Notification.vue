<script setup>
    import { onMounted, ref } from 'vue';

    const message = ref('');
    const show = ref(false);
    let timeoutId1 = null;
    let timeoutId2 = null;

    onMounted(() => {
        window.globalEventEmitter.subscribe('notify', function(msg) {
            show.value = false;
            
            if(timeoutId1)
                clearTimeout(timeoutId1);

            if(timeoutId2)
                clearTimeout(timeoutId2);

            timeoutId1 = setTimeout(() => {
                message.value = msg;
                show.value = true;
            }, 100);

            timeoutId2 = setTimeout(() => {
                timeoutId1 = null;
                timeoutId2 = null;
                show.value = false
            }, 2000);
        });
    });
</script>

<template>
    <div class="notification" v-if="show">
        <p>{{ message }}</p>
    </div>
</template>

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