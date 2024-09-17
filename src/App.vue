<script setup>
import { ref, onMounted } from 'vue'
import currency from 'currency.js'

// User-given values
const userNet = ref()
const userGross = ref()
// Selectable tax amount, default 19
const taxValue = ref(19)
// Calculated tax amount
const taxAmount = ref(0)

// Which input was last used?
let lastUserInput = 'net'

function convertToCurrency(val) {
  return currency(val, { separator: ".", decimal: "," })
}

function calcTax(val, tax_rate) {
  return currency(val).multiply(tax_rate / 100)
}

function calcTaxFromGross(val, tax_rate) {
  return currency(val).multiply(tax_rate / 100).divide(1 + tax_rate / 100)
}

function convertToHumanAmount(val) {
  return currency(val, { separator: "", decimal: "," , symbol: "€", pattern: "# !"}).format()
}

function calculate() {
  lastUserInput = 'net'

  const money = convertToCurrency(userNet.value)
  taxAmount.value = calcTax(money, taxValue.value)
  userGross.value = currency(money).add(taxAmount.value)
}

function calculateNet() {
  lastUserInput = 'gross'

  const money = convertToCurrency(userGross.value)
  taxAmount.value = calcTaxFromGross(money, taxValue.value)
  userNet.value = currency(money).subtract(taxAmount.value)
}

function updateTaxValue() {
  if (lastUserInput === 'net') {
    calculate()
  } else {
    calculateNet()
  }
}

</script>

<template>
  <h1 class="text-xl font-bold">Mehrwertsteuer-Rechner</h1>
  <div class="mt-6">
    <div class="flex space-x-2">
      <input
        @input="calculate"
        v-model.trim="userNet"
        placeholder="Nettobetrag"
        >

      <span>&plus;</span>

      <select @change="updateTaxValue" v-model="taxValue">
        <option disabled>Bitte wählen&hellip;</option>
        <option value="7">7%</option>
        <option value="19">19%</option>
        <option value="20">20% (AT)</option>
      </select>

      <span>=</span>

      <input
        @input="calculateNet"
        v-model="userGross"
        placeholder="Bruttobetrag"
        >
    </div>
    
    <div class="mt-4 flex space-x-2 text-center">
      <div class="flex flex-col">
        <span>{{ convertToHumanAmount(userNet) }}</span>
        <span class="text-sm text-sky-700/80">Netto</span>
      </div>
      <div class="flex flex-col">
        <span>&plus;</span>
        <span></span>
      </div>
      <div class="flex flex-col">
        <span>{{ convertToHumanAmount(taxAmount) }}</span>
        <span class="text-sm text-sky-700/80">{{ taxValue }}% MwSt</span>
      </div>
      <div class="flex flex-col">
        <span>=</span>
        <span></span>
      </div>
      <div class="flex flex-col">
        <span>{{ convertToHumanAmount(userGross) }}</span> 
        <span class="text-sm text-sky-700/80">Brutto</span>
      </div>
    </div>

  </div>
</template>
