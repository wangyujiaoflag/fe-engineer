import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '@/views/HelloWorld.vue'

vi.mock('@/api/user', () => ({
  getUserProfile: vi.fn(),
}))

describe('HelloWorld', () => {
  beforeEach(() => {
    // 每个测试前重置 mock 状态，避免测试间相互影响
    vi.clearAllMocks()
  })

  it('initial count', () => {
    const wrapper = mount(HelloWorld)

    expect(wrapper.get('button.counter').text()).toContain('Count is 0')
  })

  it('increments count when button is clicked', async () => {
    const wrapper = mount(HelloWorld)

    await wrapper.get('button.counter').trigger('click')
    expect(wrapper.get('button.counter').text()).toContain('Count is 1')
  })
})
