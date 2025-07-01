<template>
    <Loading v-if="authStore.isLoading" />
    <router-view v-else />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import Loading from '@/components/Loading.vue'

const authStore = useAuthStore()
</script>
