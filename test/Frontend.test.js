import { expect, test } from 'vitest'
import { mount } from "@vue/test-utils"

import App from "../src/App.vue"

test('default 19% tax rate calculation', async () => {
    const wrapper = mount(App)

    const userNetInput = wrapper.find('input[name="userNet"]')

    await userNetInput.setValue('100')
    await userNetInput.trigger('input')
    // default 19% tax rate

    const userGrossInput = wrapper.find('input[name="userGross"]')
    expect(userGrossInput.element.value).toBe("119,00")

    expect(wrapper.find('span[name="userGrossHuman"]').element.textContent).toBe("119,00 €")
})


test('7% tax rate calculation', async () => {
    const wrapper = mount(App)

    const userNetInput = wrapper.find('input[name="userNet"]')
    await userNetInput.setValue('100')
    await userNetInput.trigger('input')
    
    const taxrateSelect = wrapper.find('select[name="taxRate"]')
    await taxrateSelect.setValue('7')
    await taxrateSelect.trigger('change')

    const userGrossInput = wrapper.find('input[name="userGross"]')
    expect(userGrossInput.element.value).toBe("107,00")

    expect(wrapper.find('span[name="userGrossHuman"]').element.textContent).toBe("107,00 €")
})


test('tax from gross calculation with default 19% tax rate', async () => {
    const wrapper = mount(App)

    const userGrossInput = wrapper.find('input[name="userGross"]')
    await userGrossInput.setValue('69,99')
    await userGrossInput.trigger('input')

    const userNetInput = wrapper.find('input[name="userNet"]')
    expect(userNetInput.element.value).toBe("58,82")
    
    expect(wrapper.find('span[name="userGrossHuman"]').element.textContent).toBe("69,99 €")
    expect(wrapper.find('span[name="userNetHuman"]').element.textContent).toBe("58,82 €")
    expect(wrapper.find('span[name="taxAmountHuman"]').element.textContent).toBe("11,17 €")
})