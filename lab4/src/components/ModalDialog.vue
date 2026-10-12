<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, required: true },
  initialFocus: { type: Object, default: null },
  fallbackFocus: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])
const panel = ref(null)
const titleId = 'modal-dialog-title'
let previousFocus = null
let previousOverflow = ''
let previousInert = false

const close = () => emit('update:modelValue', false)

function focusable() {
  return [...panel.value.querySelectorAll('button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])')]
    .filter((el) => !el.disabled && el.offsetParent !== null)
}

function onKeydown(event) {
  if (event.key === 'Escape') return close()
  if (event.key !== 'Tab') return
  const elements = focusable()
  if (!elements.length) return panel.value?.focus()
  const first = elements[0]
  const last = elements[elements.length - 1]
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}

function lockPage() {
  const app = document.querySelector('#app')
  previousFocus = document.activeElement
  previousOverflow = document.body.style.overflow
  if (app) { previousInert = app.inert; app.inert = true }
  document.body.style.overflow = 'hidden'
}

function unlockPage() {
  const app = document.querySelector('#app')
  if (app) app.inert = previousInert
  document.body.style.overflow = previousOverflow
  const target = previousFocus?.isConnected ? previousFocus : props.fallbackFocus
  target?.focus?.()
}

watch(() => props.modelValue, async (open) => {
  if (open) {
    lockPage()
    await nextTick()
    ;(props.initialFocus || panel.value)?.focus?.()
  }
})

onBeforeUnmount(unlockPage)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150 motion-reduce:transition-none"
      leave-active-class="transition-opacity duration-150 motion-reduce:transition-none"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      @after-leave="unlockPage"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="close">
        <section ref="panel" class="flex max-h-[calc(100dvh-2rem)] w-full max-w-screen-sm flex-col overflow-hidden rounded bg-white shadow-xl" role="dialog" aria-modal="true" :aria-labelledby="titleId" tabindex="-1" @keydown="onKeydown">
          <header class="flex shrink-0 items-center justify-between gap-4 border-b p-4">
            <h2 :id="titleId" class="break-words text-xl font-bold">{{ title }}</h2>
            <button type="button" class="min-h-11 min-w-11 rounded border" aria-label="Закрити вікно" @click="close">×</button>
          </header>
          <div class="min-h-0 overflow-y-auto break-words p-4"><slot /></div>
          <footer class="flex shrink-0 flex-col gap-3 border-t p-4 sm:flex-row sm:justify-end"><slot name="footer" :close="close" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
