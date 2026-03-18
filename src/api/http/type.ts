export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface RequestConfig {
  showLoading?: boolean
  repeatRequestCancel?: boolean
}
