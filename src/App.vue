<script setup>
import { ref, computed, nextTick } from 'vue'
import currency from 'currency.js'

import EntryRow from './components/EntryRow.vue'
import GrossField from './components/GrossField.vue'

// // User-given values
// const userNet = ref()
// const userGross = ref()
// // Calculated tax amount
// // const taxAmount = ref(0)

// // Which input was last used?
// let lastUserInput = 'net'

// const inputFieldCurrencyFormat = { separator: "", decimal: ",", symbol: ''}
const outputFormatFullMoney = { separator: "", decimal: "," , symbol: "€", pattern: "# !"}

function convertToCurrency(val) {
  return currency(val, { separator: ".", decimal: "," })
}

function calcTax(val, tax_rate) {
  return currency(val).multiply(tax_rate / 100)
}

// function calcTaxFromGross(val, tax_rate) {
//   return currency(val).subtract(currency(val).divide(1 + tax_rate / 100))
// }

function convertToHumanAmount(val) {
  return currency(val, outputFormatFullMoney).format()
}

// function calculate() {
//   lastUserInput = 'net'

//   const money = convertToCurrency(userNet.value)
//   // taxAmount.value = calcTax(money, taxRate.value)
//   // userGross.value = currency(money).add(taxAmount.value).format(inputFieldCurrencyFormat)
// }

// function calculateNet() {
//   lastUserInput = 'gross'

//   const money = convertToCurrency(userGross.value)
//   taxAmount.value = calcTaxFromGross(money, taxRate.value)
//   userNet.value = currency(money).subtract(taxAmount.value).format(inputFieldCurrencyFormat)
// }

// function updateTaxRate() {
//   if (lastUserInput === 'net') {
//     calculate()
//   } else {
//     calculateNet()
//   }
// }


/**
 * grossNet is the net sum of all entries
 */
const grossNet = computed(() => {
  let result = currency(0)
  
  entryRows.value.forEach((entryRow) => {
    let value = convertToCurrency(entryRow.entryNet)
    result = currency(result).add(value)
  })

  return result
})

/**
 * grossTax is the tax sum of all entries
 */
const grossTax = computed(() => {
  let taxResult = currency(0)
  
  entryRows.value.forEach((entryRow) => {
    let value = convertToCurrency(entryRow.entryNet)
    let tax = calcTax(value, entryRow.taxRate)
    taxResult = currency(taxResult).add(tax)
  })

  return taxResult
})


/**
 * grossTotal is the gross sum of all entries
 */
const grossTotal = computed(() => {
  return currency(grossNet.value).add(grossTax.value)
})


/**
 * The entryRows data is an array of objects 
 * containing the tax rate and the net amount
 * of all entries
 */
let entryRowsId = 1;
const entryRows = ref([
  {id: entryRowsId, taxRate: "19", entryNet: ''},
])


/**
 * Creates a new entry row and focuses the input field
 */
async function addEntryRow() {
  if (entryRows.value.length > 9) {
    alert('Max. 10 Zeilen erlaubt')
    return false;
  }

  entryRowsId++;
  entryRows.value.push({id: entryRowsId, taxRate: "19", entryNet: ''})

  await nextTick()

  // focus input on created entry
  document
    .getElementById(`entryRow-${entryRowsId}`)
    .querySelector('input[name="entry-service"]')
    .focus()
}

/**
 * Removes an entry row from the entryRows array given its id
 * @param {number} id The id of the entry row to remove
 */
function removeEntryRow(id) {
  // Return filtered array without the given entry matching the entryRow.id
  entryRows.value = entryRows.value.filter(entryRow => entryRow.id !== id)
}
</script>

<template>
  <h1 class="mb-8 text-3xl text-center text-stone-800 font-mono font-semibold">Web-Rechnungsvorlage</h1>

  <div class="p-8 bg-white border-4 border-stone-300 md:rounded-lg max-md:border-l-0 max-md:border-r-0">
    <div class="space-y-3">
      <EntryRow
        v-for="entryRow in entryRows"
        :key="entryRow.id"
        :id="`entryRow-${entryRow.id}`"
        v-model:tax-rate="entryRow.taxRate"
        v-model:entry-net="entryRow.entryNet"
        @removeEntry="removeEntryRow(entryRow.id)"
        ></EntryRow>
    </div>

    <div class="my-2 bg-neutral-200" v-for="(userData, index) in entryRows">
      <div>
        id: {{ userData.id }} | 
        userData.taxRate: {{ userData.taxRate }} | 
        userData.entryNet: {{ userData.entryNet }}
      </div>
    </div>

    <div class="mt-4 text-center">
      <button
        v-if="entryRows.length < 10"
        @click="addEntryRow"
        class="mx-auto size-6 bg-neutral-100 rounded-full flex justify-center items-center"
        type="button">
          <span class="-mt-1 text-lg text-neutral-500 font-semibold">&plus;</span>
      </button>
      <span v-else class="text-xs italic text-neutral-500">
        Max. 10 Einträge möglich
      </span>
    </div>

    <div class="grid grid-cols-12 gap-2">
      <div class="col-start-10 col-span-3 space-y-3">
        <GrossField :inputValue="convertToHumanAmount(grossNet)" inputName="grossNet" inputPlaceholder="Gesamt (Netto)" />

        <GrossField :inputValue="convertToHumanAmount(grossTax)" inputName="grossTax" inputPlaceholder="Gesamt (MwSt)" />

        <GrossField :inputValue="convertToHumanAmount(grossTotal)" inputName="grossTotal" inputPlaceholder="Gesamt (Brutto)" />
      </div>
    </div>

    <!-- <div class="mx-auto flex justify-center items-center space-x-2 max-lg:flex-col">
      <input
        name="userNet"
        @input="calculate"
        v-model.trim="userNet"
        placeholder="Nettobetrag"
        >

      <span class="text-lg">&plus;</span>

      <select @change="updateTaxRate" v-model="taxRate" name="taxRate">
        <option disabled>Bitte wählen&hellip;</option>
        <option value="7">7%</option>
        <option value="19">19%</option>
        <option value="20">20% (AT)</option>
      </select>

      <span class="text-lg">=</span>

      <input
        name="userGross"
        @input="calculateNet"
        v-model="userGross"
        placeholder="Bruttobetrag"
        >
    </div> -->

  </div>
</template>
