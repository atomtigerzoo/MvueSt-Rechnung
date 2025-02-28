<script setup>
import { ref, computed, nextTick, registerRuntimeCompiler } from 'vue'
import currency from 'currency.js'

import EntryRow from './components/EntryRow.vue'
import GrossField from './components/GrossField.vue'


const disableInputs = ref(false)


const taxRates = [
  "7",
  "19"
]
const taxRateDefault = "19"

// const outputFormatFullMoney = { separator: "", decimal: "," , symbol: "€", pattern: "# !"}
const outputFormatFullMoney = { separator: "", decimal: "," , symbol: ""}

function convertToCurrency(val) {
  return currency(val, { separator: ".", decimal: "," })
}

function calcTax(val, tax_rate) {
  return currency(val).multiply(tax_rate / 100)
}

function convertToHumanAmount(val) {
  return currency(val, outputFormatFullMoney).format()
}


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
 * grossTaxes is the tax sum of all entries
 */
const grossTaxes = computed(() => {
  let taxResult = {
    [taxRateDefault]: currency(0)
  }

  entryRows.value.forEach((entryRow) => {
    let value = convertToCurrency(entryRow.entryNet)
    let tax = calcTax(value, entryRow.taxRate)
    taxResult[entryRow.taxRate] = currency(taxResult[entryRow.taxRate]).add(tax)
  })

  return taxResult
})


/**
 * grossTotal sums up all taxes from grossTaxes object
 */
const grossTotal = computed(() => {
  let taxes;

  for (let t in grossTaxes.value) {
    taxes = currency(taxes).add(grossTaxes.value[t])
  }

  return currency(grossNet.value).add(taxes)
})


/**
 * Set of tax rates used in the form
 */
const taxRatesUsed = computed(() => {
  return [...new Set(entryRows.value.map((entryRow) => entryRow.taxRate))]
    .sort((a, b) => a - b)
})


/* A ref that contains all the entryRow components */
const entryRowsRef = ref()

/**
 * The entryRows data is an array of objects 
 * containing the tax rate and the net amount
 * of all entries
 */
let entryRowsId = 1;
const entryRows = ref([
  {id: entryRowsId, taxRate: taxRateDefault, entryNet: ''},
])


/**
 * Creates a new entry row and focuses the input field
 */
async function addEntryRow() {
  if (entryRows.value.length >= 10) {
    // Message is shown in UI, return only
    return;
  }

  entryRowsId++;
  entryRows.value.push({id: entryRowsId, taxRate: taxRateDefault, entryNet: ''})

  
  await nextTick()
  
  const addedRow = entryRowsRef.value.lastElementChild
  addedRow.querySelector('input[name="entry-service"]').focus()
}

/**
 * Removes an entry row from the entryRows array given its id
 * @param {number} id The id of the entry row to remove
 */
async function removeEntryRow(id) {
  // Return filtered array without the given entry matching the entryRow.id
  entryRows.value = entryRows.value.filter(entryRow => entryRow.id !== id)

  await nextTick()

  // If there are no more entries, add a new one
  if (entryRows.value.length === 0) {
    addEntryRow()
  }
}
</script>

<template>
  <h1 class="mb-4 text-3xl text-center text-stone-800 font-mono font-semibold md:mb-0">Web-Rechnungsvorlage</h1>

  <div class="pb-1 text-center md:text-right">
    <label class="inline-flex items-center cursor-pointer">
      <span class="mr-3 text-sm font-medium text-gray-600">Eingaben sperren</span>
      <input v-model="disableInputs" type="checkbox" class="sr-only peer">
      <div class="
        relative w-11 h-6 bg-gray-200 rounded-full peer
        peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500
        peer-checked:after:translate-x-full peer-checked:after:border-white
        after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300
        after:border after:rounded-full after:h-5 after:w-5 after:transition-all
        peer-checked:bg-pink-700"></div>
    </label>
  </div>

  <div class="py-8 px-4 bg-white border-4 border-stone-300 md:rounded-lg max-md:border-l-0 max-md:border-r-0 md:p-8">
    <!-- This is the container for the EntryRow ref wrapper -->
    <div ref="entryRowsRef" class="space-y-3">
      <EntryRow
        v-for="entryRow in entryRows"
        :key="entryRow.id"
        :tax-rates="taxRates"
        :disableInputs="disableInputs"
        v-model:tax-rate="entryRow.taxRate"
        v-model:entry-net="entryRow.entryNet"
        @removeEntry="removeEntryRow(entryRow.id)"
        ></EntryRow>
    </div>

    <div class="my-4 text-center lg:mb-0">
      <button
        v-if="entryRows.length < 10"
        @click="addEntryRow"
        name="addEntryRow"
        class="mx-auto size-6 bg-neutral-100 rounded-full flex justify-center items-center"
        type="button">
          <span class="-mt-1 text-lg text-neutral-500 font-semibold">&plus;</span>
      </button>
      <span v-else class="text-xs italic text-neutral-500">
        Max. 10 Einträge möglich
      </span>
    </div>

    <GrossField :inputValue="convertToHumanAmount(grossNet)" :disableInputs="disableInputs" inputName="grossNet" label="Gesamt Netto" />

    <GrossField
      v-for="rate in taxRatesUsed"
      :inputValue="convertToHumanAmount(grossTaxes[rate])"
      :inputName="`grossTaxes-${rate}`"
      :label="`Steuern (${rate}%)`"
      :disableInputs="disableInputs"
      />
    
    <GrossField :inputValue="convertToHumanAmount(grossTotal)" :disableInputs="disableInputs" inputName="grossTotal" label="Gesamt Brutto" />
  </div>
</template>
