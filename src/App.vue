<template>
    <Loading v-if="showLoading" />
    <router-view v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Loading from '@/components/Loading.vue'

const authStore = useAuthStore()
const route = useRoute()

// Não mostrar loading nas páginas de login
const showLoading = computed(() => {
    const isLoginPage = ['AdminLogin', 'HospedeLogin'].includes(route.name)
    return authStore.isLoading && !isLoginPage
})
</script>
