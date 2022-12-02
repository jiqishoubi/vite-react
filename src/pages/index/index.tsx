import React, { useEffect } from 'react'
import { Button, Table } from 'antd'
import { IndexedDB, useIndexedDB } from '@/indexedDB/core'
import db_business_config from '@/indexedDB/db/business'

const db_business = new IndexedDB(db_business_config)
console.log('🚀 ~ db_business', db_business)

const Index: React.FC = () => {
  function handleAdd() {
    db_business.add('staff', { name: '佟舟', age: '18' }).then((record) => {
      console.log('🚀 ~ ', record)
    })
  }
  function handleInfo() {
    db_business.getById('staff', 1).then((record) => {
      console.log('🚀 ~ ', record)
    })
  }
  return (
    <>
      <Button onClick={handleAdd}>新建一个员工</Button>
      <Button onClick={handleInfo}>根据id查询</Button>
      <Table />
    </>
  )
}
export default Index
