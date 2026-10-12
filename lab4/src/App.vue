<script setup>
import { markRaw, ref } from 'vue'
import Tabs from './components/tabs/Tabs.vue'
import Tab from './components/tabs/Tab.vue'
import OverviewPanel from './components/demo-panels/OverviewPanel.vue'
import RequirementsPanel from './components/demo-panels/RequirementsPanel.vue'
import EnvironmentPanel from './components/demo-panels/EnvironmentPanel.vue'
const underline = ref('overview'), pills = ref('note'), boxed = ref('environment')
const showExtra = ref(true)
const panels = [{ slug: 'note', title: 'Нотатка', panel: markRaw(OverviewPanel), panelProps: { heading: 'Динамічна панель' } }, { slug: 'check', title: 'Перевірка', panel: markRaw(RequirementsPanel), panelProps: {} }, { slug: 'env', title: 'Середовище', panel: markRaw(EnvironmentPanel), panelProps: {} }]
</script>
<template>
 <main class="page"><header><p class="eyebrow">СУЧАСНІ КАРКАСИ WEB-ДОДАТКІВ / 04</p><h1>Вкладки та локальний контекст</h1><p>Прохович Владислав Павлович · група 7.F2.25-2</p><p class="hint">macOS · Node.js 26.8.2 · Vue 3.5 · Vite 7 · Tailwind CSS 3.4.17 + Sass</p></header>
 <section><h2>01 / Underline · панелі через слоти</h2><Tabs v-model="underline" label="Основні вкладки"><Tab slug="overview" title="Огляд"><OverviewPanel /></Tab><Tab slug="requirements" title="Вимоги"><RequirementsPanel /></Tab><Tab slug="environment" title="Середовище"><EnvironmentPanel /></Tab></Tabs></section>
 <section><h2>02 / Pills · динамічні компоненти</h2><Tabs v-model="pills" variant="pills" label="Динамічні вкладки"><Tab v-for="item in panels" :key="item.slug" v-bind="item" /></Tabs></section>
 <section><h2>03 / Boxed · вимкнені та умовні вкладки</h2><Tabs v-model="boxed" variant="boxed" label="Вкладки середовища"><Tab slug="environment" title="Середовище"><EnvironmentPanel /></Tab><Tab slug="disabled" title="Недоступно" disabled><OverviewPanel /></Tab><Tab v-if="showExtra" slug="extra" title="Нотатка"><OverviewPanel heading="Окремий стан boxed" /></Tab></Tabs><label class="check mt-3"><input v-model="showExtra" type="checkbox" />Показати додаткову вкладку (v-if)</label></section>
 <footer>Клавіатура: ← → Home End · стан кожної панелі зберігається в KeepAlive.</footer></main>
</template>
