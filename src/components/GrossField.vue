<script setup>
/*
 * Component for displaying gross amounts inside readonly input fields
 */

defineProps({
  inputValue: String,
  inputName: String,
  label: String
})

</script>

<template>
  <div class="mb-3 grid grid-cols-12 gap-2">
    <div class="col-span-9 flex justify-end items-center">
      <label :for="inputName" class="text-neutral-500 text-xs text-right whitespace-nowrap">{{ label }}</label>
    </div>
    <div class="col-span-3 flex justify-start items-center">
      <input
        class="grow pr-8 text-right"
        readonly
        :value="inputValue"
        :id="inputName"
        :name="inputName"
        >
      <span class="-ml-7 pl-2 text-lg text-neutral-700 font-semibold">&euro;</span>
    </div>
  </div>
</template>