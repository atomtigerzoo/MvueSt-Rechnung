<script setup>
/*
 * Component for displaying gross amounts inside readonly input fields
 */

defineProps({
  inputValue: String,
  inputName: String,
  inputPlaceholder: String
})

</script>

<template>
  <div class="flex justify-start items-center">
    <input
      class="grow pr-8 text-right"
      readonly
      :value="inputValue"
      :name="inputName"
      :placeholder="inputPlaceholder"
      >
      <span class="-ml-7 pl-2 text-lg text-neutral-700 font-semibold">&euro;</span>
  </div>
</template>