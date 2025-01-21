import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@mydapp/uiv2';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary'],
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 默认故事
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

// 次要按钮故事
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// 包含长文本的按钮
export const LongText: Story = {
  args: {
    variant: 'primary',
    children: 'This is a button with a very long text',
  },
};

// 包含其他元素的按钮
export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <span className="mr-2">🚀</span>
        Button with Icon
      </>
    ),
  },
};