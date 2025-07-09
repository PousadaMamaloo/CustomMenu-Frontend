<template>
    <BaseCard>
        <div class="iconeContainer">
            <span class="iconePrincipal mdi mdi-account-circle"></span>
        </div>
        <div class="informacoesHospede">
            <p class="nomeHospede">{{ hospede.nome_hospede }}</p>
            <div class="contatoHospede">
                <span class="iconeContato mdi mdi-phone"></span>
                <p class="infoContato">{{ hospede.telef_hospede }}</p>
            </div>
            <div class="quartoHospede">
                <span class="iconeQuarto mdi mdi-email"></span>
                <p class="infoQuarto">Email: {{ hospede.email_hospede || 'N/A' }}</p>
            </div>
            <div class="quartoHospede">
                <span class="iconeQuarto mdi mdi-calendar"></span>
                <p class="infoQuarto">Data de Check-in: {{ hospede.data_chegada || 'N/A' }} Data de Check-out: {{
                    hospede.data_saida || 'N/A' }}</p>
            </div>
        </div>
        <div class="editarContainer">
            <botaoEditar @click="irParaEditar" />
        </div>
    </BaseCard>
</template>

<script setup>
import { useRouter } from 'vue-router';
import BaseCard from './BaseCard.vue'
import botaoEditar from '/src/components/botoes/botaoEditar.vue'

const props = defineProps({
    hospede: {
        type: Object,
        required: true
    }
})

const router = useRouter();

function irParaEditar() {
    // Navega para a rota de edição, passando o ID do hóspede.
    router.push(`/admin/hospedes/editar/${props.hospede.id_hospede}`);
}
</script>

<style scoped>
/* Estilos adaptados do CardQuarto para consistência */
.baseCard,
.BaseCard {
    display: flex;
    align-items: center;
    flex: 1 1 350px;
    max-width: 400px;
    min-width: 350px;
    box-sizing: border-box;
    margin-bottom: 0;
    gap: 18px;
}

.iconeContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 74px;
    height: 66px;
}

.iconePrincipal {
    font-size: 56px;
    color: #c5c5c5;
}

.informacoesHospede {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    flex: 1;
}

.nomeHospede {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
}

.contatoHospede {
    display: flex;
    align-items: center;
    gap: 4px;
}

.iconeContato {
    font-size: 14px;
    color: #78828A;
}

.infoContato {
    font-size: 12px;
    font-weight: 500;
    color: #78828A;
    margin: 0;
}

.quartoHospede {
    display: flex;
    align-items: center;
    gap: 4px;
}

.iconeQuarto {
    font-size: 14px;
    color: #78828A;
}

.infoQuarto {
    font-size: 12px;
    font-weight: 500;
    color: #78828A;
    margin: 0;
}

.editarContainer {
    margin-left: auto;
    display: flex;
    align-items: center;
}
</style>