import React, { useState } from "react";
import data from "./example-data.json";
import HierarchyTable from "./HierarchyTable";
import "./table.css";

// Funkce pro odstranění položky podle ID
function removeItemById(items, idToRemove) {
  return items
    .map((item) => {
      // Pokud najdeme položku s hledaným ID, odstraníme ji
      if (item.data?.ID === idToRemove) return null;

      // Pokud položka nemá děti, vrátíme ji beze změny
      if (!item.children) return item;

      // Projdeme všechny kategorie dětí (has_nemesis, has_secrete, atd.)
      const newChildren = {};
      for (const [category, categoryData] of Object.entries(item.children)) {
        if (categoryData.records && categoryData.records.length > 0) {
          // Rekurzivně odstraníme položky z vnořených záznamů
          const newRecords = removeItemById(categoryData.records, idToRemove);
          if (newRecords.length > 0) {
            newChildren[category] = { records: newRecords };
          }
        }
      }

      // Vrátíme položku s aktualizovanými dětmi
      return { ...item, children: newChildren };
    })
    .filter(Boolean); // Odstraníme null hodnoty
}

export default function App() {
  const [items, setItems] = useState(data);

  const handleRemove = (id) => {
    setItems((prevItems) => removeItemById(prevItems, id));
  };

  return (
    <div className="app">
      <h1>Hierarchy Table</h1>
      <HierarchyTable data={items} onRemove={handleRemove} />
    </div>
  );
}
