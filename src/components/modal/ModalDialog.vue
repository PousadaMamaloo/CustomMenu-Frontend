<template>
  <div class="modalFundo">
    <div class="modalConteudo">
      <img :src="icone" alt="Ícone" class="modalIcone" />

      <p class="modalMensagem">{{ mensagem }}</p>

      <button v-if="acaoPrimaria" class="modalBotao" @click="acaoPrimaria.acao">
        {{ acaoPrimaria.texto }}
      </button>

      <button v-if="acaoSecundaria" class="modalLink" @click="acaoSecundaria.acao">
        {{ acaoSecundaria.texto }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mensagem: String,
  icone: String,
  acaoPrimaria: Object, // { texto: string, acao: function }
  acaoSecundaria: Object // opcional
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
  border-radius: 12px;
  padding: 32px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modalIcone {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.modalMensagem {
  font-size: 18px;
  font-weight: 600;
  color: #14141f;
  margin-bottom: 24px;
}

.modalBotao {
  background: linear-gradient(to right, #f8a953, #f39a2c);
  border: none;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 15px;
  color: white;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
}

.modalLink {
  margin-top: 16px;
  font-size: 14px;
  color: #f8a953;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
