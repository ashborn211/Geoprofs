import type { Meta, StoryObj } from '@storybook/react';
import { db } from "@/FireBase/FireBaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Verlof from './verlof';
import { UserProvider } from '@/context/UserContext';
import { Timestamp } from "firebase/firestore";
import VerlofComponent from './verlof';


const meta = {
  decorators: [
    (Story) => (
      <UserProvider>
        <Story />
      </UserProvider>
    ),
    
  ],
  component: VerlofComponent,
} satisfies Meta<typeof VerlofComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedDate: new Date(),
    onClose: () => {},
  },
};