import Mock from 'mockjs'

Mock.mock('/api/getDepartList', 'post', function () {
  return {
    code: '0',
    data: [
      { departName: '内科', departCode: 1 },
      { departName: '神经科', departCode: 2 },
      { departName: '外科', departCode: 3 },
    ],
  }
})
