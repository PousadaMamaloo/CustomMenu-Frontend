<template>
  <div>
    <botaoFiltro ref="filtroBtn" @click="abrirModal = true" />
    
    <div v-if="abrirModal" class="modal-overlay" @click.self="cancelar">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-button" @click="cancelar">&times;</button>
        </div>
        
        <div class="modal-body">
          <slot 
            :opcoes="opcoesDisponiveis"
            :selecao-temporaria="selecaoTemporaria"
            :update-selecao="handleUpdateSelecao"
          >
          </slot>
        </div>

        <div class="modal-footer">
          <button class="botao-limpar" @click="limparFiltro">Limpar</button>
          <button class="botao-aplicar" @click="aplicarFiltro">Aplicar</button>
        </div>
      </div>
    </div>
  </div>
</template> 

<script setup>
import { ref, computed, watch } from 'vue'
import botaoFiltro from '@/components/botoes/botaoFiltro.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  filterKey: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Filtrar'
  }
})

const emit = defineEmits(['update:filteredItems'])

const abrirModal = ref(false)
const selecaoAtiva = ref([]) 
const selecaoTemporaria = ref([])

watch(abrirModal, (isAberto) => {
  if (isAberto) {
    selecaoTemporaria.value = [...selecaoAtiva.value]
  }
})

const opcoesDisponiveis = computed(() => {
  return [...new Set(props.items.map(item => item[props.filterKey]))]
})

function handleUpdateSelecao(novaSelecao) {
  selecaoTemporaria.value = novaSelecao
}

function aplicarFiltro() {
  selecaoAtiva.value = [...selecaoTemporaria.value]
  if (!selecaoAtiva.value.length) {
    emit('update:filteredItems', props.items)
  } else {
    const itemsFiltrados = props.items.filter(item => 
      selecaoAtiva.value.includes(item[props.filterKey])
    )
    emit('update:filteredItems', itemsFiltrados)
  }
  abrirModal.value = false
}

function limparFiltro() {
  selecaoTemporaria.value = []
  selecaoAtiva.value = []
  emit('update:filteredItems', props.items)
}

function cancelar() {
  abrirModal.value = false
}

watch(() => props.items, (newItems) => {
    emit('update:filteredItems', newItems)
}, { immediate: true })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  min-width: 320px;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
  padding-top: 16px;
  margin-top: 16px;
}

.botao-aplicar, .botao-limpar {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.botao-aplicar {
  background-color: #f8a953;
  color: white;
}

.botao-limpar {
  background-color: #f1f1f1;
  color: #333;
}
</style>