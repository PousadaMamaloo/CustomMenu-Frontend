<template>
  <div class="card-pedido" @click="$emit('verMais', id)" tabindex="0" role="button"
    @keydown.enter="$emit('verMais', id)">
    <div class="card-icone">
      <span class="mdi mdi-food-fork-drink"></span>
    </div>
    <div class="card-conteudo">
      <h4 class="card-titulo">Pedido - Quarto {{ quarto }}</h4>
      <div class="card-meta">
        <span v-if="dataPedido">Dia: {{ formatarData(dataPedido) }}</span>
        <span v-if="totalItens > 0" class="separador">|</span>
        <span v-if="totalItens > 0">{{ totalItens }} itens</span>
        <span v-if="horario && totalItens > 0" class="separador">|</span>
      </div>
    </div>
    <div class="card-base" @click="$emit('click', id)">
      <div class="card-icone">
        <span class="mdi mdi-food-fork-drink"></span>
      </div>
      <div class="card-conteudo">
        <h4 class="card-titulo">Pedido - Quarto {{ quarto }}</h4>
        <div class="card-meta">
          <span v-if="dataPedido">Dia: {{ formatarData(dataPedido) }}</span>
          <span v-if="totalItens > 0" class="separador">|</span>
          <span v-if="totalItens > 0">{{ totalItens }} itens</span>
          <span v-if="horario && totalItens > 0" class="separador">|</span>
        </div>
      </div>
      <div class="card-base" @click="$emit('click', id)">
        <div class="card-icone">
          <span class="mdi mdi-receipt-text-outline"></span>
        </div>
        <div class="card-conteudo">
          <span class="card-titulo">{{ nome || `Pedido - Quarto ${quarto}` }}</span>
          <div class="card-meta">
            <span v-if="data">{{ data }}</span>
            <span class="mdi mdi-circle-small" v-if="data && horario"></span>
            <span v-if="horario">{{ horario }}</span>
          </div>
        </div>
        <div class="card-acoes">
          <slot name="acoes"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: { type: Number, required: true },
  quarto: { type: [String, Number], required: true },
  hospedeNome: { type: String, default: '' },
  totalItens: { type: Number, default: 0 },
  horario: { type: String, default: '' },
  dataPedido: { type: String, default: '' } // <-- nova prop
});

function formatarData(dataString) {
  if (!dataString) return '';
  const data = new Date(dataString);
  // Ajusta para o fuso de Brasília (GMT-3)
  return data.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}
</script>

<style scoped>
.card-pedido {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  outline: none;
}

.card-pedido:hover,
.card-pedido:focus {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.10);
  border-color: #f8a953;
  background: #fff7ed;
}

.card-icone {
  font-size: 24px;
  color: #f8a953;
  background-color: #fef3e6;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-conteudo {
  flex-grow: 1;
}

.card-titulo {
  font-size: 16px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #718096;
}

.card-meta .separador {
  color: #cbd5e0;
}

.card-acoes {
  margin-left: auto;

}
</style>