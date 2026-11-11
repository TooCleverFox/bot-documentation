
document$.subscribe(function () {
    const tables = document.querySelectorAll("article table");

    tables.forEach(function (table) {

        // Не создаём фильтр повторно
        if (table.dataset.filterInitialized) {
            return;
        }

        table.dataset.filterInitialized = "true";

        // Получаем строки таблицы
        const rows = Array.from(
            table.querySelectorAll("tbody tr")
        );

        if (rows.length === 0) {
            return;
        }

        // Создаём панель фильтрации
        const toolbar = document.createElement("div");
        toolbar.className = "table-filter";

        const input = document.createElement("input");
        input.type = "search";
        input.placeholder = "Поиск по таблице...";
        input.setAttribute("aria-label", "Поиск по таблице");

        const counter = document.createElement("span");
        counter.className = "table-filter-counter";

        const clearButton = document.createElement("button");
        clearButton.type = "button";
        clearButton.textContent = "Очистить";

        toolbar.append(input, counter, clearButton);

        // Вставляем панель перед таблицей
        const container =
            table.closest(".md-typeset__scrollwrap") || table;

        container.parentNode.insertBefore(toolbar, container);

        // Функция фильтрации
        function filterTable() {
            const query = input.value
                .trim()
                .toLocaleLowerCase();

            let visible = 0;

            rows.forEach(function (row) {
                const text = row.textContent
                    .toLocaleLowerCase();

                const matches = text.includes(query);

                row.hidden = !matches;

                if (matches) {
                    visible++;
                }
            });

            counter.textContent =
                `Показано ${visible} из ${rows.length}`;

            clearButton.hidden = query.length === 0;
        }

        input.addEventListener("input", filterTable);

        clearButton.addEventListener("click", function () {
            input.value = "";
            filterTable();
            input.focus();
        });

        filterTable();
    });
});
