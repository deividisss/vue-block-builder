import BuildGrid from '@/components/BuildGrid.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Components/BuildGrid',
  component: BuildGrid,
  args: {
    // buildGridSize: 6,
  },
} satisfies Meta<typeof BuildGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    rowCount: 4,
    columnCount: 8,
  },
  name: '4x8',
};

export const Six: Story = {
  args: {
    rowCount: 2,
    columnCount: 3,
  },
  name: '2x3',
};

export const Four: Story = {
  args: {
    rowCount: 2,
    columnCount: 2,
  },
  name: '2x2',
};

export const ColumnCount: Story = {
  args: {
    columnCount: 4,
  },
  name: 'Collumn count',
};

export const RowCount: Story = {
  args: {
    rowCount: 2,
  },
  name: 'Row count',
};
