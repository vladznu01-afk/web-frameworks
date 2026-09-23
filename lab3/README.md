# Лабораторна робота №3

Vue-застосунок із каталогом матеріалів та адаптивним модальним вікном.

## Запуск

```bash
npm install
npm run dev
```

## Docker

```bash
npm run docker-run
```

Сторінка відкривається за адресою http://localhost:8080.

Для зупинки контейнера:

```bash
npm run docker-stop
```

`ModalDialog.vue` використовує слоти, `v-model`, `Teleport`, `Transition`, шаблонні `ref` та керування фокусом. Матеріали можна редагувати або видаляти без запитів до сервера.
