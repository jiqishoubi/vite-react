import React, { useEffect } from 'react'
import { Table } from 'antd'
import { IndexedDB } from '@/indexedDB/core'
import db_business_config from '@/indexedDB/db/business'

const db_business = new IndexedDB(db_business_config)

const Index: React.FC = () => {
  return (
    <>
      <Table />
    </>
  )
}
export default Index
