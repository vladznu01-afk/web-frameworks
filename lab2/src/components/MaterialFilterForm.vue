<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['apply', 'clear'])
const filterForm = reactive({ query: '', topic: 'all' })

function submitFilters() {
  emit('apply', { query: filterForm.query, topic: filterForm.topic })
}

function clearFilters() {
  filterForm.query = ''
  filterForm.topic = 'all'
  emit('clear')
}
</script>

<template>
  <form class="filters" @submit.prevent="submitFilters" @reset.prevent="clearFilters" @keydown.esc="clearFilters">
    <label class="filters__field">
      <span>Пошук за назвою</span>
      <input v-model.trim="filterForm.query" type="search" placeholder="Наприклад, реактивність" />
    </label>
    <label class="filters__field">
      <span>Тема</span>
      <select v-model="filterForm.topic">
        <option value="all">Усі теми</option>
        <option value="vue">Vue</option>
        <option value="javascript">JavaScript</option>
        <option value="tools">Інструменти</option>
      </select>
    </label>
    <div class="filters__actions">
      <button class="button button--primary" type="submit">Застосувати</button>
      <button class="button" type="reset">Очистити</button>
    </div>
  </form>
</template>
