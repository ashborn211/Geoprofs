import type { Meta, StoryObj } from '@storybook/react';

import ResetPasswordForm from './ResetPasswordForm';

const meta = {
  component: ResetPasswordForm,
} satisfies Meta<typeof ResetPasswordForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};