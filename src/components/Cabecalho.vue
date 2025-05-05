<template>
    <header class="cabecalho">
        <div class="cabecalho_container">
            <img src="@/assets/icons/MamalooPortal.png" alt="Logo Mamaloo" class="cabecalho_logo" />
            <div class="cabecalho_idiomas">
                <svg-icon type="mdi" :path="path"></svg-icon>/>
            </div>
        </div>
    </header>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiEarthPlus } from '@mdi/js';

export default {
    name: "Header",
    components: {
        SvgIcon,
    },
    data() {
        return {
            icon: mdiEarthPlus,
        };
    },
}
</script>

<style scoped>
.header {
    background-image: url('@/assets/images/FundoCabecalho.png');
    background-size: cover;
    background-repeat: no-repeat;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.cabecalho_logo {
    height: 40px;
}
.cabecalho_idiomas {
    background-color: #0066cc;
    color: white;
    font-weight: bold;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>