<template>
    <BaseCard :customClass="`cardItemCardapio ${selecionado ? 'selecionado' : ''} ${processando ? 'processando' : ''}`">
        <img :src="item.foto" :alt="item.nome" class="itemImg" />
        <div class="itemInfo">
            <span class="itemNome">{{ item.nome }}</span>
            <span class="itemDesc">{{ item.descricao }}</span>
            <span v-if="item.preco" class="itemPreco">R$ {{ formatarPreco(item.preco) }}</span>
        </div>
        <div class="acaoContainer">
            <div v-if="processando" class="spinner">
                <i class="mdi mdi-loading mdi-spin"></i>
            </div>
            <label v-else class="checkboxContainer">
                <input type="checkbox" :checked="selecionado" @change="$emit('selecionar', item)"
                    :disabled="processando" />
                <span class="customCheck"></span>
            </label>
        </div>
    </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue'

defineProps({
    item: Object,
    selecionado: Boolean,
    processando: {
        type: Boolean,
        default: false
    }
})
defineEmits(['selecionar'])

function formatarPreco(preco) {
    return Number(preco).toFixed(2).replace('.', ',')
}
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
    transition: all 0.2s ease;
    cursor: pointer;
}

.cardItemCardapio:hover {
    border-color: #f8a953;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cardItemCardapio.selecionado {
    border-color: #f8a953;
    background: linear-gradient(135deg, #fff9f0, #fff);
}

.cardItemCardapio.processando {
    opacity: 0.7;
    cursor: wait;
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
    flex: 1;
    gap: 4px;
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
    line-height: 1.4;
}

.itemPreco {
    font-size: 16px;
    font-weight: 600;
    color: #f8a953;
    margin-top: 4px;
}

.acaoContainer {
    display: flex;
    align-items: center;
    margin-left: 12px;
}

.spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
}

.spinner i {
    font-size: 24px;
    color: #f8a953;
}

.checkboxContainer {
    display: flex;
    align-items: center;
    cursor: pointer;
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
    transition: all 0.2s ease;
}

input[type="checkbox"]:checked+.customCheck {
    background-color: #f8a953;
}

input[type="checkbox"]:checked+.customCheck::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 12px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -60%) rotate(45deg);
}

input[type="checkbox"]:disabled+.customCheck {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
