<template></template>

<script setup>
    import { onMounted } from 'vue';

    onMounted(() => {
        window.globalEventEmitter = {
            _subscribers: [],
            subscribe(eventType, handler) {
                if(typeof(eventType) != "string" || typeof(handler) != "function")
                    throw new Error("Argument has invalid type (EventEmitter.subscribe)");

                this._subscribers.push({
                    event: eventType,
                    handler: handler
                });
            },
            emit(eventType, args) {
                this._subscribers.filter(s => s.event === eventType).forEach(s => s.handler(args));
            }
        };
    });
</script>