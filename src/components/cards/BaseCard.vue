<template>
    <div class="baseCard" :class="customClass">
        <slot />
    </div>
</template>

<script setup>
defineProps({ customClass: String })
</script>

<style scoped>
.baseCard {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 32px #0000001f;
    width: 100%;
    max-width: 300px;
    padding: 16px;
    transition: box-shadow 0.18s;
    display: flex;
    /* Adicione se todos os cards forem flexíveis */
    flex-direction: row;
    /* Ou column, se preferir */
    align-items: center;
}

.baseCard:hover {
    box-shadow: 0 6px 38px #00000026;
}
</style>