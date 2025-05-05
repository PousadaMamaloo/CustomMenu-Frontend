<template>
    <div>
        <Header />
        <main>
            <router-view />
        </main>
    </div>
</template>

<script>
import Header from '@/components/Cabecalho.vue';

export default {
    name: 'FullLayout',
    components: {
        Header,
    },
};
</script>