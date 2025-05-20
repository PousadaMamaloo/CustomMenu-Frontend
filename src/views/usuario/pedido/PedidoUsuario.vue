<template>
<<<<<<< Updated upstream
    <h1>Página de Pedido ao Usuário</h1>
</template>
=======
  <div class="pedido-container">

    <div class="header-horario">
      <h1>Café da manhã Mamaloo {{ dataAtual }}</h1>
    </div>

    <div class="horario-cafe">
      <div class="formulario-horario">
        <h2>Selecione o Horário</h2>
        <p>Esses são os horários disponíveis, caso nenhum lhe agrade, consulte a gestão!</p>
        <div class="horarios-disponiveis">
          <button
            v-for="(horario, index) in horarios"
            :key="index"
            :class="{ selecionado: horario === horarioSelecionado }"
            @click="selecionarHorario(horario)"
          >
            {{ horario }}
          </button>
        </div>
      </div>
    </div>

        <div class="historico-cafe">
    <button class="botao-historico" @click="abrirHistorico">
        Consultar o histórico de pedidos
    </button>
    <p class="subtitulo-historico">
        Clique aqui para ver os seus pedidos já feitos
    </p>
    </div>


    <div class="comida-pedido">
      <h2>O que deseja comer?</h2>
      <div class="lista-comidas">
        <div class="item-comida" v-for="(item, index) in comidas" :key="index">
          <img :src="item.imagem" alt="Imagem do item" class="imagem-comida" />
          <div class="info-comida">
            <strong>{{ item.nome }}</strong>
            <p>{{ item.descricao }}</p>
            <div class="contador">
              <button @click="diminuirQuantidade(index)">-</button>
              <span>{{ item.quantidade }}</span>
              <button @click="aumentarQuantidade(index)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bebida-pedido">
      <h2>O que deseja beber?</h2>
      <div class="lista-bebidas">
        <div class="item-bebida" v-for="(item, index) in bebidas" :key="index">
          <img :src="item.imagem" alt="Imagem da bebida" class="imagem-bebida" />
          <div class="info-bebida">
            <strong>{{ item.nome }}</strong>
            <p>{{ item.descricao }}</p>
            <div class="contador">
              <button @click="diminuirQuantidadeBebida(index)">-</button>
              <span>{{ item.quantidade }}</span>
              <button @click="aumentarQuantidadeBebida(index)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="observacao-pedido">
      <h2>Observações sobre o Pedido</h2>
      <textarea
        v-model="observacao"
        placeholder="Digite aqui alguma observação especial..."
        maxlength="200"
      ></textarea>
      <p class="contador-caracteres">{{ observacao.length }}/200</p>
    </div>
    <div class="envio-pedido">
  <button class="botao-enviar" @click="enviarPedido">
    Enviar Pedido
  </button>
</div>
    </div>
    
</template>

<script setup>
import { ref, onMounted } from 'vue'

const dataAtual = new Date().toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})

const horarios = ref([])
const horarioSelecionado = ref(null)

function selecionarHorario(horario) {
  horarioSelecionado.value = horario
}

function abrirHistorico() {
  // Trocar futuramente por navegação ou exibição de componente
  alert('Histórico de pedidos será exibido aqui.')
}

onMounted(() => {
  horarios.value = ['7:00', '7:30', '8:00', '8:30', '9:00', '9:30']
})
const comidas = ref([
  {
    nome: 'Bolo de cenoura',
    descricao: 'Delicioso e fofo, com cobertura de chocolate',
    imagem: '/imagens/bolo-cenoura.jpg',
    quantidade: 0
  },
  {
    nome: 'Cuscuz recheado',
    descricao: 'Com queijo coalho e carne seca',
    imagem: '/imagens/cuscuz.jpg',
    quantidade: 0
  }
  // Adicione mais conforme necessário
])

function aumentarQuantidade(index) {
  comidas.value[index].quantidade++
}

function diminuirQuantidade(index) {
  if (comidas.value[index].quantidade > 0) {
    comidas.value[index].quantidade--
  }
}
const bebidas = ref([
  {
    nome: 'Achocolatado',
    descricao: 'Bebida doce e gelada com sabor de chocolate',
    imagem: '/imagens/achocolatado.jpg',
    quantidade: 0
  },
  {
    nome: 'Suco de cajú',
    descricao: 'Natural e refrescante',
    imagem: '/imagens/suco-caju.jpg',
    quantidade: 0
  }
  // Adicione mais conforme necessário
])

function aumentarQuantidadeBebida(index) {
  bebidas.value[index].quantidade++
}

function diminuirQuantidadeBebida(index) {
  if (bebidas.value[index].quantidade > 0) {
    bebidas.value[index].quantidade--
  }
}
const observacao = ref('')
function enviarPedido() {
  if (!horarioSelecionado.value) {
    alert('Por favor, selecione um horário antes de enviar o pedido.')
    return
  }

  const totalComidas = comidas.value.reduce((soma, item) => soma + item.quantidade, 0)
  const totalBebidas = bebidas.value.reduce((soma, item) => soma + item.quantidade, 0)

  if (totalComidas === 0 && totalBebidas === 0) {
    alert('Selecione pelo menos um item de comida ou bebida.')
    return
  }

  // Aqui futuramente entra o envio para API
  alert('Pedido enviado com sucesso!')
}


</script>


<style scoped>
.pedido-container {
  padding: 24px;
}

.horario-cafe {
  background-color: #f8f8f8;
  padding: 24px;
  border-radius: 12px;
  position: relative;
}

.header-horario {
  display: flex;
  align-items: center;
}

.imagem-cafe {
  width: 80px;
  height: auto;
}

.formulario-horario {
  margin-top: 20px;
}

.horarios-disponiveis {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.horarios-disponiveis button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: #ececec;
  cursor: pointer;
  transition: 0.3s;
}

.horarios-disponiveis button.selecionado {
  background-color: #FD9519;
  color: white;
  
}
.historico-cafe {
  margin-top: 32px;
  text-align: center;
}

.botao-historico {
  background-color: #ececec;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.botao-historico:hover {
  background-color: #d4d4d4;
}

.subtitulo-historico {
  margin-top: 8px;
  font-size: 14px;
  color: #555;
}
.comida-pedido {
  margin-top: 32px;
}

.lista-comidas {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.item-comida {
  display: flex;
  gap: 16px;
  background-color: #f4f4f4;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
}

.imagem-comida {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.info-comida {
  flex: 1;
}

.contador {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.contador button {
  background-color: #dcdcdc;
  border: none;
  padding: 4px 10px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
}
.bebida-pedido {
  margin-top: 32px;
}

.lista-bebidas {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.item-bebida {
  display: flex;
  gap: 16px;
  background-color: #f4f4f4;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
}

.imagem-bebida {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.info-bebida {
  flex: 1;
}

.observacao-pedido {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
}

.observacao-pedido textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  font-size: 14px;
}

.contador-caracteres {
  align-self: flex-end;
  font-size: 12px;
  color: #777;
  margin-top: 4px;
}

.envio-pedido {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.botao-enviar {
  background-color: #4caf50;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.botao-enviar:hover {
  background-color: #449d48;
}

</style>
>>>>>>> Stashed changes
