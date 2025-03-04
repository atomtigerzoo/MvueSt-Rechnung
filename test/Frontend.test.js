import { describe, expect, test } from 'vitest'
import { mount } from "@vue/test-utils"

/*
    This file is commented for learning purposes 😬
*/

import App from "../src/App.vue"

// Import the EntryRow Component so I can use it to find/match
// it inside the mounted App
import EntryRow from "../src/components/EntryRow.vue"

describe('input calculations', () => {
    test('one row 19% tax rate calculation', async () => {
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
    }),

    test('change from 19% to 7% updates the gross fields correctly', async () => {
        const wrapper = mount(App)
    
        // Find first EntryRow component input field
        const entryRow = wrapper.findComponent(EntryRow)
        const userNetInput = entryRow.find('input[name="userNet"]')
    
        // default 19% tax rate is set inside App
        await userNetInput.setValue('100') // set the userNet input to 100
        await userNetInput.trigger('input')
    
        const userGrossNet = wrapper.find('#grossNet') // this field only exists once
        const grossTaxes = wrapper.find('#grossTaxes-19')
        
        expect(userGrossNet.element.value).toBe("100,00")
        expect(grossTaxes.element.value).toBe("19,00")
        expect(wrapper.find('#grossTotal').element.value).toBe("119,00")
    
        const userTaxRate = entryRow.find('select[name="taxRate"]')
        await userTaxRate.setValue('7')
        await userTaxRate.trigger('change')
    
        expect(userTaxRate.element.value).toBe('7')
    
        expect(userGrossNet.element.value).toBe("100,00")
        expect(grossTaxes.element.value).toBe("7,00")
        expect(wrapper.find('#grossTotal').element.value).toBe("107,00")
    }),

    test('multiple tax rates', async () => {
        const wrapper = mount(App)

        await wrapper.vm.entryRows.push({id: 1, taxRate: '19', entryNet: '100'})
        await wrapper.vm.entryRows.push({id: 2, taxRate: '7', entryNet: '100'})
        await wrapper.vm.entryRows.push({id: 3, taxRate: '19', entryNet: '50'})

        expect(wrapper.find('#grossNet').element.value).toBe("250,00")
        expect(wrapper.find('#grossTaxes-7').element.value).toBe("7,00")
        expect(wrapper.find('#grossTaxes-19').element.value).toBe("28,50")
        expect(wrapper.find('#grossTotal').element.value).toBe("285,50")
    })
})


describe('entryRows', () => {
    test('add-button exists, can create new rows - but not more than 10', async () => {
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
    }),

    test('add new row, when all rows are deleted', async () => {
        const wrapper = mount(App, {
            attachTo: document.body
        })

        const entryRow = wrapper.findComponent(EntryRow)
        const removeButton = entryRow.find('button[name="removeEntry"]')
        
        // One row by default
        expect(wrapper.vm.entryRows.length).to.be.equal(1)
        
        // Remove this one entry
        await removeButton.trigger('click')

        // After removal there should be a new one created automatically
        expect(wrapper.vm.entryRows.length).to.be.equal(1)
    })
})
