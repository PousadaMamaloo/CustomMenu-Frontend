<template>
    <div>
        <button class="botaoLinguas">
            <span class="mdi mdi-earth-plus"></span>
        </button>
    </div>

    <div class="containerLogin">
        <div class="conteudoLogin">
            <div>
                <img src="../../../assets/icons/MamalooPortalIcone.png" alt="Logo Mamaloo" class="logoInicial" />
            </div>
            
            <div class="cabecalhoLogin">
                <h1 class="tituloLogin">Bem-vindo</h1>
                <p class="textoLogin">
                    Escolha suas opções favoritas e tenha um café da manhã preparado especialmente para você!🍞🍓🍯
                </p>
            </div>

            <div class="formularioLogin">
                <div class="inputComIcone">
                    <span class="mdi mdi-key-outline iconeSpan"></span>
                    <input v-model="acesso" type="text" placeholder="Acesso" class="inputLogin" />
                </div>

                <div class="inputComIcone">
                    <span class="mdi mdi-lock-outline iconeSpan"></span>
                    <input v-model="senha" type="password" placeholder="Token" class="inputLogin" />
                </div>

                <button class="botaoEntrar" @click="entrar">
                    Entrar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const acesso = ref('')
const senha = ref('')

const entrar = () => {
    if (!acesso.value || !senha.value) {
        alert('Preencha todos os campos.')
        return
    }
    console.log('Acesso:', acesso.value)
    console.log('Senha:', senha.value)
}
</script>

<style scoped>
.botaoLinguas {
    all: unset;
    position: fixed;
    top: 16px;
    right: 16px;
    font-size: 24px;
    color: #333;
    cursor: pointer;
    z-index: 10;
}
.containerLogin {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 844px;
    /* ou 844px a depender da altura que a gente quiser levar em conta, no nosso figma tava 844*/
    background-color: #fffaf5;
    padding: 16px;
}

.conteudoLogin {
    width: 100%;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
}

.cabecalhoLogin {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
}

.logoInicial {
    width: 211px;
    height: 82px;
    top: 95px;
    left: 89px;
}

.tituloLogin {
    
    font-size: 20px;
    font-weight: 600;
    color: #333;
}

.textoLogin {
    font-size: 14px;
    color: #666;
}

.formularioLogin {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.inputComIcone {
    position: relative;
    display: flex;
    align-items: center;
}

.iconeSpan {
    position: absolute;
    left: 12px;
    font-size: 20px;
    color: #888;
}

.inputLogin {
    width: 327px;
    height: 56px;
    font-size: 16px;
    padding: 12px 12px 12px 40px;
    border-radius: 32px;
    border: 1px solid #ccc;
}

.botaoEntrar {
    width: 327px;
    height: 56px;
    padding: 19px 32px 19px 32px;
    background-color: #f8a953;
    color: white;
    font-size: 16px;
    font-weight: 600;
    border-radius: 32px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.botaoEntrar:hover {
    background-color: #ffaa33;
}
@media(min-width: 764px) {
    .containerLogin{
        width: 327px;
        height: 117px;
        top: 269px;
        left: 197px;
        border: 1px;
    }
    .conteudoLogin{
        width: 327px;
        height: 117px;
        top: 269px;
        left: 197px;
        border: 1px;
    }
    .logoInicial{
        width: 301px;
        height: 117px;
        top: 458px;
        left: 897px;
    }
}
</style>