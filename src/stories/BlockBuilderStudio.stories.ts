import type { Meta, StoryObj } from '@storybook/vue3';
import BlockBuilderStudio from '@/components/BlockBuilderStudio.vue';
BlockBuilderStudio;

const meta = {
  title: 'Components/BlockBuilderStudio',
  component: BlockBuilderStudio,
} satisfies Meta<typeof BlockBuilderStudio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
