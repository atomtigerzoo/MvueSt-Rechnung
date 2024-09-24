<script setup>
/*
 * Component that displays a single entry row for user input
 */

defineEmits(['removeEntry'])

defineProps({
  taxRates: Array
})

const taxRate = defineModel('taxRate', {type: String, default: ''})
const entryNet = defineModel('entryNet', {type: String, default: ''})
</script>

<template>
  <div class="relative group -ml-7 pl-7">
      <div class="
        flex flex-col
        space-y-4
        md:flex-row md:justify-start md:items-start md:space-x-2 md:space-y-0
      ">
        <div class="grow">
          <input class="w-full" type="text" name="entry-service" placeholder="Leistung / Produkt">

          <div class="mt-1.5">
            <textarea class="w-full text-xs" rows="1" placeholder="Beschreibung" name="entry-description"></textarea>
          </div>
        </div>
        
        <div class="shrink-0 text-right pr-3 md:flex md:items-center md:pr-0">
          <select class="mr-4 md:w-full md:mr-2" v-model="taxRate" name="taxRate">
            <option
              v-for="rate in taxRates"
              :value="rate"
              :selected="rate === taxRate"
              >{{ rate }}%</option>
          </select>

          <input
            name="userNet"
            v-model.trim="entryNet"
            placeholder="Nettobetrag"
            class="w-32 pr-8 text-right lg:w-48"
            >
          <span class="-ml-7 pl-2 text-lg text-neutral-700 font-semibold">&euro;</span>
        </div>
      </div>

      <div class="
        absolute bottom-2
        md:bottom-1 md:-right-2
        lg:right-auto lg:-left-0 lg:top-2 lg:hidden
        group-hover:block
      ">
        <button
          @click="$emit('removeEntry')"
          name="removeEntry"
          class="group/button flex justify-center items-center mx-auto size-6 rounded-full bg-neutral-100 hover:bg-red-100"
          type="button">
            <span class="text-neutral-500 group-hover/button:text-red-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                <path fill-rule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clip-rule="evenodd" />
              </svg>
            </span>
        </button>
      </div>
  </div>
</template>