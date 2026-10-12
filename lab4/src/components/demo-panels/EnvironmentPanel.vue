<script setup>
import { ref } from 'vue'
import ModalDialog from '../ModalDialog.vue'
const open = ref(false), opened = ref(0)
function show() { open.value = true; opened.value++ }
</script>
<template><div><h3>Середовище</h3><p>Vue 3.5 · Vite 7 · Tailwind 3.4.17 · Sass · macOS</p><p>Node.js 26.8.2 · npm · Google Chrome</p><button type="button" @click="show">Відкрити ModalDialog</button><p class="hint">Відкриттів у цьому екземплярі: {{ opened }}</p><ModalDialog v-model="open" title="Середовище розробки"><p>Прохович Владислав Павлович · 7.F2.25-2</p><p>Teleport, Transition, Escape, обмеження фокуса і повернення до кнопки.</p><template #footer="{ close }"><button type="button" @click="close">Зрозуміло</button></template></ModalDialog></div></template>
