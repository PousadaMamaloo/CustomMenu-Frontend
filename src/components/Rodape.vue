<template>
    <div class="rodapeContainer">
        <div class="rodapeLogoRedesSociais">
            <div class="rodapeLogo">
                <img src="../assets/icons/MamalooPortalIcone.png" alt="Logo Mamaloo" class="rodapeLogo" />
            </div>
            <div class="rodapeRedesSociais">
                <button
                    @click="() => abrirLink('https://www.instagram.com/mamaloopousada?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==')">
                    <span class="mdi mdi-instagram"></span>
                </button>
                <button @click="() => abrirLink('https://wa.me/5582981815454')">
                    <span class="mdi mdi-whatsapp"></span>
                </button>
                <button @click="() => abrirLink('https://www.booking.com/searchresults.pt-br.html?aid=360920&label=New_Portuguese_PT_ROW_6409090206-_9oPl604g33uUPimd0_L7QS60966725406%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg&gclid=Cj0KCQjww-HABhCGARIsALLO6XwQPFRuZ6Osg7FZtvj4beJKj5rS2K_p6bMhXSRx-lUst4tuCne5gc0aAhJgEALw_wcB&highlighted_hotels=4429277&redirected=1&city=-652627&hlrd=no_dates&source=hotel&expand_sb=1&keep_landing=1&sid=d9b37cd3d94ec64b753f7db7ddd24139')">
                    <img src="../assets/icons/LogoBooking.png" alt="Logo Booking" class="bookingLogo" />
                </button>
            </div>
        </div>
        <div class="linhaSeparadora"></div>
        <div class="rodapeTextos">
            <div class="rodapeTextoEsq">
                <p>Copyright © 2025</p>
            </div>
            <div class="rodapeTextoDir">
                <p>Desing by | Mamaloo Menu </p>
            </div>
        </div>
    </div>
</template>

<script setup>
function abrirLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}
</script>

<style scoped>
.rodapeContainer {
    display: flex;
    min-height: 12vh;
    /* hexadecimal, para todos*/
    padding: 2vh 2vh;
    flex-direction: column;
    gap: 20px;

}

.rodapeLogoRedesSociais {
    display: flex;
    flex-direction: row;
    justify-content: space-between;


}

.linhaSeparadora {
    width: 100%;
    border-top: 1px solid #161b33;
    margin: 5px;
}

.rodapeLogo {
    width: 10vh;
    height: 4vh;
}


.rodapeRedesSociais {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin-right: 20px;
    gap: 100px;
}

.bookingLogo {
    width: 16px;
    height: 16px;
}

.rodapeTextos {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 20px;

}

.rodapeTextoEsq {
    font-family: 'Times New Roman', Times, serif;
}

.rodapeTextoDir {
    font-family: 'Times New Roman', Times, serif;

}
</style>