<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import MaterialCard from './MaterialCard.vue'
import MaterialFilterForm from './MaterialFilterForm.vue'
import ModalDialog from './ModalDialog.vue'
import { materials } from '../data/materials.js'

const items = ref(materials.map((material) => ({ ...material })))
const selectedId = ref(items.value[0]?.id ?? null)
const activeFilters = reactive({ query: '', topic: 'all' })
const isOpen = ref(false)
const mode = ref('edit')
const editingId = ref(null)
const draft = ref({ title: '', minutes: '' })
const error = ref('')
const nameInput = ref(null)
const cancelButton = ref(null)
const catalogHeading = ref(null)

const filteredMaterials = computed(() => {
  const query = activeFilters.query.toLowerCase()
  return items.value.filter((item) => item.title.toLowerCase().includes(query)
    && (activeFilters.topic === 'all' || item.topic === activeFilters.topic))
})
const totalMinutes = computed(() => filteredMaterials.value.reduce((sum, item) => sum + item.minutes, 0))
const selectedTitle = computed(() => items.value.find((item) => item.id === selectedId.value)?.title ?? 'немає')
const dialogTitle = computed(() => mode.value === 'edit' ? 'Редагування матеріалу' : 'Видалення матеріалу')
const editingItem = computed(() => items.value.find((item) => item.id === editingId.value))

function applyFilters(filters) { activeFilters.query = filters.query; activeFilters.topic = filters.topic }
function clearFilters() { activeFilters.query = ''; activeFilters.topic = 'all' }
function selectMaterial(title) { selectedId.value = items.value.find((item) => item.title === title)?.id ?? null }

async function openEdit(item) {
  mode.value = 'edit'; editingId.value = item.id; error.value = ''
  draft.value = { title: item.title, minutes: item.minutes }
  isOpen.value = true
  await nextTick(); nameInput.value?.focus()
}

async function openDelete(item) {
  mode.value = 'delete'; editingId.value = item.id; error.value = ''; isOpen.value = true
  await nextTick(); cancelButton.value?.focus()
}

function save() {
  const title = draft.value.title.trim()
  const minutes = Number(draft.value.minutes)
  if (!title || !Number.isInteger(minutes) || minutes <= 0) {
    error.value = 'Введіть назву та додатне ціле число хвилин.'
    return
  }
  const item = items.value.find((value) => value.id === editingId.value)
  if (item) { item.title = title; item.minutes = minutes }
  isOpen.value = false
}

function remove() {
  items.value = items.value.filter((item) => item.id !== editingId.value)
  if (selectedId.value === editingId.value) selectedId.value = items.value[0]?.id ?? null
  isOpen.value = false
}
</script>

<template>
  <section aria-labelledby="catalog-title">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-sm uppercase text-gray-600">Навчальні матеріали</p>
        <h2 ref="catalogHeading" id="catalog-title" tabindex="-1" class="text-2xl font-bold">Каталог матеріалів</h2>
      </div>
      <p class="text-gray-600">Обраний матеріал: <strong>{{ selectedTitle }}</strong></p>
    </div>

    <MaterialFilterForm @apply="applyFilters" @clear="clearFilters" />
    <div class="mb-4 flex gap-5 text-gray-600">
      <span>Знайдено: <strong>{{ filteredMaterials.length }}</strong></span>
      <span>Загальна тривалість: <strong>{{ totalMinutes }} хв</strong></span>
    </div>

    <div v-if="filteredMaterials.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MaterialCard
        v-for="item in filteredMaterials"
        :key="item.id"
        v-bind="item"
        :selected="item.id === selectedId"
        @select="selectMaterial"
        @edit="openEdit(item)"
        @delete="openDelete(item)"
      />
    </div>
    <p v-else class="rounded bg-gray-100 p-5 text-center">За заданими умовами матеріалів немає.</p>

    <ModalDialog v-model="isOpen" :title="dialogTitle" :initial-focus="mode === 'edit' ? nameInput : cancelButton" :fallback-focus="catalogHeading">
      <template v-if="mode === 'edit'">
        <form id="material-edit-form" class="space-y-4" @submit.prevent="save">
          <label class="flex flex-col gap-1">Назва
            <input ref="nameInput" v-model="draft.title" class="min-h-11 rounded border p-2" required />
          </label>
          <label class="flex flex-col gap-1">Тривалість, хвилин
            <input v-model="draft.minutes" class="min-h-11 rounded border p-2" type="number" min="1" step="1" required />
          </label>
          <p v-if="error" class="text-red-700">{{ error }}</p>
        </form>
      </template>
      <template v-else>
        <p>Видалити матеріал «{{ editingItem?.title }}»?</p>
      </template>
      <template #footer="{ close }">
        <button ref="cancelButton" type="button" class="min-h-11 rounded border px-4" @click="close">Скасувати</button>
        <button v-if="mode === 'edit'" type="submit" form="material-edit-form" class="min-h-11 rounded bg-green-700 px-4 text-white">Зберегти</button>
        <button v-else type="button" class="min-h-11 rounded bg-red-700 px-4 text-white" @click="remove">Видалити</button>
      </template>
    </ModalDialog>
  </section>
</template>
