import React, { useState } from "react";

// Hlavní sloupce pro zobrazení v tabulce
const mainColumns = [
  "ID",
  "Name",
  "Gender",
  "Ability",
  "Minimal distance",
  "Weight",
  "Born",
  "In space since",
  "Beer consumption (l/y)",
  "Knows the answer?",
];

// Sloupce pro podřízené položky has_nemesis
const nemesisColumns = ["ID", "Character ID", "Is alive?", "Years"];

// Sloupce pro podřízené položky has_secrete
const secreteColumns = ["ID", "Nemesis ID", "Secrete Code"];

// Komponenta pro řádek tabulky
function TableRow({ item, level, onRemove, parentExpanded = true }) {
  const [expanded, setExpanded] = useState({});

  // ID položky pro účely rozbalování
  const id = item.data?.ID;

  // Zjištění, zda má položka děti
  const hasChildren =
    item.children &&
    Object.values(item.children).some(
      (cat) => cat.records && cat.records.length > 0
    );

  // Přepínání rozbalení/sbalení
  const toggleExpand = () => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Určení sloupců podle úrovně
  const getColumnsForLevel = () => {
    if (level === 0) return mainColumns;
    if (level === 1) return nemesisColumns;
    if (level === 2) return secreteColumns;
    return mainColumns;
  };

  // Vykreslení hodnoty v buňce
  const renderCell = (column) => {
    return item.data?.[column] ?? "";
  };

  // Vykreslení dětí položky
  const renderChildren = () => {
    if (!expanded[id] || !hasChildren) return null;

    return Object.entries(item.children).flatMap(([category, categoryData]) => {
      if (!categoryData.records || categoryData.records.length === 0) return [];

      return categoryData.records.map((child) => (
        <TableRow
          key={child.data?.ID}
          item={child}
          level={level + 1}
          onRemove={onRemove}
          parentExpanded={expanded[id]}
        />
      ));
    });
  };

  // Pokud rodič není rozbalen, nezobrazujeme nic
  if (!parentExpanded) return null;

  // Získání sloupců pro aktuální úroveň
  const columns = getColumnsForLevel();

  return (
    <>
      <tr className={`level-${level}`}>
        <td className="toggle-cell">
          {hasChildren ? (
            <button className="toggle-btn" onClick={toggleExpand}>
              {expanded[id] ? "▼" : "►"}
            </button>
          ) : (
            <span className="spacer"></span>
          )}
        </td>

        {columns.map((column) => (
          <td key={column}>{renderCell(column)}</td>
        ))}

        <td className="delete-cell">
          <button
            className="delete-btn"
            onClick={() => onRemove(id)}
            title="Remove"
          >
            ✖
          </button>
        </td>
      </tr>
      {renderChildren()}
    </>
  );
}

// Hlavní komponenta tabulky
function HierarchyTable({ data, onRemove }) {
  // Pokud nemáme data, zobrazíme prázdnou tabulku
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <table className="hierarchy-table">
      <thead>
        <tr>
          <th></th> {/* Sloupec pro tlačítka rozbalení */}
          {mainColumns.map((column) => (
            <th key={column}>{column}</th>
          ))}
          <th>delete</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <TableRow
            key={item.data?.ID}
            item={item}
            level={0}
            onRemove={onRemove}
          />
        ))}
      </tbody>
    </table>
  );
}

export default HierarchyTable;
