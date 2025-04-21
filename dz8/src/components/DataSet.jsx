import React, { useState } from 'react';
import "./DataSet.css";

const DataSet = ({
  headers,
  data,
  onAdd,
  onDelete,
  onUpdate,
  renderHeader = (header) => header.label || header.property,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [newComment, setNewComment] = useState({ author: '', email: '', text: '' });

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

  // Начало редактирования строки
  const startEditing = (rowIndex) => {
    setEditingRow(rowIndex);
    setEditedData({ ...data[rowIndex] });
  };

  // Отмена редактирования
  const cancelEditing = () => {
    setEditingRow(null);
    setEditedData({});
  };

  // Сохранение изменений
  const saveChanges = () => {
    if (onUpdate && editingRow !== null) {
      const updatedComment = {
        id: data[editingRow].id, // ID должен быть взят из текущего комментария
        text: editedData.text || '', // Убедитесь, что поле text присутствует
        author: editedData.author || '', // Убедитесь, что поле author присутствует
        email: editedData.email || '', // Убедитесь, что поле email присутствует
      };
      onUpdate(updatedComment);
      setEditingRow(null);
      setEditedData({});
    }
  };

  // Обработчик отправки нового комментария
  const handleAddComment = () => {
    if (onAdd) {
      const maxId = data.length > 0 ? Math.max(...data.map((item) => item.id)) : 0;
      const newCommentWithId = {
        id: maxId + 1,
        ...newComment,
      };
      onAdd(newCommentWithId);
      setNewComment({ author: '', email: '', text: '' });
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

  return (
    <div>
      <table className="dataSetTable">
        <thead>
          <tr>
            <th className="selectableArea"></th>
            {headers.map((header, index) => (
              <th key={index}>{renderHeader(header)}</th>
            ))}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={(event) => handleRowClick(rowIndex, event)}
              className={isSelected(rowIndex) ? 'selected' : ''}
            >
              <td className="selectableArea">{isSelected(rowIndex) ? '✓' : ''}</td>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>
                  {editingRow === rowIndex ? (
                    <input
                      type="text"
                      value={editedData[header.property] || ''}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          [header.property]: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item[header.property]
                  )}
                </td>
              ))}
              <td>
                {editingRow === rowIndex ? (
                  <>
                    <button onClick={saveChanges} className='saveChanges'>Сохранить</button>
                    <button onClick={cancelEditing} className='cancelEditing'>Отмена</button>
                  </>
                ) : (
                  <button onClick={() => startEditing(rowIndex)} className='startEditing'>Редактировать</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Форма добавления нового комментария */}
      <div className="form">
        <input
          type="text"
          placeholder="Автор"
          value={newComment.author}
          onChange={(e) =>
            setNewComment({ ...newComment, author: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Email"
          value={newComment.email}
          onChange={(e) =>
            setNewComment({ ...newComment, email: e.target.value })
          }
        />
        <textarea
          placeholder="Комментарий"
          value={newComment.text}
          onChange={(e) =>
            setNewComment({ ...newComment, text: e.target.value })
          }
        />
        <button onClick={handleAddComment}>Добавить</button>
      </div>

      {/* Кнопка удаления выделенных строк */}
      <button onClick={handleDeleteSelected} disabled={selectedRows.length === 0} className='handleDeleteSelected'>
        Удалить выделенные
      </button>
    </div>
  );
};

export default DataSet;