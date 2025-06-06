<template>
  <button class="historicoBtn" @click="$emit('click')">
    <span class="mdi mdi-history"></span>
    <span class="itemInfo">
      <span class="histTit">Consultar histórico de pedidos</span>
      <span class="histDesc">Veja seus pedidos anteriores e reaproveite-os</span>
    </span>
    <span class="mdi mdi-chevron-right"></span>
  </button>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
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

.historicoBtn:hover {
  background: #eeeeee;
}

.historicoBtn .mdi-history {
  font-size: 30px;
  margin-right: 8px;
  color: #222;
}

.itemInfo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  flex: 1;
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
</style>
