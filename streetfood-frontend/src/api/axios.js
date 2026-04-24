import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor - token add pannum
api.interceptors.request.use(config => {
  const token = localStorage.getItem('sf_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - 401 handle pannum
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sf_token')
      localStorage.removeItem('sf_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api