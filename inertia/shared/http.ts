import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: window.location.origin,
  withCredentials: true,
})

function httpClientWrapper(client: AxiosInstance) {
  const cancellableRequests = new Map<string, AbortController>()

  return function resource(path: string, id?: string | number) {
    let resourcePath = path
    if (id) resourcePath = `${path}/${id}`
    const config: AxiosRequestConfig = {
      url: resourcePath,
    }
    return {
      getCancellableQueue(uniqKey: string): AbortController | Map<string, AbortController> {
        if (uniqKey) return cancellableRequests!.get(uniqKey)!
        return cancellableRequests
      },
      query(params: object) {
        config.params = params
        return this
      },
      cancellable(uniqKey: string) {
        if (cancellableRequests.has(uniqKey)) {
          const prevController = cancellableRequests.get(uniqKey) as AbortController
          prevController.abort()
        }

        const controller = new AbortController()
        config.signal = controller.signal
        cancellableRequests.set(uniqKey, controller)

        return this
      },
      async get<T>(): Promise<T> {
        config.method = 'GET'
        return client(config) as Promise<T>
      },
      post<T>(data: object): Promise<T> {
        config.method = 'POST'
        config.data = data
        return client(config)
      },
      put<T>(data: object): Promise<T> {
        config.method = 'PUT'
        config.data = data
        return client(config)
      },
      patch<T>(data: any): Promise<T> {
        config.method = 'PATCH'
        config.data = data
        return client(config)
      },
      delete<T>(resourceId?: string | number): Promise<T> {
        if (resourceId) config.url = `${config.url}/${resourceId}`
        config.method = 'DELETE'
        return client(config)
      },
      upload<T>(data: Record<string, any>): Promise<T> {
        const keys = Object.keys(data)
        if (!keys.some((key) => data[key] instanceof File))
          throw new Error('Payload must include a file.')

        const formData = new FormData()

        keys.forEach((key) => {
          const value = data[key]
          formData.append(key, value)
        })

        config.data = formData
        config.method = 'POST'

        config.headers = {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        }

        return client(config)
      },
    }
  }
}

export default (path: string) => httpClientWrapper(axiosInstance)(path)
