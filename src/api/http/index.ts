import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

const service = axios.create({
  baseURL,
  timeout: 10000,
})

export default service
