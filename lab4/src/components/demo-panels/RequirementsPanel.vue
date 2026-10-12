<script setup>
import { ref } from 'vue'
const checked = ref([]), count = ref(0)
const requirements = ['Контекст provide/inject', 'Доступна навігація', 'Збереження стану KeepAlive']
</script>
<template><div><h3>Перевірка вимог</h3><label v-for="item in requirements" :key="item" class="check"><input v-model="checked" type="checkbox" :value="item" />{{ item }}</label><p>Позначено: {{ checked.length }} / 3</p><button type="button" @click="count++">Підтвердити перевірку: {{ count }}</button></div></template>
