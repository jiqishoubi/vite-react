import FetchSelect from '@/components/FetchSelect'
import { Form } from 'antd'
import React from 'react'
import './mock'

const Index: React.FC = () => {
  const [formRef] = Form.useForm()
  return (
    <Form form={formRef}>
      <Form.Item label="科室">
        <FetchSelect api="/api/getDepartList" valueKey="departCode" textKey="departName" style={{ width: 220 }} />
      </Form.Item>
    </Form>
  )
}
export default Index
