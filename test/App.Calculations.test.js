import { expect, test } from 'vitest'
import { mount } from "@vue/test-utils"
import currency from "currency.js"

import App from "../src/App.vue"

test('convertToCurrency method converts correctly', async () => {
    const wrapper = mount(App)

    // Full amounts
    let result = wrapper.vm.convertToCurrency('1')
    expect(result.intValue).toBe(100)

    result = wrapper.vm.convertToCurrency('10')
    expect(result.intValue).toBe(1000)

    result = wrapper.vm.convertToCurrency('10,0')
    expect(result.intValue).toBe(1000)

    result = wrapper.vm.convertToCurrency('10,00')
    expect(result.intValue).toBe(1000)

    // With cents
    result = wrapper.vm.convertToCurrency('100,50')
    expect(result.intValue).toBe(10050)

    result = wrapper.vm.convertToCurrency('100,5')
    expect(result.intValue).toBe(10050)

    result = wrapper.vm.convertToCurrency('100,05')
    expect(result.intValue).toBe(10005)

    result = wrapper.vm.convertToCurrency('100,001')
    expect(result.intValue).toBe(10000) // Round down

    result = wrapper.vm.convertToCurrency('100,005')
    expect(result.intValue).toBe(10001) // Round up

    result = wrapper.vm.convertToCurrency('0,05')
    expect(result.intValue).toBe(5)

    result = wrapper.vm.convertToCurrency('0,50')
    expect(result.intValue).toBe(50)

    result = wrapper.vm.convertToCurrency(',50')
    expect(result.intValue).toBe(50)
})


test('calcTax method calculates 19% tax correctly', async () => {
    const wrapper = mount(App)

    let result
    let taxRate = 19

    result = wrapper.vm.calcTax(1, taxRate)
    expect(result.intValue).toBe(19)

    result = wrapper.vm.calcTax('1', taxRate)
    expect(result.intValue).toBe(19)

    result = wrapper.vm.calcTax(10, taxRate)
    expect(result.intValue).toBe(190)

    result = wrapper.vm.calcTax(100, taxRate)
    expect(result.intValue).toBe(1900)

    result = wrapper.vm.calcTax(154, taxRate)
    expect(result.intValue).toBe(2926)

    result = wrapper.vm.calcTax('154.00', taxRate)
    expect(result.intValue).toBe(2926)

    result = wrapper.vm.calcTax('154.01', taxRate)
    expect(result.intValue).toBe(2926) // same as 154.00

    result = wrapper.vm.calcTax('154.03', taxRate)
    expect(result.intValue).toBe(2927)

    result = wrapper.vm.calcTax('154.06', taxRate)
    expect(result.intValue).toBe(2927) // same as 154.03

    result = wrapper.vm.calcTax('154.08', taxRate)
    expect(result.intValue).toBe(2928)

    result = wrapper.vm.calcTax(154.08, taxRate)
    expect(result.intValue).toBe(2928)
})


test('convertToHumanAmount method converts correctly', async () => {
    const wrapper = mount(App)

    let result

    result = wrapper.vm.convertToHumanAmount(currency(1))
    expect(result).toBe('1,00')
    expect(result).not.toBe('1.00 €')
    expect(result).not.toBe(100)

    result = wrapper.vm.convertToHumanAmount(currency('1.00'))
    expect(result).toBe('1,00')

    result = wrapper.vm.convertToHumanAmount(wrapper.vm.convertToCurrency('1,00'))
    expect(result).toBe('1,00')

    result = wrapper.vm.convertToHumanAmount(wrapper.vm.convertToCurrency('1,01'))
    expect(result).toBe('1,01')

    result = wrapper.vm.convertToHumanAmount(wrapper.vm.convertToCurrency(',5'))
    expect(result).toBe('0,50')

    result = wrapper.vm.convertToHumanAmount(wrapper.vm.convertToCurrency('0,50'))
    expect(result).toBe('0,50')

    result = wrapper.vm.convertToHumanAmount(wrapper.vm.convertToCurrency('101,52'))
    expect(result).toBe('101,52')
})
