<template>
  <div class="paginaCardapioRefeicao">
    <BotaoVoltar destino="refeicao" :textPage="`${titulo}`" />
    <div class="conteudoRefeicao">
      <div class="colunaEsquerda">
        <HorarioSelecao :horarios="horarios" :selecionado="horarioSelecionado" @update:selecionado="selecionarHorario"
          @adicionar="adicionarHorario" />
        <div class="boxHistorico">
          <button class="historicoBtn">
            <span class="mdi mdi-history"></span>
            <span class="itemInfo">
              <span class="histTit">Consultar histórico de pedidos</span>
              <span class="histDesc">Lorem Ipsum dolor sit amet.</span>
            </span>
            <span class="mdi mdi-chevron-right"></span>
          </button>
        </div>
      </div>
      <div class="colunaDireita">
        <div>
          <CardItemCardapio v-for="item in listaItens" :key="item.id" :item="item"
            :selecionado="itensSelecionados.includes(item.id)" @selecionar="toggleItem(item.id)" />
        </div>
      </div>
    </div>
    <BotaoSalvar @click="salvarProduto" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HorarioSelecao from '@/components/HorariosSelecao.vue'
import CardItemCardapio from '@/components/cards/CardItemCardapio.vue'
import BotaoVoltar from '@/components/botoes/BotaoVoltar.vue'
import BotaoSalvar from '@/components/botoes/botaoSalvar.vue'

const titulo = 'Café da manhã Mamaloo 20/06'
const horarios = ref(['9:00', '9:30', '10:00', '10:30'])
const horarioSelecionado = ref('7:00')

const listaItens = [
  { id: 1, nome: 'Pão Francês', descricao: 'Lorem ipsum dolor sit amet, elit. consectetur adipisicing elit.', foto: '/mock/pao.jpg' },
  { id: 2, nome: 'Tapioca', descricao: 'Lorem ipsum dolor sit amet, elit. consectetur adipisicing elit.', foto: '/mock/tapioca.jpg' },
  { id: 3, nome: 'Cuscuz', descricao: 'Lorem ipsum dolor sit amet, elit. consectetur adipisicing elit.', foto: '/mock/cuscuz.jpg' },
  { id: 4, nome: 'Macaxeira', descricao: 'Lorem ipsum dolor sit amet, elit. consectetur adipisicing elit.', foto: '/mock/macaxeira.jpg' },
  { id: 5, nome: 'Bolo', descricao: 'Lorem ipsum dolor sit amet, elit. consectetur adipisicing elit.', foto: '/mock/bolo.jpg' }
]
const itensSelecionados = ref([])

function selecionarHorario(h) {
  horarioSelecionado.value = h
}
function adicionarHorario() {
  // lógica para adicionar horário
}
function toggleItem(id) {
  if (itensSelecionados.value.includes(id)) {
    itensSelecionados.value = itensSelecionados.value.filter(i => i !== id)
  } else {
    itensSelecionados.value.push(id)
  }
}
function salvar() {
  // salvar lógica
}
</script>

<style scoped>
.paginaCardapioRefeicao {
  padding-inline: 20px;
  max-width: 1350px;
  margin: 0 auto;
}

.conteudoRefeicao {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.colunaEsquerda,
.colunaDireita {
  width: 100%;
}

.itemInfo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

@media (min-width: 765px) {
  .conteudoRefeicao {
    flex-direction: row;
    gap: 44px;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .colunaEsquerda {
    width: 340px;
    min-width: 270px;
    max-width: 340px;
  }

  .colunaDireita {
    flex: 1;
    max-width: 620px;
  }
}

.subtitulo {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 18px;
}

.historicoBtn {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 10px;
  border: none;
  padding: 18px 18px 14px 18px;
  font-size: 17px;
  font-weight: 600;
  gap: 16px;
  color: #1c1c1c;
  width: 100%;
  transition: background 0.18s;
  cursor: pointer;
}

.historicoBtn .mdi-history {
  font-size: 30px;
  margin-right: 8px;
  color: #222;
}

.histTit {
  font-size: 17px;
  font-weight: 600;
  display: block;
}

.histDesc {
  font-size: 14px;
  font-weight: 400;
  color: #888;
  margin-left: 0;
}

.historicoBtn .mdi-chevron-right {
  font-size: 27px;
  color: #b6b6b8;
  margin-left: auto;
}

.botaoSalvar {
  margin: 44px auto 0 auto;
  display: block;
  background: linear-gradient(90deg, #f8a953, #d48946 100%);
  color: white;
  border: none;
  padding: 16px 80px;
  border-radius: 30px;
  font-size: 17px;
  font-weight: 600;
  transition: background 0.23s;
  box-shadow: 0 4px 22px #f8a95333;
  cursor: pointer;
  min-width: 170px;
}
</style>
