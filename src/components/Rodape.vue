<template>
    <div class="rodapeContainer">
        <div class="rodapeLogoRedesSociais">
            <div class="rodapeLogo">
                <img src="../assets/icons/MamalooPortalIcone.png" alt="Logo Mamaloo" class="rodapeLogo" />
            </div>

            <div class="rodapeRedesSociais">
                <button v-for="(botao, index) in botoes" :key="index" @click="abrirLink(botao.url)"
                    class="botaoRedeSocial">
                    <div v-if="botao.icone">

                        <span :class="botao.icone"></span>

                    </div>
                    <div class="alinhamentoLogoBooking" v-else>
                        <img class="tamanhoImagemBooking" src="../assets/images/logoBooking.png" :alt="botao.img.alt"
                            :class="botao.img.class">
                    </div>
                </button>
            </div>
        </div>


        <div class="rodapeTextos">
            <div class="rodapeTextoEsq">
                <p>Copyright © 2025</p>
            </div>
            <div class="rodapeTextoDir">
                <p>Design by | Mamaloo Menu</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const botoes = [
    {
        icone: 'mdi mdi-whatsapp',
        url: 'https://wa.me/5582981815454'
    },
    {
        icone: 'mdi mdi-instagram',
        url: 'https://www.instagram.com/mamaloopousada?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
    },
    {
        img: {
            alt: "Logo Booking",
            class: "bookingLogo",
        },
        url: 'https://www.booking.com/searchresults.pt-br.html?...'
    }
];

function abrirLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}
</script>


<style scoped>
.rodapeContainer {
    background-color: #FBFAFB;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.rodapeLogoRedesSociais {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.rodapeLogo {
    width: 60px;
    height: 23px;
}

.rodapeRedesSociais {
    display: flex;
    align-items: row;
    gap: 17px;
}

.botaoRedeSocial span {
    font-size: 22px;
}

.rodapeRedesSociais button {
    background: transparent;
    border: none;
    cursor: pointer;
}

.bookingLogo {
    width: 22px;
    height: 22px;
}

.rodapeTextos {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 0;
    border-top: 2px solid #e4e4e7;
}

.rodapeTextoEsq,
.rodapeTextoDir {
    font-size: 12px;
    color: grey;
}

.alinhamentoLogoBooking {
    display: flex;
    align-items: center;
    justify-content: center;
}

.tamanhoImagemBooking {
    width: 18px;
    height: 18px;
}

@media (min-width:769px) {
    .rodapeContainer {
        padding: 20px 80px;
    }

    .rodapeLogo {
        width: 124px;
        height: 50px;
    }

    .rodapeTextoEsq,
    .rodapeTextoDir {
        font-size: 14px;
        color: grey;
    }
}
</style>