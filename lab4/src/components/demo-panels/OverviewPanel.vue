<script setup>
import { onActivated, onDeactivated, ref, useId } from 'vue'
defineProps({ heading: { type: String, default: 'Нотатки до роботи' } })
const note = ref(''), activations = ref(0), id = useId()
onActivated(() => { activations.value++; console.info('OverviewPanel activated') })
onDeactivated(() => console.info('OverviewPanel deactivated'))
</script>
<template><div><h3>{{ heading }}</h3><label :for="id">Нотатка</label><textarea :id="id" v-model="note" rows="3" placeholder="Введіть текст і перемкніть вкладку" /><p class="hint">Активацій: {{ activations }} · Символів: {{ note.length }}</p></div></template>
