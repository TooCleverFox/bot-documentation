
document$.subscribe(function() {
  const tables = document.querySelectorAll("article table");

  tables.forEach(function(table) {
    if (table.dataset.sortableInitialized) {
      return;
    }

    new Tablesort(table);
    table.dataset.sortableInitialized = "true";
  });
});