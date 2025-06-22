import { describe, it, expect } from 'vitest'
import Table from './Table.vue'
import { mount } from '@vue/test-utils'

describe('Table', () => {
  it('renders correctly', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { label: 'Name', key: 'name' },
          { label: 'Email', key: 'email' },
        ],
        data: [
          { name: 'John Doe', email: 'john@example.com' },
          { name: 'Jane Doe', email: 'jane@example.com' },
        ],
      },
    })
    const thead = wrapper.find('thead')
    expect(thead.exists()).toBe(true)
    const tbody = wrapper.find('tbody')
    expect(tbody.exists()).toBe(true)

    const th = thead.findAll('th')
    expect(th.length).toBe(2)
    expect(th[0].text()).toBe('Name')
    expect(th[1].text()).toBe('Email')

    const td = tbody.findAll('td')
    expect(td.length).toBe(4)
    expect(td.at(0)?.text()).toBe('John Doe')
    expect(td.at(1)?.text()).toBe('john@example.com')
    expect(td.at(2)?.text()).toBe('Jane Doe')
    expect(td.at(3)?.text()).toBe('jane@example.com')
  })
})
