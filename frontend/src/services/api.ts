import axios from 'axios'
import { getApiUrl } from '../utils/env'

const api = axios.create({
  baseURL: getApiUrl(),
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers?.set) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
