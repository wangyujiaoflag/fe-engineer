import { get } from './http/request'

export interface UserInfo {
  id: string
  name: string
  email: string
  avatar: string
}

export const getUserProfile: Promise<UserInfo> = get('/user/profile')
