<script setup>
/*
 * Component that displays a single entry row for user input
 */

const taxRate = defineModel('taxRate', {type: String, default: '19'})
const entryNet = defineModel('entryNet', {type: String, default: ''})
</script>

<template>
  <div>
      <div class="grid grid-cols-12 gap-2">
        <input class="col-span-8" type="text" name="entry" placeholder="Leistung / Produkt">
        <select v-model="taxRate" name="taxRate">
          <option value="7">7%</option>
          <option value="19">19%</option>
          <option value="20">20% (AT)</option>
        </select>

        <div class="col-span-3 flex justify-start items-center">
          <input
            name="userNet"
            v-model.trim="entryNet"
            placeholder="Nettobetrag"
            class="grow pr-8 text-right"
            >
          <span class="-ml-7 pl-2 text-lg text-neutral-700 font-semibold">&euro;</span>
        </div>
      </div>
      <div class="mt-1.5 grid grid-cols-12 gap-2">
        <textarea class="col-span-8 text-xs" rows="1" placeholder="Beschreibung" name="entry-description"></textarea>
      </div>
  </div>
</template>