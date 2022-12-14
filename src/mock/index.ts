import Mock from 'mockjs'

//配置延迟
Mock.setup({
  timeout: '100-500',
})

interface IRes {
  code: '0'
  data: any
}

export function mockData(api: string, res: IRes) {
  Mock.mock(api, 'post', res)
}

// export default {
//   getUserInfo: () => mockData('/user/userInfo', require('./json/userInfo')),
// }
