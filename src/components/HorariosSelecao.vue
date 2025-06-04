<template>
    <div class="horarioSelecaoBox">
        <span class="horarioSelecaoTitulo">Selecione o horário</span>
        <div class="horariosGrid">
            <button v-for="(horario, idx) in horarios" :key="horario" class="horarioBtn"
                :class="{ ativo: horario === selecionado }" @click="$emit('update:selecionado', horario)" type="button">
                {{ horario }}
            </button>
            <button v-if="mostrarAdicionar" class="horarioBtn adicionarBtn" @click="$emit('adicionar')">+</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    horarios: Array,
    selecionado: String,
    mostrarAdicionar: {
        type: Boolean,
        default: true,
    }
})
defineEmits(['update:selecionado', 'adicionar'])
</script>

<style scoped>
.horarioSelecaoBox {
    border: 1.5px solid #cfcfd4;
    border-radius: 20px;
    padding: 20px 20px 18px 24px;
    background: #fff;
    margin-bottom: 20px;
    margin-top: 20px;
}

.horarioSelecaoTitulo {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 16px;
    display: block;
}

.horariosGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 14px 10px;
}

.horarioBtn {
    background: none;
    border: 1.6px solid #cfcfd4;
    border-radius: 16px;
    font-size: 16px;
    padding: 10px 0;
    color: #444;
    width: 100%;
    height: 36px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.17s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.horarioBtn.ativo {
    background: #f8a953;
    color: #fff;
    border: 1.7px solid #f8a953;
}

.adicionarBtn {
    color: #f8a953;
    border: 1.7px dashed #f8a953;
    font-size: 28px;
}
</style>
