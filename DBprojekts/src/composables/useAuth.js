import { ref, computed } from 'vue'

const userRole = ref(localStorage.getItem('userRole') || null)
const userName = ref(localStorage.getItem('userName') || null)

// Derived reactive value
const isLoggedIn = computed(() => !!userRole.value)

export function useAuth() {
  function login(role, name) {
    userRole.value = role
    userName.value = name
    localStorage.setItem('userRole', role)
    localStorage.setItem('userName', name)
  }

  function logout() {
    userRole.value = null
    userName.value = null
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
  }

  return {
    userRole,
    userName,
    isLoggedIn,
    login,
    logout
  }
}
