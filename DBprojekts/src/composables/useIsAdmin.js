// src/composables/useIsAdmin.js
import { computed } from 'vue'
import { useAuth } from './useAuth'

export function useIsAdmin() {
  const { userRole } = useAuth()
  const isAdmin = computed(() => userRole.value == 2)  // or '2', depending on your backend
  return { isAdmin }
}
