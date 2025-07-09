<template>
    <div class="containerQuartos">
        <slot v-for="item in items" :item="item" :key="item.id" />
    </div>
</template>

<script setup>
defineProps({
    items: {
        type: Array,
        required: true
    }
})
</script>

<style scoped>
.containerQuartos {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-width: 900px;
    padding: 16px;
    margin: 0 auto;
    justify-content: center;
}
</style>