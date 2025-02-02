import type { Meta, StoryObj } from '@storybook/react';

import PopUpForm from './pop-upForm';

const meta = {
  component: PopUpForm,
} satisfies Meta<typeof PopUpForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};