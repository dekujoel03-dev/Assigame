import axios from 'axios'
import { API_BASE_URL } from '@/lib/apiConfig'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('assigame_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const requestUrl = error.config?.url ?? ''
      const isAuthRoute = window.location.pathname.startsWith('/connexion')
        || window.location.pathname.startsWith('/inscription')
      const isSessionCheck = requestUrl.includes('/auth/me')
      if (!isAuthRoute && !isSessionCheck) {
        localStorage.removeItem('assigame_token')
        localStorage.removeItem('assigame_user')
        window.location.href = '/connexion'
      }
    }
    return Promise.reject(error)
  },
)

export default api
