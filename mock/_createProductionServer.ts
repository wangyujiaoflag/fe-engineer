import { createProdMockServer } from 'vite-plugin-mock/client'
import userModule from './user'

export function setupProdMockServer() {
  createProdMockServer([...userModule])
}
