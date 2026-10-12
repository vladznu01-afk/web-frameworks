# Лабораторна робота 4 - вкладки

Автор: **Прохович Владислав Павлович**, група **7.F2.25-2**.

Середовище виконання: macOS, Node.js 26.8.2 (в умові рекомендовано 24 LTS), npm, Vue 3.5, Vite 7.3.6. Вихідні умови з Moodle збережено в `assignment/`.

## Запуск

```sh
npm ci
npm run dev -- --port 5173 --strictPort
npm test
npm run build
```

Результат збірки: `dist/`. Журнали: `evidence/build.txt`, `evidence/tests.txt`. Для повторного запуску підставте порт, зазначений нижче.

## Походження та здача

Використано відкриті матеріали викладача: https://github.com/lisnayk/znu-lab-starters (отримані через `git clone --depth 1`). Знімки зроблено з реального локального застосунку. Повноекранні знімки браузерної сторінки не містять системного адресного рядка; URL указано в підписах звіту.

Репозиторій: https://github.com/vladznu01-afk/web-frameworks. Роботи завантажуються в окремі каталоги `lab4/` і `lab5/`; PDF-звіт збережено в кожній папці. Завдання з Moodle збережено в `assignment/`.

## Структура

- `src/components/tabs/Tabs.vue`: реєстр, активна вкладка, клавіатура, provide.
- `Tab.vue`: inject, реєстрація/вилучення, panel, scoped slot, KeepAlive.
- `tabsKey.js`: спільний Symbol.
- `SlotPanel.js`: компонентна межа для кешування слота (Vue компілює slot у Fragment).
- `demo-panels/`: OverviewPanel, RequirementsPanel, EnvironmentPanel.
- `ModalDialog.vue`: Teleport, Transition, Escape, focus trap, блокування прокрутки та повернення фокуса.
- `App.vue`: три окремі ref для underline, pills, boxed; додаткова вкладка через v-if.
- Tailwind 3.4.17 / PostCSS / Autoprefixer / Sass; локальні SCSS з BEM і @apply.

ModalDialog.vue скопійовано з лабораторної 3 у репозиторії й використано у вкладці «Середовище» з обов’язковим заголовком та footer slot.

## Контракти

| Компонент | Входи | Виходи |
| --- | --- | --- |
| Tabs | modelValue: String (required), variant: String = underline, label | update:modelValue(slug), default slot, контекст tabsKey |
| Tab | slug/title: String (required), disabled: Boolean = false, panel: Object = null, panelProps: Object = {} | default slot з isActive; власних подій немає |

Контекст містить readonly activeSlug, idPrefix через useId, setActiveTab, registerTab, unregisterTab. Duplicate slug та Tab без Tabs спричиняють помилку. При видаленні активної вкладки вибирається перша доступна. Реєстрація знімається в onBeforeUnmount.

| ICOM | A1: Керувати вкладками | A2: Показати панель |
| --- | --- | --- |
| Input | modelValue, декларації Tab, команди | slug, title, disabled, slot або panel/panelProps |
| Control | v-model, variant, WAI-ARIA | activeSlug, пріоритет слота, правила кешування |
| Output | update:modelValue, tablist, контекст | tabpanel та активний вміст |
| Mechanism | Vue, provide, реактивний реєстр | inject, component :is, KeepAlive, хуки |

## Пояснення

Default slot Tabs задає декларативний склад Tab. Props передають конкретні параметри, slot - розмітку в контексті батька, provide/inject - локальний контекст на довільну глибину. Symbol у спільному модулі запобігає колізіям ключів. v-model = modelValue + update:modelValue.

Статичну панель зручно описати компонентом у слоті, а конфігураційний масив - посиланням на component :is та panelProps. Посилання в масиві обгорнуто markRaw. Слот має пріоритет. KeepAlive має один компонентний нащадок, який зникає через v-if; зовнішня section приховується v-show. Тому DOM прибирається, а реактивний стан кешується. Сам v-show не перевіряє справжню деактивацію.

## Перевірка KeepAlive

Введіть нотатку, перейдіть у Вимоги й поверніться. Текст той самий, лічильник активацій зростає з 1 до 2. Парні фото: evidence/02-before.jpg і 03-after.jpg. Логи onActivated/onDeactivated і автоматичний тест підтверджують життєвий цикл. Збереження екземпляра перевірено через повернення до вкладки: нотатка лишилася, а onActivated змінив лічильник з 1 на 2. Знімок дерева компонентів Vue DevTools не включено.

## Контрольні питання

1. Default slot Tabs містить декларації вкладок.
2. Symbol задає унікальний ключ; один експорт дозволяє provide та inject знайти той самий контекст.
3. modelValue і update:modelValue(slug).
4. Об'єкт Vue-компонента або його зареєстроване ім'я.
5. v-if прибирає компонент із DOM і запускає деактивацію; v-show лише змінює display.

Таблиця фактичних перевірок: `CHECKS.md`. Звіт: `report.pdf`.
