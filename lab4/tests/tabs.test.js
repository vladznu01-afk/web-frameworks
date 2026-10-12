import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import App from '../src/App.vue'
import Tabs from '../src/components/tabs/Tabs.vue'
import Tab from '../src/components/tabs/Tab.vue'
let wrapper
async function settle() { await nextTick(); await nextTick() }
afterEach(() => wrapper?.unmount())
describe('compound tabs', () => {
 it('keeps all three sets independent and retains text, checkboxes and counter', async () => {
  wrapper = mount(App, { attachTo: document.body }); await settle()
  expect(wrapper.findAll('[role=tablist]')).toHaveLength(3)
  await wrapper.find('textarea').setValue('Збережена нотатка')
  await wrapper.findAll('[role=tab]')[1].trigger('click'); await settle()
  await wrapper.find('input[type=checkbox]').setValue(true)
  await wrapper.findAll('button').find(b => b.text().includes('Підтвердити')).trigger('click')
  await wrapper.findAll('[role=tab]')[0].trigger('click'); await settle()
  expect(wrapper.find('textarea').element.value).toBe('Збережена нотатка')
  expect(wrapper.findAll('[aria-selected=true]').map(b => b.text())).toEqual(['Огляд','Нотатка','Середовище'])
  await wrapper.findAll('[role=tab]')[1].trigger('click'); await settle()
  expect(wrapper.find('input[type=checkbox]').element.checked).toBe(true)
  expect(wrapper.text()).toContain('Підтвердити перевірку: 1')
 })
 it('wraps navigation, skips disabled tabs, and fixes selection after removal', async () => {
  wrapper = mount(App, { attachTo: document.body }); await settle()
  const boxed = () => wrapper.findAll('[role=tablist]')[2].findAll('button')
  await boxed()[0].trigger('keydown', { key:'ArrowLeft' }); await settle()
  expect(boxed()[2].attributes('aria-selected')).toBe('true')
  expect(document.activeElement).toBe(boxed()[2].element)
  await boxed()[2].trigger('keydown', { key:'ArrowRight' }); await settle()
  expect(boxed()[0].attributes('aria-selected')).toBe('true')
  await boxed()[0].trigger('keydown', { key:'End' }); await settle()
  await wrapper.findAll('input[type=checkbox]').at(-1).setValue(false); await settle()
  expect(boxed()).toHaveLength(2)
  expect(boxed()[0].attributes('aria-selected')).toBe('true')
  await boxed()[0].trigger('keydown', { key:'Home' }); await settle()
  const ids = wrapper.findAll('[id]').map(el => el.attributes('id'))
  expect(new Set(ids).size).toBe(ids.length)
 })
 it('opens dialog and closes by Escape', async () => {
  wrapper = mount(App, { attachTo: document.body }); await settle()
  await wrapper.findAll('button').find(b => b.text().includes('Відкрити')).trigger('click'); await settle()
  expect(document.querySelector('[role=dialog]')).not.toBeNull()
  document.querySelector('[role=dialog]').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); await settle()
  expect(document.querySelector('[role=dialog]')).toBeNull()
  expect(wrapper.text()).toContain('Відкриттів у цьому екземплярі: 1')
 })
 it('rejects declarations without a container and duplicate slugs', async () => {
  expect(() => mount(Tab,{props:{slug:'x',title:'X'}})).toThrow('Tab повинен')
  const Host=defineComponent({components:{Tabs,Tab},setup:()=>({active:ref('x')}),template:'<Tabs v-model="active"><Tab slug="x" title="X"/><Tab slug="x" title="Duplicate"/></Tabs>'})
  expect(() => mount(Host)).toThrow('Повторний slug')
 })
})
