<template>
    <div class="paginaPedidos">
        <div class="cabecalhoPedidos">
            <BotaoVoltar destino="/admin" textPage="Gerenciar Pedidos" />
            <div class="acoesPedidos">
                <button class="botaoIcone" @click="irParaRelatorio">
                    <span class="mdi mdi-download"></span>
                </button>
                <FiltroGenerico
                    :items="pedidos"
                    filter-key="quarto"
                    title="Filtrar por Quarto"
                    @update:filtered-items="pedidosFiltrados = $event"
                >
                    <template #default="{ opcoes, selecaoTemporaria, updateSelecao }">
                        <div class="opcoes-filtro-checkbox">
                            <label v-for="quarto in opcoes.sort((a, b) => a - b)" :key="quarto" class="checkbox-label">
                                <input
                                    type="checkbox"
                                    :value="quarto"
                                    :checked="selecaoTemporaria.includes(quarto)"
                                    @change="toggleSelecao(quarto, selecaoTemporaria, updateSelecao)"
                                />
                                <span>Quarto {{ quarto }}</span>
                            </label>
                        </div>
                    </template>
                </FiltroGenerico>
            </div>
        </div>

        <ContainerCards :items="pedidosFiltrados">
            <template #default="{ item }">
                <CardPedido :id="item.id" :quarto="item.quarto" :nome="item.nome" :horario="item.horario" />
            </template>
        </ContainerCards>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CardPedido from '@/components/cards/CardPedido.vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import ContainerCards from '@/components/ContainerCards.vue'
import FiltroGenerico from '@/components/FiltroGenerico.vue'

const router = useRouter()

const pedidos = ref([
    { id: 1, quarto: 1, nome: 'João Paulo', horario: '9:30', categoria: 'Padaria' },
    { id: 2, quarto: 6, nome: 'João Paulo', horario: '10:00', categoria: 'Bebidas' },
    { id: 3, quarto: 2, nome: 'João Paulo', horario: '8:00', categoria: 'Padaria' },
    { id: 4, quarto: 9, nome: 'João Paulo', horario: '9:30', categoria: 'Pratos Quentes' },
    { id: 5, quarto: 10, nome: 'João Paulo', horario: '9:30', categoria: 'Bebidas' },
    { id: 6, quarto: 4, nome: 'João Paulo', horario: '9:30', categoria: 'Frutas' },
    { id: 7, quarto: 1, nome: 'Maria Silva', horario: '9:35', categoria: 'Bebidas' },
])

const pedidosFiltrados = ref(pedidos.value)

function toggleSelecao(item, selecaoAtual, updateFn) {
    const novaSelecao = [...selecaoAtual]
    const index = novaSelecao.indexOf(item)

    if (index > -1) {
        novaSelecao.splice(index, 1)
    } else {
        novaSelecao.push(item)
    }
    
    updateFn(novaSelecao)
}

function irParaRelatorio() {
    router.push('/admin/pedidos/relatorio')
}
</script>

<style scoped>
.paginaPedidos {
    padding: 24px 16px 0 16px;
    margin: 0 auto;
    max-width: 900px;
    box-sizing: border-box;
}
.cabecalhoPedidos {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
}
.acoesPedidos {
    display: flex;
    gap: 10px;
}
.botaoIcone {
    background-color: #f8a953;
    border: none;
    padding: 12px;
    border-radius: 8px;
    color: white;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 37px;
    height: 37px;
}
.botaoIcone:hover {
    background: #ffa948;
}
.opcoes-filtro-checkbox {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  cursor: pointer;
}
.checkbox-label input {
  width: 18px;
  height: 18px;
}
</style>