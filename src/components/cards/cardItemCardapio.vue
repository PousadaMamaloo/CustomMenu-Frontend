<template>
    <BaseCard customClass="cardItemCardapio">
        <img :src="item.foto" :alt="item.nome" class="itemImg" />
        <div class="itemInfo">
            <span class="itemNome">{{ item.nome }}</span>
            <span class="itemDesc">{{ item.descricao }}</span>
        </div>
        <label class="checkboxContainer">
            <input type="checkbox" :checked="selecionado" @change="$emit('selecionar', item)" />
            <span class="customCheck"></span>
        </label>
    </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue'

defineProps({
    item: Object,
    selecionado: Boolean,
})
defineEmits(['selecionar'])
</script>

<style scoped>
.cardItemCardapio {
    display: flex;
    align-items: center;
    gap: 20px;
    border-radius: 16px;
    border: 1.5px solid #cfcfd4;
    background: #fff;
    padding: 14px 18px;
    margin-bottom: 16px;
    min-height: 98px;
}

.itemImg {
    min-width: 74px;
    height: 66px;
    border-radius: 10px;
    object-fit: cover;
    background: #ededed;
}

.itemInfo {
    display: flex;
    flex-direction: column;
}

.itemNome {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 2px;
    color: #212121;
}

.itemDesc {
    font-size: 13px;
    color: #878787;
    font-weight: 400;
}

.checkboxContainer {
    display: flex;
    align-items: center;
    margin-left: 12px;
}

input[type="checkbox"] {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
}

.customCheck {
    width: 28px;
    height: 28px;
    border: 2.5px solid #f8a953;
    border-radius: 50%;
    background: #fff;
    position: relative;
    display: inline-block;
}

input[type="checkbox"]:checked+.customCheck {
    background-color: #f8a953;
}

.customCheck::after {
    content: '';
    position: absolute;
    display: none;
    top: 7px;
    left: 7px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
}

input[type="checkbox"]:checked+.customCheck::after {
    display: block;
}
</style>
