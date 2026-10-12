import { onBeforeUnmount, onMounted, toValue, watch } from 'vue'
export function useIntersectionObserver(target, callback, options = {}) {
 let observer, stop
 onMounted(() => {
  if (!('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) callback(entry) }, options)
  stop = watch(() => toValue(target), (element, previous) => {
   if (previous) observer.unobserve(previous)
   if (element) observer.observe(element)
  }, { immediate: true, flush: 'post' })
 })
 onBeforeUnmount(() => { stop?.(); observer?.disconnect() })
}
