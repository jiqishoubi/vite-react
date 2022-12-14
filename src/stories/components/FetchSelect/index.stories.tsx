import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import FetchSelect from '@/components/FetchSelect'
import { mockData } from '@/mock'
import { Button, Form } from 'antd'

mockData('/api/getDepartList', {
  code: '0',
  data: [
    { departName: '内科', departCode: 1 },
    { departName: '神经科', departCode: 2 },
    { departName: '外科', departCode: 3 },
  ],
})

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/FetchSelect',
  component: FetchSelect,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof FetchSelect>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FetchSelect> = (args) => {
  const [formRef] = Form.useForm()
  return (
    <Form form={formRef}>
      <Form.Item label="科室" name="departCode">
        <FetchSelect api="/api/getDepartList" valueKey="departCode" textKey="departName" mode="multiple" />
      </Form.Item>
      <Button
        onClick={() => {
          console.log('🚀 ~ ', formRef.getFieldsValue())
        }}
      >
        提交
      </Button>
    </Form>
  )
}

export const Base = Template.bind({})
Base.args = {
  // api: '/api/getDepartList',
  // valueKey: 'departCode',
  // textKey: 'departName',
  // mode: 'multiple',
}
