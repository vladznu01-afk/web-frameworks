<script setup>
const student = {
  specialty: '121 Інженерія програмного забезпечення',
  course: '2 курс',
  group: '7.F2.25-2',
  name: 'Прохович Владислав Павлович',
}
</script>

<template>
  <main class="page-shell">
    <section class="card" aria-labelledby="page-title">
      <div class="badge">Лабораторна робота №1</div>
      <h1 id="page-title">Vue 3</h1>
      <p class="intro">Навчальний проєкт, виконаний під час роботи з Vue 3.</p>
      <div class="student-card">
        <div class="avatar" aria-hidden="true">{{ student.name.charAt(0) }}</div>
        <div><p class="label">Дані студента</p><h2>{{ student.name }}</h2></div>
      </div>
      <dl class="details">
        <div><dt>Спеціальність</dt><dd>{{ student.specialty }}</dd></div>
        <div><dt>Курс</dt><dd>{{ student.course }}</dd></div>
        <div><dt>Група</dt><dd>{{ student.group }}</dd></div>
      </dl>
    </section>
  </main>
</template>
