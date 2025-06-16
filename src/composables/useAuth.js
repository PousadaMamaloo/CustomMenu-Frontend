import { reactive, readonly } from 'vue';
import router from '@/router'; // Import router for programmatic navigation if needed from here

const state = reactive({
  isAdminAuthenticated: false,
  isGuestAuthenticated: false,
});

function setAdminAuthenticated(value) {
  state.isAdminAuthenticated = value;
}

function setGuestAuthenticated(value) {
  state.isGuestAuthenticated = value;
}

function logoutAdmin() {
  setAdminAuthenticated(false);
  // Optionally, call a backend logout endpoint for admin
  // ApiServiceBase.post('/administrador/logout'); 
  router.push({ name: 'AdminLogin' }).catch(err => console.error('Router push error:', err));
}

function logoutGuest() {
  setGuestAuthenticated(false);
  // Optionally, call a backend logout endpoint for guest
  // ApiServiceBase.post('/hospede/logout');
  router.push({ name: 'HospedeLogin' }).catch(err => console.error('Router push error:', err));
}

// General logout if context is unknown or to clear all
function clearAllAuth() {
  state.isAdminAuthenticated = false;
  state.isGuestAuthenticated = false;
}

export function useAuth() {
  return {
    authState: readonly(state),
    setAdminAuthenticated,
    setGuestAuthenticated,
    logoutAdmin,
    logoutGuest,
    clearAllAuth,
  };
}