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
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 9999;
}

.animacaoCarregamento {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #f8a953;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

p {
  margin-top: 16px;
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
