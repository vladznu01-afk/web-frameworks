<script setup>
import { computed, reactive, ref } from 'vue'
import MaterialCard from './MaterialCard.vue'
import MaterialFilterForm from './MaterialFilterForm.vue'
import { materials } from '../data/materials.js'

const activeFilters = reactive({ query: '', topic: 'all' })
const selectedTitle = ref(materials[0]?.title ?? '')

const filteredMaterials = computed(() => {
  const query = activeFilters.query.toLowerCase()
  return materials.filter((material) => {
    const byTitle = material.title.toLowerCase().includes(query)
    const byTopic = activeFilters.topic === 'all' || material.topic === activeFilters.topic
    return byTitle && byTopic
  })
})

const totalMinutes = computed(() =>
  filteredMaterials.value.reduce((sum, material) => sum + material.minutes, 0),
)

function applyFilters(filters) {
  activeFilters.query = filters.query
  activeFilters.topic = filters.topic
}

function clearFilters() {
  activeFilters.query = ''
  activeFilters.topic = 'all'
}

function selectMaterial(title) {
  selectedTitle.value = title
}
</script>

<template>
  <section class="catalog">
    <div class="catalog__heading">
      <div>
        <p class="eyebrow">Навчальні матеріали</p>
        <h2>Каталог матеріалів</h2>
      </div>
      <p>Обраний матеріал: <strong>{{ selectedTitle }}</strong></p>
    </div>

    <MaterialFilterForm @apply="applyFilters" @clear="clearFilters" />

    <div class="catalog__summary">
      <span>Знайдено: <strong>{{ filteredMaterials.length }}</strong></span>
      <span>Загальна тривалість: <strong>{{ totalMinutes }} хв</strong></span>
    </div>

    <div v-if="filteredMaterials.length" class="catalog__grid">
      <MaterialCard
        v-for="material in filteredMaterials"
        :key="material.id"
        v-bind="material"
        :selected="material.title === selectedTitle"
        @select="selectMaterial"
      />
    </div>
    <p v-else class="catalog__empty">За заданими умовами матеріалів немає.</p>
  </section>
</template>
