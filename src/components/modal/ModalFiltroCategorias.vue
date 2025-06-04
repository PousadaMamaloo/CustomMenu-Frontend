<template>
    <Teleport to="body">
        <transition name="slideDown">
            <div v-if="aberto" class="filtroModalOverlay" @mousedown.self="fechar">
                <div class="filtroModalConteudo" :style="posicao">
                    <h2 class="tituloFiltro">Filtrar por:</h2>
                    <div class="grupoCategorias">
                        <label v-for="categoria in categorias" :key="categoria" class="labelCategoria">
                            <input type="checkbox" :value="categoria" v-model="selecionadasInterno"
                                class="checkboxCategoria" />
                            <span class="textoCategoria">{{ categoria }}</span>
                        </label>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
const props = defineProps({
    aberto: Boolean,
    categorias: Array,
    selecionadas: Array,
    anchor: [Object, null]
})
const emit = defineEmits(['update:selecionadas', 'close'])

const selecionadasInterno = ref([...props.selecionadas])
watch(() => props.selecionadas, v => selecionadasInterno.value = [...v])
watch(selecionadasInterno, v => emit('update:selecionadas', v), { deep: true })

function fechar() {
    emit('close')
}

const posicao = ref({})
const MODAL_WIDTH = 150 // px (ajuste conforme o seu CSS)

onMounted(() => {
    nextTick(() => {
        if (props.anchor) {
            const rect = props.anchor.getBoundingClientRect()
            posicao.value = {
                position: 'absolute',
                top: `${rect.bottom + window.scrollY + 6}px`,
                left: `${rect.right - MODAL_WIDTH + window.scrollX}px`,
                zIndex: 2000,
                width: `${MODAL_WIDTH}px`
            }
        }
    })
})
</script>

<style scoped>
.filtroModalOverlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: transparent;
}

.filtroModalConteudo {
    background: #fff;
    border-radius: 0 0 36px 36px;
    box-shadow: 0 4px 32px #0002;
    min-width: 150px;
    padding: 22px 32px 14px 32px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.tituloFiltro {
    font-size: 10px;
    margin-bottom: 5px;
    color: #828686;
}

.grupoCategorias {
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.labelCategoria {
    display: flex;
    align-items: center;
    gap: 14px;
}

.checkboxCategoria {
    appearance: none;
    width: 15px;
    height: 15px;
    border: 1px solid #DDDDE3;
    border-radius: 5px;
    background: transparent;
    cursor: pointer;
    margin: 0;
    position: relative;
    transition: border 0.2s;
}

.checkboxCategoria:checked {
    border: 1px solid #f8a953;
}

.checkboxCategoria:checked::after {
    content: '';
    width: 15px;
    height: 15px;
    background: #f8a953;
    border-radius: 5px;
    display: block;
}

.textoCategoria {
    font-size: 10px;
    font-weight: bold;
    color: #78828a;
}
</style>
