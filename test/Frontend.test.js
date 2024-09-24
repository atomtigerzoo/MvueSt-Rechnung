import { expect, test } from 'vitest'
import { mount } from "@vue/test-utils"

/*
    This file is comments heavily for learning purposes 😬
*/

import App from "../src/App.vue"

// Import the EntryRow Component so I can use it to find/match
// it inside the mounted App
import EntryRow from "../src/components/EntryRow.vue"

test('a simple one row 19% tax rate calculation', async () => {
    const wrapper = mount(App)

    // Find first EntryRow component input field
    const userNetInput = wrapper.findComponent(EntryRow).find('input[name="userNet"]')

    // default 19% tax rate is set inside App
    await userNetInput.setValue('100') // set the userNet input to 100
    await userNetInput.trigger('input')

    const userGrossNet = wrapper.find('#grossNet') // this field only exists once
    expect(userGrossNet.element.value).toBe("100,00")

    const grossTaxes = wrapper.find('#grossTaxes-19')
    expect(grossTaxes.element.value).toBe("19,00")

    expect(wrapper.find('#grossTotal').element.value).toBe("119,00")
})


test('add entryRow button exists, can create new rows - but not more than 10', async () => {
    const wrapper = mount(App, {
        attachTo: document.body
    })

    // Find all EntryRow components inside App
    let entryRows = wrapper.findAllComponents(EntryRow)
    // But only one row exists on load
    expect(entryRows.length).to.be.equal(1)
    
    // Find the button which should add more rows
    const addRowButton = wrapper.find('button[name="addEntryRow"]')
    expect(addRowButton.exists()).to.be.true
    // Trigger a click
    await addRowButton.trigger('click')

    // Again, find all EntryRow components inside App
    entryRows = wrapper.findAllComponents(EntryRow)
    // But this time we should have 2
    expect(entryRows.length).to.be.equal(2)

    await addRowButton.trigger('click')
    await addRowButton.trigger('click')
    await addRowButton.trigger('click')
    await addRowButton.trigger('click')
    await addRowButton.trigger('click')
    await addRowButton.trigger('click')
    await addRowButton.trigger('click')
    await addRowButton.trigger('click')

    // After above clicks, there should be 10 rows by now
    entryRows = wrapper.findAllComponents(EntryRow)
    expect(entryRows.length).to.be.equal(10)

    // 11th click
    await addRowButton.trigger('click')

    // But there should still be only 10 entries
    entryRows = wrapper.findAllComponents(EntryRow)
    expect(entryRows.length).to.be.equal(10)
})

test.todo('multiple tax rates')

// test('7% tax rate calculation', async () => {
//     const wrapper = mount(App)

//     const userNetInput = wrapper.find('input[name="userNet"]')
//     await userNetInput.setValue('100')
//     await userNetInput.trigger('input')
    
//     const taxrateSelect = wrapper.find('select[name="taxRate"]')
//     await taxrateSelect.setValue('7')
//     await taxrateSelect.trigger('change')

//     const userGrossInput = wrapper.find('input[name="userGross"]')
//     expect(userGrossInput.element.value).toBe("107,00")

//     expect(wrapper.find('span[name="userGrossHuman"]').element.textContent).toBe("107,00 €")
// })


// test('tax from gross calculation with default 19% tax rate', async () => {
//     const wrapper = mount(App)

//     const userGrossInput = wrapper.find('input[name="userGross"]')
//     await userGrossInput.setValue('69,99')
//     await userGrossInput.trigger('input')

//     const userNetInput = wrapper.find('input[name="userNet"]')
//     expect(userNetInput.element.value).toBe("58,82")
    
//     expect(wrapper.find('span[name="userGrossHuman"]').element.textContent).toBe("69,99 €")
//     expect(wrapper.find('span[name="userNetHuman"]').element.textContent).toBe("58,82 €")
//     expect(wrapper.find('span[name="taxAmountHuman"]').element.textContent).toBe("11,17 €")
// })