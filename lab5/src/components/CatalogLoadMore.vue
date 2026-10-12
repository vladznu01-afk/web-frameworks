<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '../composables/useIntersectionObserver.js'
defineProps({ loaded: Number, total: Number, isLoading: Boolean, error: { type: Object, default: null }, hasMore: Boolean })
const emit = defineEmits(['load-more', 'retry'])
const marker = ref(null)
useIntersectionObserver(marker, () => emit('load-more'), { rootMargin: '280px 0px', threshold: 0.01 })
</script>
<template><div ref="marker" class="catalog__load-more" aria-live="polite"><span class="catalog__load-progress">{{ loaded }} / {{ total }}</span><div class="catalog__load-copy"><strong class="catalog__load-title">{{ error ? 'Не вдалося дозавантажити' : isLoading ? 'Завантажуємо наступну сторінку…' : hasMore ? 'Більше речей попереду' : 'Усі товари завантажено' }}</strong><span class="catalog__load-text">{{ error ? error.message : hasMore ? 'Прокрутіть або натисніть кнопку' : 'Ви переглянули всі результати' }}</span></div><button v-if="error" type="button" class="catalog__retry" @click="emit('retry')">Повторити сторінку</button><button v-else-if="hasMore" type="button" class="catalog__retry" :disabled="isLoading" @click="emit('load-more')">Ще 12 товарів</button></div></template>
