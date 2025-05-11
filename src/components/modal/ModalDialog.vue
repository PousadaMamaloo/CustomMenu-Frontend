<template>
  <div class="modalFundo">
    <div class="modalConteudo">
      <img :src="icone" alt="Ícone" class="modalIcone" />

      <p class="modalMensagem">{{ mensagem }}</p>

      <div class="modalAcoes">
        <button v-if="acaoPrimaria" class="modalBotao" @click="acaoPrimaria.acao">
          {{ acaoPrimaria.texto }}
        </button>
  
        <button v-if="acaoSecundaria" class="modalLink" @click="acaoSecundaria.acao">
          {{ acaoSecundaria.texto }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  mensagem: String,
  icone: String,
  acaoPrimaria: Object,
  acaoSecundaria: Object
})
</script>

<style scoped>
.modalFundo {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modalConteudo {
  background-color: white;
  border-radius: 8px;
  padding: 32px 24px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 20px;
}

.modalAcoes {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modalIcone {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
  background-color: #ffe6cc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modalIcone img {
  width: 24px;
  height: 24px;
}

.modalMensagem {
  font-size: 18px;
  font-weight: 600;
  color: #14141f;
  margin-bottom: 10px;
  line-height: 1.4;
}

.modalBotao {
  background: linear-gradient(to right, #f8a953, #d48946);
  border: none;
  border-radius: 24px;
  padding: 14px 24px;
  color: white;
  font-size: 16px;
  font-weight: 50;
  width: 70%;
  transition: opacity 0.3s;
  justify-content: center;
}

.modalBotao:hover {
  opacity: 0.9;
}

.modalLink {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: #f39a2c;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
