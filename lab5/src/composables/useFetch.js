import { readonly, ref, shallowRef, toValue, watchEffect } from 'vue'
export function useFetch(url) {
 const data = shallowRef(null), error = shallowRef(null), isLoading = ref(false), revision = ref(0)
 let current
 function abort() { current?.abort(); isLoading.value = false }
 function refetch() { revision.value++ }
 watchEffect(onCleanup => {
  const requestUrl = toValue(url)
  revision.value
  current?.abort()
  const controller = new AbortController()
  current = controller
  onCleanup(() => controller.abort())
  error.value = null
  isLoading.value = true
  ;(async () => {
   try {
    const response = await fetch(requestUrl, { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const page = await response.json()
    if (!controller.signal.aborted && current === controller) data.value = page
   } catch (cause) {
    if (!controller.signal.aborted && current === controller) error.value = cause
   } finally {
    if (current === controller) isLoading.value = false
   }
  })()
 })
 return { data: readonly(data), error: readonly(error), isLoading: readonly(isLoading), abort, refetch }
}
