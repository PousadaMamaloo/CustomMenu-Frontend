<template>
  <div class="cabecalhoContainer">
    <button class="cabecalhoBotaoLogo" @click="navegarParaInicio">
      <img src="../assets/icons/MamalooPortalIcone.png" alt="Logo Mamaloo" class="cabecalhoLogo" />
    </button>
    <button class="botaoLogoff" @click="executarLogout">
      <div class="containerIconeLogoff">
        <img src="../assets/images/logout.png" alt="Logout" class="logoutImg" />
      </div>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth';

const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();

function navegarParaInicio() {
  if (authStore.isAdmin) {
    router.push({ name: 'AdminDashboard' });
  } else {
    router.push({ name: 'HospedeHome' });
  }
}

async function executarLogout() {
  const result = await Swal.fire({
    title: 'Realizar Logout',
    text: `Você realmente deseja sair?`,
    icon: 'warning',
    showCancelButton: false,
    confirmButtonColor: '#DD7373',
    confirmButtonText: 'Sim, desejo sair!',
  });

  if (result.isConfirmed) {
    try {
      await authStore.logout();
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Ocorreu um erro ao tentar fazer logout.');
      console.error('Erro no componente ao executar logout:', error);
    }
  }
}
</script>

<style scoped>
.cabecalhoContainer {
  width: 100%;
  background-image: linear-gradient(#ffffff99, #ffffffe1), url('../assets/images/FundoCabecalho.png');
  background-size: auto;
  background-repeat: repeat-x;
  background-position: center;
  display: flex;
  justify-content: space-between;
  padding: 20px 20px;
}

.cabecalhoLogo {
  width: 80px;
  height: 30px;
}

.containerIconeLogoff {
  font-size: 27px;
}

.cabecalhoBotaoLogo,
.botaoLogoff {
  all: unset;
  display: flex;
  cursor: pointer;
}

.logoutImg {
  width: 30px;
  height: 30px;
}

.swal2-confirm {
  background-color: #DD7373 !important;
}

@media (min-width: 769px) {
  .cabecalhoContainer {
    padding: 20px 20px;
  }

  .cabecalhoBotaoLogo {
    margin-left: 80px;
  }

  .botaoLogoff {
    margin-right: 80px;
  }

  .cabecalhoLogo {
    width: 150px;
    height: 60px;
  }

  .containerIconeLogoff {
    font-size: 35px;
  }
}
</style>
