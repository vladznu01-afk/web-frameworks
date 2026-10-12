<script setup>
import { computed, nextTick, provide, readonly, ref, useId, watch } from 'vue'
import { tabsKey } from './tabsKey.js'
const props = defineProps({ modelValue: { type: String, required: true }, variant: { type: String, default: 'underline', validator: v => ['underline', 'pills', 'boxed'].includes(v) }, label: { type: String, default: 'Вкладки' } })
const emit = defineEmits(['update:modelValue'])
const tabs = ref([])
const idPrefix = useId()
const activeSlug = computed(() => props.modelValue)
const buttons = new Map()
function setActiveTab(slug) {
  if (tabs.value.some(t => t.slug === slug && !t.disabled)) emit('update:modelValue', slug)
}
function ensureActive() {
  if (!tabs.value.some(t => t.slug === activeSlug.value && !t.disabled)) {
    const first = tabs.value.find(t => !t.disabled)
    if (first) setActiveTab(first.slug)
    else if (activeSlug.value) emit('update:modelValue', '')
  }
}
function registerTab(tab) {
  if (tabs.value.some(t => t.slug === tab.slug)) throw new Error(`Повторний slug: ${tab.slug}`)
  tabs.value.push(tab)
  // All declarations register before validating the initial selection.
  nextTick(ensureActive)
}
function unregisterTab(slug) {
  tabs.value = tabs.value.filter(t => t.slug !== slug)
  ensureActive()
}
watch(() => props.modelValue, ensureActive)
watch(tabs, ensureActive, { deep: true })
provide(tabsKey, { activeSlug: readonly(activeSlug), idPrefix, setActiveTab, registerTab, unregisterTab })
async function navigate(event, slug) {
  const enabled = tabs.value.filter(t => !t.disabled)
  let index = enabled.findIndex(t => t.slug === slug)
  if (!enabled.length) return
  if (event.key === 'Home') index = 0
  else if (event.key === 'End') index = enabled.length - 1
  else if (event.key === 'ArrowRight') index = (index + 1) % enabled.length
  else if (event.key === 'ArrowLeft') index = (index - 1 + enabled.length) % enabled.length
  else return
  event.preventDefault()
  setActiveTab(enabled[index].slug)
  await nextTick()
  buttons.get(enabled[index].slug)?.focus()
}
</script>
<template>
  <div class="tabs" :class="`tabs--${variant}`">
    <div class="tabs__list" role="tablist" :aria-label="label">
      <button v-for="tab in tabs" :key="tab.slug" :ref="el => el ? buttons.set(tab.slug, el) : buttons.delete(tab.slug)" :id="`${idPrefix}-tab-${tab.slug}`" class="tabs__tab" :class="{ 'tabs__tab--active': activeSlug === tab.slug }" type="button" role="tab" :disabled="tab.disabled" :aria-selected="activeSlug === tab.slug" :aria-controls="`${idPrefix}-panel-${tab.slug}`" :tabindex="activeSlug === tab.slug && !tab.disabled ? 0 : -1" @click="setActiveTab(tab.slug)" @keydown="navigate($event, tab.slug)">{{ tab.title }}</button>
    </div>
    <slot />
  </div>
</template>
<style scoped lang="scss">
.tabs {
 $self: &;
 @apply overflow-hidden rounded-xl border border-edge bg-paper;
 &__list { @apply flex flex-wrap gap-1 px-2; }
 &__tab { @apply min-h-11 px-4 py-2 text-sm font-semibold text-muted transition-colors;
  &:hover:not(:disabled) { @apply text-ink; }
  &:focus-visible { @apply outline-none ring-2 ring-ink; }
  &:disabled { @apply cursor-not-allowed opacity-40; }
 }
 &--underline { #{$self}__list { @apply border-b-2 border-edge; } #{$self}__tab { @apply -mb-0.5 border-b-2 border-transparent; } #{$self}__tab--active { @apply border-accent text-ink; } }
 &--pills { #{$self}__list { @apply p-2; } #{$self}__tab { @apply rounded-full; } #{$self}__tab--active { @apply bg-accent text-ink; } }
 &--boxed { #{$self}__list { @apply border-b border-edge bg-surface p-2; } #{$self}__tab { @apply rounded-lg border border-transparent; } #{$self}__tab--active { @apply border-edge bg-paper text-ink shadow-sm; } }
}
</style>
