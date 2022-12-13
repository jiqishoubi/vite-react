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

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  primary: true,
  label: 'FetchSelect',
}

export const Secondary = Template.bind({})
Secondary.args = {
  label: 'FetchSelect',
}

export const Large = Template.bind({})
Large.args = {
  size: 'large',
  label: 'FetchSelect',
}

export const Small = Template.bind({})
Small.args = {
  size: 'small',
  label: 'FetchSelect',
}
