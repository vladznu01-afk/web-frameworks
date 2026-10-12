import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { useFetch } from '../src/composables/useFetch.js'
import { useDebouncedValue } from '../src/composables/useDebouncedValue.js'
import { useIntersectionObserver } from '../src/composables/useIntersectionObserver.js'
import { createProductsUrl } from '../src/api/products.js'
import App from '../src/App.vue'
let wrapper
const product=id=>({id,title:`Product ${id}`,category:'test',rating:4,price:10,stock:1,description:'Example',thumbnail:'',discountPercentage:0})
afterEach(()=>{wrapper?.unmount();vi.unstubAllGlobals();vi.useRealTimers()})
function host(setup){wrapper=mount(defineComponent({setup,template:'<div/>'}));return wrapper}
describe('composables',()=>{
 it('builds encoded URLs with explicit skip and delay',()=>{expect(createProductsUrl('',0)).toBe('https://dummyjson.com/products?limit=12&skip=0&delay=1500');const u=new URL(createProductsUrl(' phone & case ',24));expect(u.pathname).toBe('/products/search');expect(u.searchParams.get('q')).toBe('phone & case');expect(u.searchParams.get('skip')).toBe('24')})
 it('debounces ref input and cleans timers on unmount',async()=>{vi.useFakeTimers();const source=ref('');let result;host(()=>{result=useDebouncedValue(source);return{}});source.value='p';await nextTick();vi.advanceTimersByTime(200);source.value='phone';await nextTick();vi.advanceTimersByTime(399);expect(result.value).toBe('');vi.advanceTimersByTime(1);expect(result.value).toBe('phone');source.value='later';await nextTick();wrapper.unmount();vi.advanceTimersByTime(400);expect(result.value).toBe('phone')})
 it('aborts outdated requests and ignores late responses and finalizers',async()=>{const pending=[];vi.stubGlobal('fetch',vi.fn((url,options)=>new Promise(resolve=>pending.push({url,...options,resolve}))));const url=ref('/one');let result;host(()=>{result=useFetch(url);return{}});url.value='/two';await nextTick();expect(pending[0].signal.aborted).toBe(true);pending[0].resolve({ok:true,json:async()=>({old:true})});await flushPromises();expect(result.data.value).toBeNull();expect(result.isLoading.value).toBe(true);pending[1].resolve({ok:true,json:async()=>({new:true})});await flushPromises();expect(result.data.value).toEqual({new:true});result.refetch();await nextTick();expect(pending).toHaveLength(3);result.abort();expect(result.isLoading.value).toBe(false);expect(pending[2].signal.aborted).toBe(true);wrapper.unmount()})
 it('reports errors and retries the same URL',async()=>{vi.stubGlobal('fetch',vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ok:true,json:async()=>({ok:true})}));let result;host(()=>{result=useFetch(()=>'/same');return{}});await flushPromises();expect(result.error.value.message).toBe('offline');result.refetch();await nextTick();await flushPromises();expect(result.error.value).toBeNull();expect(result.data.value).toEqual({ok:true})})
 it('rebinds observer target and disconnects on unmount',async()=>{const observe=vi.fn(),unobserve=vi.fn(),disconnect=vi.fn();let callback;vi.stubGlobal('IntersectionObserver',class{constructor(cb){callback=cb}observe=observe;unobserve=unobserve;disconnect=disconnect});const target=ref(document.createElement('div')),action=vi.fn();host(()=>{useIntersectionObserver(target,action);return{}});expect(observe).toHaveBeenCalledWith(target.value);const old=target.value;target.value=document.createElement('div');await nextTick();expect(unobserve).toHaveBeenCalledWith(old);callback([{isIntersecting:false},{isIntersecting:true}]);expect(action).toHaveBeenCalledTimes(1);wrapper.unmount();expect(disconnect).toHaveBeenCalledTimes(1)})
 it('works without IntersectionObserver',()=>{vi.stubGlobal('IntersectionObserver',undefined);delete window.IntersectionObserver;expect(()=>host(()=>{useIntersectionObserver(ref(null),()=>{});return{}})).not.toThrow()})
})
describe('catalog orchestration',()=>{
 it('merges unique pages, cancels immediately, resets search, shows empty results',async()=>{
 vi.useFakeTimers();const calls=[];vi.stubGlobal('fetch',vi.fn((url,options)=>new Promise(resolve=>calls.push({url,...options,resolve}))));wrapper=mount(App)
 const respond=async(index,ids,total,skip)=>{calls[index].resolve({ok:true,json:async()=>({products:ids.map(product),total,skip})});await flushPromises();await nextTick()}
 await respond(0,Array.from({length:12},(_,i)=>i+1),36,0)
 expect(wrapper.findAll('.product-card')).toHaveLength(12)
 const load=()=>wrapper.findAll('button').find(b=>b.text().includes('Ще 12'))
 await load().trigger('click');expect(new URL(calls[1].url).searchParams.get('skip')).toBe('12')
 await respond(1,[12,...Array.from({length:12},(_,i)=>i+13)],36,12)
 expect(wrapper.findAll('.product-card')).toHaveLength(24)
 await load().trigger('click');expect(new URL(calls[2].url).searchParams.get('skip')).toBe('24')
 await wrapper.find('input').setValue('p');expect(calls[2].signal.aborted).toBe(true)
 await wrapper.find('input').setValue('ph');await wrapper.find('input').setValue('phone');vi.advanceTimersByTime(400);await nextTick()
 expect(new URL(calls[3].url).searchParams.get('q')).toBe('phone');expect(new URL(calls[3].url).searchParams.get('skip')).toBe('0')
 await respond(3,[101],1,0);expect(wrapper.findAll('.product-card')).toHaveLength(1);expect(wrapper.text()).toContain('Усі товари завантажено')
 await wrapper.find('input').setValue('no-match');vi.advanceTimersByTime(400);await nextTick();await respond(4,[],0,0);expect(wrapper.text()).toContain('Товарів не знайдено')
 await wrapper.find('input').setValue('');vi.advanceTimersByTime(400);await nextTick();expect(new URL(calls[5].url).searchParams.has('q')).toBe(false)
 })
})
