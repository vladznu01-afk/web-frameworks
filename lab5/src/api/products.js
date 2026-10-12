export const PAGE_SIZE = 12
export const API_DELAY = 1500
export function createProductsUrl(query, skip = 0) {
 const normalized = String(query ?? '').trim()
 const params = new URLSearchParams({ limit: String(PAGE_SIZE), skip: String(skip), delay: String(API_DELAY) })
 if (normalized) params.set('q', normalized)
 return `https://dummyjson.com/products${normalized ? '/search' : ''}?${params}`
}
