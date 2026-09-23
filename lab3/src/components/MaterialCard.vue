<script setup>
defineProps({
  title: { type: String, required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  minutes: { type: Number, required: true },
  selected: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'edit', 'delete'])
</script>

<template>
  <article class="rounded border border-gray-300 p-4" :class="{ 'ring-2 ring-green-500': selected }">
    <div class="flex justify-between text-sm text-gray-500"><span>{{ topic }}</span><span>{{ minutes }} хв</span></div>
    <h3 class="mt-3 text-lg font-bold">{{ title }}</h3>
    <p class="my-3 min-h-12 text-gray-600">{{ description }}</p>
    <div class="flex flex-wrap gap-2">
      <button type="button" class="min-h-11 rounded border px-3" :aria-pressed="selected" @click="emit('select', title)">
        {{ selected ? 'Обрано' : 'Обрати' }}
      </button>
      <button type="button" class="min-h-11 rounded border px-3" @click="emit('edit')">Редагувати</button>
      <button type="button" class="min-h-11 rounded border border-red-300 px-3 text-red-700" @click="emit('delete')">Видалити</button>
    </div>
  </article>
</template>
