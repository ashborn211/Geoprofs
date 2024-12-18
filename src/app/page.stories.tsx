import type { Meta, StoryObj } from '@storybook/react';

import Page from './page';

const meta = {
  component: Page,
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};