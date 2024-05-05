<template>
    <div class="scroller">
        <slot></slot>
    </div>
</template>

<style scoped>
.scroller {
    height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.scroller::-webkit-scrollbar {
    display: none;
}
</style>