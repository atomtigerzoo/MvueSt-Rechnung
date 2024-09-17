<script setup>
import { ref, onMounted } from 'vue'
import currency from 'currency.js'

// User-given values
const userNet = ref()
const userGross = ref()
// Selectable tax rate, default 19
const taxRate = ref(19)
// Calculated tax amount
const taxAmount = ref(0)

// Which input was last used?
let lastUserInput = 'net'

const inputFieldCurrencyFormat = { separator: "", decimal: ",", symbol: ''}
const outputFormatFullMoney = { separator: "", decimal: "," , symbol: "€", pattern: "# !"}

function convertToCurrency(val) {
  return currency(val, { separator: ".", decimal: "," })
}

function calcTax(val, tax_rate) {
  return currency(val).multiply(tax_rate / 100)
}

function calcTaxFromGross(val, tax_rate) {
  return currency(val).subtract(currency(val).divide(1 + tax_rate / 100))
}

function convertToHumanAmount(val) {
  return currency(val, outputFormatFullMoney).format()
}

function calculate() {
  lastUserInput = 'net'

  const money = convertToCurrency(userNet.value)
  taxAmount.value = calcTax(money, taxRate.value)
  userGross.value = currency(money).add(taxAmount.value).format(inputFieldCurrencyFormat)
}

function calculateNet() {
  lastUserInput = 'gross'

  const money = convertToCurrency(userGross.value)
  taxAmount.value = calcTaxFromGross(money, taxRate.value)
  userNet.value = currency(money).subtract(taxAmount.value).format(inputFieldCurrencyFormat)
}

function updateTaxRate() {
  if (lastUserInput === 'net') {
    calculate()
  } else {
    calculateNet()
  }
}

</script>

<template>
  <div class="p-8 bg-white border-4 border-stone-300 md:rounded-lg max-md:border-l-0 max-md:border-r-0">
    <h1 class="mb-8 text-3xl text-center text-stone-800 font-mono font-semibold">Mehrwertsteuer-Rechner</h1>

    <div class="mx-auto flex justify-center items-center space-x-2 max-lg:flex-col">
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
    </div>
    
    <div class="mt-8 text-center">
      <h2 class="font-mono font-semibold text-lg text-stone-600">Detailrechnung</h2>
      <div class="mt-2 flex justify-center space-x-2 text-center text-lg">
        <div class="flex flex-col">
          <span name="userNetHuman">{{ convertToHumanAmount(userNet) }}</span>
          <span class="text-xs text-sky-700/80">Netto</span>
        </div>
        <div class="flex flex-col">
          <span>&plus;</span>
        </div>
        <div class="flex flex-col">
          <span name="taxAmountHuman">{{ convertToHumanAmount(taxAmount) }}</span>
          <span class="text-xs text-sky-700/80">{{ taxRate }}% MwSt</span>
        </div>
        <div class="flex flex-col">
          <span>=</span>
        </div>
        <div class="flex flex-col">
          <span name="userGrossHuman">{{ convertToHumanAmount(userGross) }}</span> 
          <span class="text-xs text-sky-700/80">Brutto</span>
        </div>
      </div>
    </div>

  </div>
</template>
