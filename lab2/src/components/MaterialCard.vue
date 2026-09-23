<script setup>
defineProps({
  title: { type: String, required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  minutes: { type: Number, required: true },
  selected: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])
</script>

<template>
  <article class="material-card" :class="[`material-card--${topic}`, { 'material-card--selected': selected }]">
    <div class="material-card__topline">
      <span>{{ minutes }} хв</span>
    </div>
    <h3 class="material-card__title">{{ title }}</h3>
    <p class="material-card__description">{{ description }}</p>
    <button class="material-card__button" type="button" :aria-pressed="selected" @click="emit('select', title)">
      {{ selected ? 'Обрано' : 'Обрати' }}
    </button>
  </article>
</template>
