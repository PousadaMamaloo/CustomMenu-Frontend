<script setup>
import { ref, computed, watchEffect } from 'vue'

const props = defineProps({
  quartos: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:quartosFiltrados'])

const filtroAtivo = ref('TODOS')

function definirFiltro(status) {
  filtroAtivo.value = status
}
    
const quartosFiltrados = computed(() => {
  const filtro = filtroAtivo.value
  if (filtro === 'TODOS') {
    return props.quartos
  }
  if (filtro === 'LIVRE') {
    return props.quartos.filter(quarto => quarto.qtdHospedes === 0)
  }
  if (filtro === 'OCUPADO') {
    return props.quartos.filter(quarto => quarto.qtdHospedes > 0)
  }
  return props.quartos
})

watchEffect(() => {
  emit('update:quartosFiltrados', quartosFiltrados.value)
})
</script>