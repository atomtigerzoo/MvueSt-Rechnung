<script setup>
/*
 * Component for displaying gross amounts inside readonly input fields
 */

import { computed } from 'vue'

const props = defineProps({
  inputValue: String,
  inputName: String,
  label: String,
  disableInputs: Boolean
})

const inputDisabledObject = computed(() => ({
  'bg-zinc-100 border-transparent': props.disableInputs === true
}))
</script>

<template>
  <div class="mb-3 mr-3 flex justify-end space-x-2 md:mr-0">
    <div class="flex justify-end items-center">
      <label :for="inputName" class="text-neutral-500 text-xs text-right whitespace-nowrap">{{ label }}</label>
    </div>
    <div class="flex justify-start items-center">
      <input
        class="pr-8 text-right w-32 md:w-48"
        readonly
        :value="inputValue"
        :id="inputName"
        :name="inputName"
        :readonly="disableInputs"
        :class="inputDisabledObject"
        >
      <span class="-ml-7 pl-2 text-lg text-neutral-700 font-semibold">&euro;</span>
    </div>
  </div>
</template>