<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['apply', 'clear'])
const form = reactive({ query: '', topic: 'all' })

function apply() { emit('apply', { ...form }) }
function clear() {
  form.query = ''
  form.topic = 'all'
  emit('clear')
}
</script>

<template>
  <form class="mb-5 flex flex-wrap items-end gap-3 rounded bg-gray-100 p-4" @submit.prevent="apply" @reset.prevent="clear" @keydown.esc="clear">
    <label class="flex min-w-56 flex-1 flex-col gap-1 text-sm">Пошук
      <input v-model.trim="form.query" class="min-h-11 rounded border p-2" type="search" />
    </label>
    <label class="flex min-w-40 flex-col gap-1 text-sm">Тема
      <select v-model="form.topic" class="min-h-11 rounded border p-2">
        <option value="all">Усі теми</option><option value="vue">Vue</option><option value="javascript">JavaScript</option><option value="tools">Інструменти</option>
      </select>
    </label>
    <button class="min-h-11 rounded bg-green-700 px-4 text-white" type="submit">Застосувати</button>
    <button class="min-h-11 rounded border bg-white px-4" type="reset">Очистити</button>
  </form>
</template>
