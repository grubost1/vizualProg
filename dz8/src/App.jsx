import React, { useState, useEffect, useReducer } from 'react';
import DataSet from './components/DataSet';
import './App.css';

const initialState = {
  comments: [],
  loading: true,
  error: null,
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'SET_COMMENTS':
      return { ...state, comments: action.payload, loading: false };
    case 'ADD_COMMENT':
      return { ...state, comments: [...state.comments, action.payload] };
    case 'UPDATE_COMMENT':
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.id ? action.payload : comment
        ),
      };
    case 'DELETE_COMMENTS':
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => !action.payload.includes(comment.id)
        ),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Загрузка данных с сервера
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/comments')
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'SET_COMMENTS', payload: data }))
      .catch((error) => dispatch({ type: 'SET_ERROR', payload: error.message }));
  }, []);

  // Добавление нового комментария
  const handleAddComment = (newComment) => {
    // Находим максимальный ID в текущих данных
    const maxId = state.comments.length > 0 ? Math.max(...state.comments.map((item) => item.id)) : 0;

    // Создаем новый комментарий с уникальным ID
    const optimisticComment = { ...newComment, id: maxId + 1 };

    // Добавляем комментарий оптимистически
    dispatch({ type: 'ADD_COMMENT', payload: optimisticComment });

    // Отправляем данные на сервер
    fetch('https://jsonplaceholder.typicode.com/comments', {
      method: 'POST',
      body: JSON.stringify(newComment),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при добавлении комментария');
        }
        return response.json();
      })
      .then((data) => {
        // Обновляем комментарий после успешного ответа от сервера
        dispatch({ type: 'UPDATE_COMMENT', payload: { ...data, id: optimisticComment.id } });
      })
      .catch((error) => {
        console.error(error);
        // Удаляем оптимистический комментарий в случае ошибки
        dispatch({
          type: 'DELETE_COMMENTS',
          payload: [optimisticComment.id],
        });
      });
  };

  // Обновление комментария
  const handleUpdateComment = (updatedComment) => {
    dispatch({ type: 'UPDATE_COMMENT', payload: updatedComment });

    fetch(`https://jsonplaceholder.typicode.com/comments/${updatedComment.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedComment),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при обновлении комментария');
        }
        return response.json();
      })
      .then((data) => {
        dispatch({ type: 'UPDATE_COMMENT', payload: data });
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      });
  };

  // Удаление выделенных комментариев
  const handleDeleteComments = (selectedIds) => {
    dispatch({ type: 'DELETE_COMMENTS', payload: selectedIds });

    selectedIds.forEach((id) => {
      if (typeof id !== 'number') return; // Пропускаем временные комментарии
      fetch(`https://jsonplaceholder.typicode.com/comments/${id}`, {
        method: 'DELETE',
      }).catch((error) => {
        console.error(error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      });
    });
  };

  // Заголовки таблицы
  const headers = [
    { property: 'id', label: 'ID' },
    { property: 'name', label: 'Имя' },
    { property: 'email', label: 'Email' },
    { property: 'body', label: 'Комментарий' },
  ];

  return (
    <div className="App">
      <h1>Comments</h1>
      {state.loading ? (
        <p>Loading...</p>
      ) : state.error ? (
        <p>{state.error}</p>
      ) : (
        <DataSet
          headers={headers}
          data={state.comments}
          onAdd={(newComment) => handleAddComment(newComment)}
          onDelete={(selectedIds) => handleDeleteComments(selectedIds)}
          onUpdate={(updatedComment) => handleUpdateComment(updatedComment)}
        />
      )}
    </div>
  );
}

export default App;