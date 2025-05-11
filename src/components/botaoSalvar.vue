<template>
    <div class="campoBotao">
        <button type="submit" class="botaoSalvar">Salvar</button>
    </div>
</template>

<style scoped>
.campoBotao {
        grid-column: 1 / span 2;
        display: flex;
        justify-content: center;
}

.botaoSalvar {
    margin-top: 20px;
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 32px;
    background: linear-gradient(to right, #f8a953, #d48946);
    color: white;
    font-size: 18px;
}

@media (min-width: 769px) {
    .botaoSalvar {
        justify-self: end;
        width: 330px;
        margin-top: 24px;
    }
}
</style>