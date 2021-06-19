# Рабочие записи проекта SocMedical

## Уникальные ссылки
- [/services] — blogsidebar, footer
- [/sell] — footer

## Стили проектов на движке Qwerty Networks

Стили проекта собираются из пяти типов «сырья».

1. Фреймворк и jQuery-плагины:
   - Bootstrap.
   - Toast — панель оповещения.
   - Revealator — вызов классов CSS-анимации на скролле. То для чего сейчас используется Intersection Observer API.
   - Prism — подсветка кода для WYSIWYG-редактора TinyMCE.
   - Typeahead — автокомплит в форме поиска.
2. Стили «движка» `/qwerty.blog/css/main.css`.
3. Стили проекта: `/qwerty.blog/css/<название-проекта>.css` — {$projectcss}. Именно этот файл является продуктом frontend-разработки проекта.
4. Стили пользовательского оформления: логотип, обложка, фон, «чернила» - {$blog_css} строковые стили, добавляемые в head. Переопределяют основные стили и стили проекта. Шаблон `blog-css.tpl` находится в папке шаблонов верхнего уровня и его можно добавить в папку шаблонов проекта, изменить и тогда будут подгружаться те стили, которые описаны в этом проекте.
5. Строковые стили, разбросанные по шаблонам. Предлагаю перенести их в файл add-ons.css и, в конечном итоге, перенести в main.css.

## Работа над стилями

1. Скопировать нужный шаблон на уровне qwerty.blog. Вставить копию в папку проекта.
2. Добавить нужные классы и разметку (в основном — группировку функционально близких элементов и разделение  различных).
3. Сделать тоже самое с шаблонами компонентов: blogsidebar.tpl, footer.tpl, header.tpl.
4. Отладка скриптов и разметки:
    - на локальной копии страницы без скриптов
    - в крайнем случае, если почему-то невозможен первый вариант — в DevTools overrides
см. Notes ➜ 👨🏻‍💻 Разработка стилей и разметки…

## План рефакторинга внутренней страницы

### Первоочередные меры

1. ✔︎ Перенести все строковые стили в head.
2. ✔︎ Добавить БЭМ-классы.
3. ✔︎ В `src` заменить Sass-переменные тех категорий, которые используются в `{$blog_css}`, СSS-переменными. Если надо, переименовать по новому стандарту.
4. ✔︎ Заменить в верстке первой страницы и стилях все вхождения bootstrap'овской сетки. Исходное решение — bootstrap'овская сетка, но с префиксом qwt.
5. Отладка стилей:
    - ✔︎ [Главная](http://localhost:9000/src/pages/index.html)
    - ✔︎ [Сообщество собирателей инвестиций](https://en.b2bingo.com/community-12056/7261338)
6. Заменить шаблоны:
    - ✔︎ header — перенести атрибуты и переменные формы поиска из blog.tpl,
    - blogsidebar — перенести атрибуты и переменные пунктов основного меню из исходного шаблона,
    - ✔︎ footer — выписать переменные, перенести атрибуты и переменные пунктов основного меню из исходного шаблона.
7. ✔︎ Вынести строковые стили во внешний файл add-ons.css, добавить его в корневой каталог и подключить через link.
8. ✔︎ Заменить bootstrap макет верхнего уровня CSS grid
9. Отладка стилей, второй раунд
    - ✔︎ [Пост](https://en.socmedical.com/7269825)
    - ✔︎ [Лента](https://en.socmedical.com/publications)
    - ✔︎ [Главная](http://localhost:9000/src/pages/index.html)

✔︎ 10. Посмотреть: можно ли что-нибудь еще из overrides разнести по файлам компонентов.
✔︎ 11. Сократить normalization.css согласно bootstrap 3.
12. Собрать и перенести на боевой стили и скрипты.

### Основательные и радикальные

1. src/css/core/{ bootstrap.css, main.css }:
    - Заменить повторяющиеся размеры, цвета, шрифты и точки остановы CSS-переменными со значениями по умолчанию, взятыми из `bootstrap.css`.
    `margin-bottom: var(--space-margin-bottom-navbar, 20px)`;
    - Локальные переменные, думаю, пока не стоит переносить в правила компонентов — чтобы дизайн-токены в будущем могли конвертироваться в общий файл.
    ```css
    .table {
      --color-background-table-base:
        var(--color-background-table-base);
    }
    ```
    - Разобрать на составные.
    - Сделать копии составных файлов — шаблоны для овверайдов.
    - Заменить `float` в классах сетки на flex.
2. Создать копию шаблонных файлов base: normalize, body, typography и, может быть, каких-то еще, в которых удалить стили, повторяющие bootstrap.css и main.css
3. Удалить ненужные виджеты: add this и подобные.

```pug
.page-loader#p_prldr

//- Новинка: форма поиска на мобильных
form.search-drawer#search-drawer
.scrim#search-scrim

header.header#header
  .container

.navbar
  .container
    nav.navbar__base

.main#main
  .container
    .main__cover
    article.article
      header.article__header
        h1.article__title
        .article__byline
          .article__avatar
          time.article__date
      .article__body
        .article__content
        .article__tags

      section.article__comments

    .article__tools
      .article__rating
      .article__donate
      button.article__abuse
      .article__more
        //-translation etc

footer.footer#footer
  .container
    //- Языки
    ul.language-switcher

    //- Мета-навигация
    .footer__doormat

    p.footer__site-credits

.modal.fade#editcomment
.modal#newpicture
```
