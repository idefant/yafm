import { Meta, StoryObj } from '@storybook/react';
import { CSSProperties } from 'react';

import { Grid } from './Grid';

const meta = {
  title: 'UI/Grid',
  component: Grid,
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const style: CSSProperties = {
  backgroundColor: 'var(--primary-button-color-darker)',
  padding: '12px 0',
  textAlign: 'center',
};

export const Size4: Story = {
  args: {
    gap: 16,
  },
  render: (props) => (
    <Grid {...props}>
      {[...new Array(6)].map((_, i) => (
        <Grid.Item size={4} key={i}>
          <div style={style}>size=4</div>
        </Grid.Item>
      ))}
    </Grid>
  ),
};

export const AnySizes: Story = {
  args: {
    gap: 8,
  },
  render: (props) => (
    <Grid {...props}>
      <Grid.Item size={1}>
        <div style={style}>size=1</div>
      </Grid.Item>
      <Grid.Item size={11}>
        <div style={style}>size=11</div>
      </Grid.Item>
      <Grid.Item size={2}>
        <div style={style}>size=2</div>
      </Grid.Item>
      <Grid.Item size={10}>
        <div style={style}>size=10</div>
      </Grid.Item>
      <Grid.Item size={3}>
        <div style={style}>size=3</div>
      </Grid.Item>
      <Grid.Item size={9}>
        <div style={style}>size=9</div>
      </Grid.Item>
      <Grid.Item size={4}>
        <div style={style}>size=4</div>
      </Grid.Item>
      <Grid.Item size={8}>
        <div style={style}>size=8</div>
      </Grid.Item>
      <Grid.Item size={5}>
        <div style={style}>size=5</div>
      </Grid.Item>
      <Grid.Item size={7}>
        <div style={style}>size=7</div>
      </Grid.Item>
      <Grid.Item size={6}>
        <div style={style}>size=6</div>
      </Grid.Item>
      <Grid.Item size={6}>
        <div style={style}>size=6</div>
      </Grid.Item>
      <Grid.Item size={1}>
        <div style={style}>size=1</div>
      </Grid.Item>
      <Grid.Item size={2}>
        <div style={style}>size=2</div>
      </Grid.Item>
      <Grid.Item size={4}>
        <div style={style}>size=4</div>
      </Grid.Item>
      <Grid.Item size={5}>
        <div style={style}>size=5</div>
      </Grid.Item>
    </Grid>
  ),
};

export const DifferentGaps: Story = {
  args: {
    columnGap: 8,
    rowGap: 16,
  },
  render: (props) => (
    <Grid {...props}>
      {[...new Array(6)].map((_, i) => (
        <Grid.Item size={4} key={i}>
          <div style={style}>size=4</div>
        </Grid.Item>
      ))}
    </Grid>
  ),
};

export const WithBreakpoints: Story = {
  args: {
    gap: 8,
  },
  render: (props) => (
    <Grid {...props}>
      {[...new Array(12)].map((_, i) => (
        <Grid.Item size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2, xxl: 1 }} key={i}>
          <div style={style}>size=?</div>
        </Grid.Item>
      ))}
    </Grid>
  ),
};

export const Reversed: Story = {
  args: {
    gap: 8,
    reversed: true,
  },
  render: (props) => (
    <Grid {...props}>
      <Grid.Item size={1}>
        <div style={style}>first</div>
      </Grid.Item>
      <Grid.Item size={2}>
        <div style={style}>second</div>
      </Grid.Item>
      <Grid.Item size={3}>
        <div style={style}>third</div>
      </Grid.Item>
    </Grid>
  ),
};
