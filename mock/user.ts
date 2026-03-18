import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

export default [
  {
    url: '/api/user/profile',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'ok',
        data: Mock.mock({
          id: '@id',
          name: '@cname',
          email: '@email',
          avatar: '@image("128x128", "#50B347", "#FFF", "avatar")',
        }),
      }
    },
  },
] as MockMethod[]
