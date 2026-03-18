import service from './index'
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from './type'

/**
 * 请求拦截
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/**
 * 响应拦截
 */
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data
    console.log(response, 'response')

    if (res.code !== 200) {
      console.error(res.message)

      return Promise.reject(res)
    }

    return res.data
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('登录过期')
          break

        case 403:
          console.error('没有权限')
          break

        case 500:
          console.error('服务器错误')
          break

        default:
          console.error(error.message)
      }
    }

    return Promise.reject(error)
  },
)

/**
 * 通用 request
 */
export const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service(config)
}

export const get = <T>(url: string, params?: any): Promise<T> => {
  return request<T>({
    url,
    method: 'get',
    params,
  })
}

export const post = <T>(url: string, data?: any): Promise<T> => {
  return request<T>({
    url,
    method: 'post',
    data,
  })
}

export const put = <T>(url: string, data?: any): Promise<T> => {
  return request<T>({
    url,
    method: 'put',
    data,
  })
}

export const del = <T>(url: string, params?: any): Promise<T> => {
  return request<T>({
    url,
    method: 'delete',
    params,
  })
}
