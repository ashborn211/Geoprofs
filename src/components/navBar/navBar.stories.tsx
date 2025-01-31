import type { Meta, StoryObj } from '@storybook/react';
import { UserProvider } from "@/context/UserContext";

import NavBar from './navBar';

const meta = {
  decorators: [
    (Story) => (
      <UserProvider>
        <Story />
      </UserProvider>
    ),
  ],
  component: NavBar,
} satisfies Meta<typeof NavBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};