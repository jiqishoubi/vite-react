import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import FetchSelect from '@/components/FetchSelect'

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
const Template: ComponentStory<typeof FetchSelect> = (args) => <FetchSelect {...args} />

export const Base = Template.bind({})
Base.args = {}
