<script setup>
import { API_DELAY } from '../api/products.js'
defineProps({ modelValue: { type: String, required: true }, isLoading: Boolean, error: { type: Object, default: null }, loaded: Number, total: Number, isPending: Boolean })
const emit = defineEmits(['update:modelValue'])
</script>
<template>
 <form class="search-panel" role="search" @submit.prevent>
 <label class="search-panel__label" for="product-search">Пошук у каталозі</label><div class="search-panel__control"><svg class="search-panel__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg><input id="product-search" :value="modelValue" @input="emit('update:modelValue', $event.target.value)" class="search-panel__input" type="search" placeholder="Наприклад, phone" autocomplete="off" /><span class="search-panel__hint">400 мс</span></div>
 <p class="search-panel__status" aria-live="polite"><span class="search-panel__status-dot" :class="{ 'search-panel__status-dot--active': isLoading }"></span><span v-if="isPending">Очікуємо завершення введення…</span><span v-else-if="isLoading">Завантажуємо товари…</span><span v-else-if="error">Не вдалося отримати товари</span><span v-else>Показано {{ loaded }} із {{ total }} товарів</span><span class="search-panel__delay">API +{{ API_DELAY }} мс</span></p>
 </form>
</template>
