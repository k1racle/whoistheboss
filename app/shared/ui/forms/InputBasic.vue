<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label: string
    name?: string
    type?: 'text' | 'tel' | 'email'
    autocomplete?: string
    required?: boolean
    minlength?: number
    placeholder?: string
  }>(),
  {
    name: undefined,
    type: 'text',
    autocomplete: undefined,
    required: false,
    minlength: undefined,
    placeholder: undefined,
  },
)

const model = defineModel<string>({ required: true })
const isFocused = ref(false)
const hasValue = computed(() => model.value.length > 0)
const isFloated = computed(() => isFocused.value || hasValue.value)
</script>

<template>
  <label class="relative block w-full">
    <span
      class="pointer-events-none absolute left-0 top-0 font-sans text-base leading-4 text-text-on-accent transition-all duration-200 ease-out"
      :class="isFloated ? '-translate-y-6 text-xs' : ''"
    >
      {{ label }}
    </span>
    <input
      v-model="model"
      :name="name"
      :type="type"
      :autocomplete="autocomplete"
      :required="required"
      :minlength="minlength"
      :placeholder="isFloated ? placeholder : undefined"
      class="h-[22px] w-full border-0 border-b-2 border-white bg-transparent p-0 font-sans text-base leading-4 text-text-on-accent outline-none placeholder:text-text-on-accent/50"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
  </label>
</template>
