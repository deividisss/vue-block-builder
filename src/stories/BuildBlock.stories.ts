import type { Meta, StoryObj } from '@storybook/vue3';
import BuildBlock from '@/components/BuildBlock.vue';

const meta = {
  title: 'Components/BuildBlock',
  component: BuildBlock,
} satisfies Meta<typeof BuildBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    msg: '1x',
  },
};
