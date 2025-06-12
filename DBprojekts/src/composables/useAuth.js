import { ref } from 'vue'

const isLoggedIn = ref(false)
const userId = ref(null)
const userName = ref('')
const userRole = ref(null)

export function useAuth() {
  function login({ id, name, role }) {
    isLoggedIn.value = true
    userId.value = id
    userName.value = name
    userRole.value = role
  }

  function logout() {
    isLoggedIn.value = false
    userId.value = null
    userName.value = ''
    userRole.value = null
  }

  return {
    isLoggedIn,
    userId,
    userName,
    userRole,
    login,
    logout
  }
}
