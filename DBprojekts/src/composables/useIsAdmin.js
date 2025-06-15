
import { computed } from 'vue'
import { useAuth } from './useAuth'

export function useIsAdmin() {
  const { userRole } = useAuth()
  const isAdmin = computed(() => userRole.value == 2)  
  return { isAdmin }
}
