<template>
  <div class="containerCarregamento">
    <div class="animacaoCarregamento"></div>
    <p>Carregando...</p>
  </div>
</template>

<style scoped>
.containerCarregamento {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.animacaoCarregamento {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #f8a953;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
