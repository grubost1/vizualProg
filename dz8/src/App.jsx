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
    fetch('http://localhost:5063/comments') // Бэкенд API
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'SET_COMMENTS', payload: data }))
      .catch((error) => dispatch({ type: 'SET_ERROR', payload: error.message }));
  }, []);

  // Добавление нового комментария
  const handleAddComment = (newComment) => {
    const maxId = state.comments.length > 0 ? Math.max(...state.comments.map((item) => item.id)) : 0;
    const optimisticComment = { ...newComment, id: maxId + 1 };

    dispatch({ type: 'ADD_COMMENT', payload: optimisticComment });

    fetch('http://localhost:5063/comments', {
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
        dispatch({ type: 'UPDATE_COMMENT', payload: { ...data, id: optimisticComment.id } });
      })
      .catch((error) => {
        console.error(error);
        dispatch({
          type: 'DELETE_COMMENTS',
          payload: [optimisticComment.id],
        });
      });
  };

  // Обновление комментария
  const handleUpdateComment = (updatedComment) => {
    dispatch({ type: 'UPDATE_COMMENT', payload: updatedComment });
  
    fetch(`http://localhost:5063/comments/${updatedComment.id}`, {
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
        // Если статус 204 (No Content), возвращаем null
        if (response.status === 204) {
          return null;
        }
        return response.json();
      })
      .then((data) => {
        // Если ответ null, используем отправленный объект
        const updatedData = data || updatedComment;
        dispatch({ type: 'UPDATE_COMMENT', payload: updatedData });
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
      if (typeof id !== 'number') return;
      fetch(`http://localhost:5063/comments/${id}`, {
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
    { property: 'text', label: 'Текст' },
    { property: 'author', label: 'Автор' },
    { property: 'email', label: 'Email' }, // Новый заголовок
  ];

  return (
    <div className="App">
      <h1>DataApp</h1>
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