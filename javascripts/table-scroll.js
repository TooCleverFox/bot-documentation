
document$.subscribe(function () {
    let stickyHeader;
    let stickyTable;
    let stickyHead;

    const tables = [...document.querySelectorAll("article table")];

    let bar = document.querySelector(".floating-table-scroll");

    if (!bar) {
        bar = document.createElement("div");
        bar.className = "floating-table-scroll";

        const inner = document.createElement("div");
        inner.className = "floating-table-scroll-inner";

        bar.appendChild(inner);
        document.body.appendChild(bar);
    }

    const inner = bar.firstElementChild;

    let activeTable = null;
    let syncing = false;

    function update() {
        const table = tables.find(table => {
            const rect = table.getBoundingClientRect();

            return (
                rect.top < window.innerHeight &&
                rect.bottom > 0 &&
                rect.bottom > window.innerHeight &&
                table.scrollWidth > table.clientWidth
            );
        });

        if (!table) {
            bar.style.display = "none";
        } else {
            activeTable = table;

            const rect = table.getBoundingClientRect();

            bar.style.display = "block";
            bar.style.left = Math.max(0, rect.left) + "px";
            bar.style.width =
                Math.min(window.innerWidth, rect.right) -
                Math.max(0, rect.left) + "px";

            inner.style.width = table.scrollWidth + "px";

            syncing = true;
            bar.scrollLeft = table.scrollLeft;
            syncing = false;
        }

        // Ищем таблицу, для которой нужно показать закреплённую шапку
        const headerTable = tables.find(table => {
            const rect = table.getBoundingClientRect();

            return (
                rect.top < 54 &&
                rect.bottom > 54
            );
        });

        activeTable = headerTable || null;

        updateStickyHeader();
    }

    tables.forEach(table => {
        table.addEventListener("scroll", () => {
            if (table === activeTable && !syncing) {
                syncing = true;
                bar.scrollLeft = table.scrollLeft;
                syncing = false;

                updateStickyHeader();
            }
        });
    });

    bar.addEventListener("scroll", () => {
        if (activeTable && !syncing) {
            syncing = true;
            activeTable.scrollLeft = bar.scrollLeft;
            updateStickyHeader();
            syncing = false;
        }
    });

    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    // Создаём закреплённую копию шапки
    stickyHeader = document.createElement("div");
    stickyHeader.className = "floating-table-header";
    stickyHeader.style.display = "none";

    stickyTable = document.createElement("table");
    stickyHead = document.createElement("thead");

    stickyTable.appendChild(stickyHead);
    stickyHeader.appendChild(stickyTable);
    document.body.appendChild(stickyHeader);


    function updateStickyHeader() {
        if (!stickyHeader || !activeTable) {
            stickyHeader.style.display = "none";
            return;
        }

        const rect = activeTable.getBoundingClientRect();
        const head = activeTable.querySelector("thead");

        if (!head) {
            stickyHeader.style.display = "none";
            return;
        }

        const headerBottom = 53;
        const headHeight = head.getBoundingClientRect().height;

        // Показываем шапку, пока таблица находится под шапкой сайта
        const visible =
            rect.top < headerBottom &&
            rect.bottom > headerBottom;

        if (!visible) {
            stickyHeader.style.display = "none";
            return;
        }

        stickyHeader.style.display = "block";
        stickyHeader.style.top = headerBottom + "px";
        stickyHeader.style.left = rect.left + "px";
        stickyHeader.style.width = rect.width + "px";
        stickyHeader.style.height = headHeight + "px";

        // Копируем структуру оригинальной таблицы
        stickyTable.style.width = activeTable.scrollWidth + "px";
        stickyTable.style.tableLayout = "fixed";
        stickyTable.style.borderCollapse = getComputedStyle(activeTable).borderCollapse;

        stickyHead.innerHTML = head.innerHTML;

        // Повторяем ширину каждой колонки
        const originalCells = head.querySelectorAll("th");
        const copiedCells = stickyHead.querySelectorAll("th");

        originalCells.forEach((cell, index) => {
            if (copiedCells[index]) {
                const width = cell.getBoundingClientRect().width;
                copiedCells[index].style.width = width + "px";
                copiedCells[index].style.minWidth = width + "px";
                copiedCells[index].style.maxWidth = width + "px";
            }
        });

        stickyTable.scrollLeft = activeTable.scrollLeft;
    }


    update();
});
