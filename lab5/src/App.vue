<script setup>
import { computed, ref, watch } from 'vue'
import { createProductsUrl, PAGE_SIZE } from './api/products.js'
import { useFetch } from './composables/useFetch.js'
import { useDebouncedValue } from './composables/useDebouncedValue.js'
import ProductSearchForm from './components/ProductSearchForm.vue'
import ProductCatalog from './components/ProductCatalog.vue'
import CatalogLoadMore from './components/CatalogLoadMore.vue'
const query = ref(''), skip = ref(0), products = ref([]), total = ref(0)
const debouncedQuery = useDebouncedValue(query, 400)
const isPending = computed(() => query.value !== debouncedQuery.value)
const requestUrl = computed(() => createProductsUrl(debouncedQuery.value, skip.value))
const { data, error, isLoading, abort, refetch } = useFetch(requestUrl)
// Cancel synchronously: stale responses must never enter the new search.
watch(query, value => { abort(); if (value === debouncedQuery.value) refetch() }, { flush: 'sync' })
watch(debouncedQuery, () => { skip.value = 0; products.value = []; total.value = 0; refetch() }, { flush: 'sync' })
watch(data, page => {
 if (!page || isPending.value) return
 total.value = page.total
 if (page.skip === 0) products.value = page.products
 else {
  const seen = new Set(products.value.map(product => product.id))
  products.value = [...products.value, ...page.products.filter(product => { if (seen.has(product.id)) return false; seen.add(product.id); return true })]
 }
})
const hasMore = computed(() => products.value.length < total.value)
function loadMore() { if (hasMore.value && !isLoading.value && !isPending.value && !error.value) skip.value += PAGE_SIZE }
function retry() { if (!isPending.value) refetch() }
</script>
<template>
 <main class="storefront"><header class="storefront__masthead"><a class="storefront__brand" href="#" aria-label="Forma, на початок">FORMA<span class="storefront__brand-mark">®</span></a><p class="storefront__edition">Лабораторна / 05</p><p class="storefront__note">Каталог і composables</p></header>
 <section class="storefront__hero"><div class="storefront__intro"><p class="storefront__eyebrow">Пошук та нескінченний каталог</p><h1 class="storefront__title">Речі з ясною <em class="storefront__title-accent">формою</em></h1></div><ProductSearchForm v-model="query" :is-loading="isLoading" :error="error" :loaded="products.length" :total="total" :is-pending="isPending" /></section>
 <section class="catalog" aria-labelledby="catalog-title"><div class="catalog__heading"><h2 id="catalog-title" class="catalog__title">{{ debouncedQuery.trim() ? 'Результати пошуку' : 'Початкова добірка' }}</h2><span class="catalog__count">{{ products.length.toString().padStart(2, '0') }}</span></div><ProductCatalog :products="products" :is-loading="isLoading || isPending" :error="error" @retry="retry" /><CatalogLoadMore v-if="products.length" :loaded="products.length" :total="total" :is-loading="isLoading" :error="error" :has-more="hasMore" @load-more="loadMore" @retry="retry" /></section>
 <footer class="storefront__footer"><div><p>Прохович Владислав Павлович · 7.F2.25-2</p><p>macOS · Node.js 26.8.2 · Vue 3.5 · Vite 7 · Chrome</p></div><a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">Дані: DummyJSON</a></footer></main>
</template>
