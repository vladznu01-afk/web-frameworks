# Лабораторна робота 5 - composables каталогу

Автор: **Прохович Владислав Павлович**, група **7.F2.25-2**.

Середовище виконання: macOS, Node.js 26.8.2 (в умові рекомендовано 24 LTS), npm, Vue 3.5, Vite 7.3.6. Вихідні умови з Moodle збережено в `assignment/`.

## Запуск

```sh
npm ci
npm run dev -- --port 5174 --strictPort
npm test
npm run build
```

Результат збірки: `dist/`. Журнали: `evidence/build.txt`, `evidence/tests.txt`. Для повторного запуску підставте порт, зазначений нижче.

## Походження та здача

Використано відкриті матеріали викладача: https://github.com/lisnayk/znu-lab-starters (отримані через `git clone --depth 1`). Знімки зроблено з реального локального застосунку. Повноекранні знімки браузерної сторінки не містять системного адресного рядка; URL указано в підписах звіту.

Репозиторій: https://github.com/vladznu01-afk/web-frameworks. Роботи завантажуються в окремі каталоги `lab4/` і `lab5/`; PDF-звіт збережено в кожній папці. Завдання з Moodle збережено в `assignment/`.

## План розподілу відповідальності

| Модуль | Входи | Виходи | Власний стан | Відповідальність |
| --- | --- | --- | --- | --- |
| App.vue | введення, сторінка API, події | URL, props дочірніх компонентів | query, skip, products, total | оркестрація пошуку й merge сторінок |
| ProductSearchForm.vue | modelValue, isLoading, error, loaded, total, isPending | update:modelValue | немає | доступне поле й видимий статус без HTTP |
| ProductCatalog.vue | products, isLoading, error | retry | немає | сітка, loading, empty, error |
| ProductCard.vue | product (required) | картка | форматувач ціни | відображення одного товару |
| CatalogLoadMore.vue | loaded, total, isLoading, error, hasMore | load-more, retry | ref маркера | нижній блок та observer |
| useFetch.js | URL: значення/ref/getter | readonly data/error/isLoading, abort, refetch | контролер, revision | HTTP, актуальність відповіді, очищення |
| useDebouncedValue.js | source, delay=400 | readonly ref | таймер, відкладене значення | debounce, очищення таймера |
| useIntersectionObserver.js | target, callback, options | callback при перетині | observer, stop watch | підписка/перепідписка, disconnect |
| api/products.js | query, skip=0 | URL | немає | URLSearchParams, limit=12, delay=1500 |

## Потік стану

```text
query -> abort активного запиту (flush: sync)
  -> debounce 400 мс -> requestUrl -> useFetch -> page
                                               -> merge -> products
нижній маркер -> load-more -> skip + 12 ---------^
```

Зміна debouncedQuery синхронно скидає skip, products і total. skip=0 замінює список; інші сторінки додаються без повторних id. loadMore дозволений лише за hasMore, без isLoading, isPending або error. refetch повторює URL через реактивний revision. Повернення введення до попереднього рядка та пошук із додатковими пробілами також повторюють скасований запит, навіть якщо нормалізований URL не змінився.

useFetch читає toValue(url) до await у watchEffect, створює AbortController на запуск і abort у onCleanup. Скасована відповідь не змінює data/error. finally попереднього контролера не вимикає loading нового. abort завершує loading; refetch зберігає ту саму сторінку для retry.

ProductSearchForm не формує URL, бо не володіє пагінацією й API-контрактом. ProductCatalog не завантажує дані, бо відображає вже отриманий масив. Власник ресурсу відповідає за його очищення: composable таймера, composable запиту та composable observer. Debounce скорочує кількість запусків, abort негайно припиняє застарілий запуск; це різні задачі.

Observer створюється в onMounted, стежить за ref маркера, unobserve старий елемент і disconnect на розмонтуванні. Якщо API немає, кнопка дозавантаження лишається доступною. rootMargin = 280px 0px, threshold = 0.01.

## Початковий стартер

Вихідний App.vue містив TODO: введення не запускало пошук, нижній блок не спостерігався. Цей початковий стан установлено читанням стартера, а не окремим запуском у браузері. Розмітку product-card і CSS перенесено зі стартера; логіку завершено окремими модулями.

## Контрольні питання

1. Сирий query керує негайним abort (watch з flush: sync).
2. Debounce не скасовує вже запущений fetch; AbortController скасовує.
3. Таймер, мережевий запит і observer/watch мають власне очищення.
4. Третя сторінка має skip=24 при limit=12.
5. watchEffect збирає реактивні залежності лише синхронно до першого await.

Таблиця перевірок: `CHECKS.md`. Автоматичні тести використовують керовані відповіді та офлайн-помилку; реальний DummyJSON перевірено окремо у браузері. Звіт: `report.pdf`.
