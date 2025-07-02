<template>
  <div class="observacoes">
    <h3>Observações</h3>
    <textarea 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Alguma observação especial para seu pedido?" 
      maxlength="300"
    ></textarea>
    <div class="contadorCaracteres">{{ modelValue.length }}/300</div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.observacoes {
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}
.observacoes h3 {
  margin: 0 0 12px 0;
}
.observacoes textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  resize: vertical;
  box-sizing: border-box;
}
.contadorCaracteres {
  text-align: right;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}
</style>
