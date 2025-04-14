import React, { useState } from 'react';
import "./DataSet.css";

// Helper function to update nested properties
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || current[key] === null) {
      // If a nested object doesn't exist, create it.
      // Be cautious with this; ensure it matches expected structure.
      current[key] = {}; 
    }
    current = current[key];
  }
  // Set the value on the final key
  current[keys[keys.length - 1]] = value;
};

const DataSet = ({
  headers,
  data,
  onAdd,
  onDelete,
  onUpdate,
  renderHeader = (header) => header.label || header.property,
  renderCell,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null); // Индекс строки для редактирования
  const [editedData, setEditedData] = useState({}); // Хранение изменяемых данных

  // Обработчик клика по строке
  const handleRowClick = (index, event) => {
    const isCtrlPressed = event.ctrlKey;

    if (isCtrlPressed) {
      setSelectedRows((prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((rowIndex) => rowIndex !== index)
          : [...prevSelected, index]
      );
    } else {
      setSelectedRows(isSelected(index) ? [] : [index]);
    }
  };

  // Проверка, является ли строка выделенной
  const isSelected = (index) => selectedRows.includes(index);

  // Получение заголовков столбцов
  const getHeaders = () => {
    if (headers && headers.length > 0) {
      return headers;
    }

    if (data && data.length > 0) {
      return Object.keys(data[0]).map((key) => ({ property: key }));
    }

    return [];
  };

  // Начало редактирования строки
  const startEditing = (rowIndex) => {
    setEditingRow(rowIndex);
    // Deep clone the object to avoid modifying the original data directly
    // Especially important for nested objects
    setEditedData(JSON.parse(JSON.stringify(data[rowIndex])));
  };

  // Отмена редактирования
  const cancelEditing = () => {
    setEditingRow(null);
    setEditedData({});
  };

  // Сохранение изменений
  const saveChanges = () => {
    if (onUpdate && editingRow !== null) {
      onUpdate(editedData);
      setEditingRow(null);
      setEditedData({});
    }
  };

  // Обработчик удаления выделенных строк
  const handleDeleteSelected = () => {
    if (onDelete) {
      const selectedIds = selectedRows.map((index) => data[index].id);
      onDelete(selectedIds);
      setSelectedRows([]);
    }
  };

  // Helper function to get nested value for display in input
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // Default cell renderer if no custom one is provided
  const defaultRenderCell = (item, header) => {
    const value = getNestedValue(item, header.property); // Use helper here too
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value !== undefined && value !== null ? String(value) : '';
  };

  const currentRenderCell = renderCell || defaultRenderCell;

  return (
    <div>
      <div className="dataset-container">
        <table className="dataSetTable">
          <thead>
            <tr>
              <th className="selectableArea"></th>
              {getHeaders().map((header, index) => (
                <th key={index}>{renderHeader(header)}</th>
              ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr
                key={item.id || rowIndex}
                onClick={(event) => handleRowClick(rowIndex, event)}
                className={isSelected(rowIndex) ? 'selected' : ''}
              >
                <td className="selectableArea" onClick={(e) => { e.stopPropagation(); handleRowClick(rowIndex, e); }}>
                  {isSelected(rowIndex) ? '✓' : ''}
                </td>
                {getHeaders().map((header, colIndex) => (
                  <td key={colIndex}>
                    {editingRow === rowIndex ? (
                      <input
                        type="text"
                        // Use getNestedValue to display the correct initial value for nested fields
                        value={getNestedValue(editedData, header.property) || ''}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          // Create a deep copy to modify before setting state
                          const updatedEditedData = JSON.parse(JSON.stringify(editedData));
                          // Use the helper function to set the nested value
                          setNestedValue(updatedEditedData, header.property, newValue);
                          setEditedData(updatedEditedData);
                        }}
                      />
                    ) : (
                      currentRenderCell(item, header)
                    )}
                  </td>
                ))}
                <td>
                  {editingRow === rowIndex ? (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); saveChanges(); }} className='saveChanges'>Сохранить</button>
                      <button onClick={(e) => { e.stopPropagation(); cancelEditing(); }} className='cancelEditing'>Отмена</button>
                    </>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); startEditing(rowIndex); }} className='startEditing'>Редактировать</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleDeleteSelected} disabled={selectedRows.length === 0} className='handleDeleteSelected'>
        Удалить выделенные
      </button>
    </div>
  );
};

export default DataSet;