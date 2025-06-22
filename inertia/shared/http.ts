import axios from 'axios'

const http = axios.create({
  baseURL: window.location.origin,
  withCredentials: true,
})

export default http
