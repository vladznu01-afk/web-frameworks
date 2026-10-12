<script setup>
import { computed, inject, onBeforeUnmount, onMounted, reactive } from 'vue'
import SlotPanel from './SlotPanel.js'
import { tabsKey } from './tabsKey.js'
const props = defineProps({ slug: { type: String, required: true }, title: { type: String, required: true }, disabled: Boolean, panel: { type: Object, default: null }, panelProps: { type: Object, default: () => ({}) } })
const context = inject(tabsKey)
if (!context) throw new Error('Tab повинен бути нащадком Tabs')
const { activeSlug, idPrefix, registerTab, unregisterTab } = context
const registeredSlug = props.slug
const isActive = computed(() => activeSlug.value === props.slug)
const declaration = reactive({ slug: registeredSlug, title: computed(() => props.title), disabled: computed(() => props.disabled) })
onMounted(() => registerTab(declaration))
onBeforeUnmount(() => unregisterTab(registeredSlug))
</script>
<template>
 <section :id="`${idPrefix}-panel-${slug}`" v-show="isActive" class="tabs__panel" role="tabpanel" :aria-labelledby="`${idPrefix}-tab-${slug}`" tabindex="0">
  <KeepAlive>
   <SlotPanel v-if="isActive && $slots.default" :is-active="isActive"><template #default="slotProps"><slot v-bind="slotProps" /></template></SlotPanel>
   <component v-else-if="isActive && panel" :is="panel" v-bind="panelProps" />
  </KeepAlive>
 </section>
</template>
<style scoped lang="scss">
.tabs__panel { @apply px-4 py-5; &:focus-visible { @apply outline-none ring-2 ring-inset ring-ink; } }
</style>
