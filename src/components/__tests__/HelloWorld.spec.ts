import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import BuildBlock from '../BuildBlock.vue';

describe('BuildBlock', () => {
  it('renders properly', () => {
    const wrapper = mount(BuildBlock, { props: { msg: 'Hello Vitest' } });
    expect(wrapper.text()).toContain('Hello Vitest');
  });
});
