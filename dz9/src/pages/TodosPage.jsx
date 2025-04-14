// src/pages/TodosPage.jsx
import React, { useEffect, useReducer } from 'react';
import DataSet from '../components/DataSet';
import AddForm from '../components/AddForm'; // Import AddForm
import * as Yup from 'yup'; // Import Yup
import '../App.css';

// ... (initialState, headers, dataReducer remain the same, but check reducer for boolean) ...
const initialState = {
  todos: [],
  loading: true,
  error: null,
};

const headers = [
  { property: 'id', label: 'ID' },
  { property: 'userId', label: 'User ID' },
  { property: 'title', label: 'Title' },
  { property: 'completed', label: 'Completed' },
];

function dataReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, todos: action.payload, loading: false };
    case 'ADD_ITEM':
      const newItem = { ...action.payload, completed: !!action.payload.completed }; // Ensure boolean
      return { ...state, todos: [...state.todos, newItem] };
    case 'UPDATE_ITEM':
      const updatedItem = { ...action.payload, completed: !!action.payload.completed }; // Ensure boolean
      return {
        ...state,
        todos: state.todos.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        ),
      };
    case 'DELETE_ITEMS':
      return {
        ...state,
        todos: state.todos.filter(
          (item) => !action.payload.includes(item.id)
        ),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// --- Formik & Yup Config for Todos ---
const todoValidationSchema = Yup.object({
  userId: Yup.number().required('User ID is required').positive().integer(),
  title: Yup.string().required('Title is required').min(5, 'Title must be at least 5 characters'),
  completed: Yup.boolean(), // No specific validation, just expect boolean
});

const todoInitialValues = {
  userId: '',
  title: '',
  completed: false, // Default to false
};

const todoFieldsConfig = [
  { name: 'userId', label: 'User ID', type: 'number' },
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'completed', label: 'Completed', type: 'checkbox' }, // Use checkbox type
];
// --- End Formik & Yup Config ---

function TodosPage() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // ... (useEffect and handlers remain the same) ...
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.ok ? response.json() : Promise.reject('Failed to load todos'))
      .then(data => dispatch({ type: 'SET_DATA', payload: data }))
      .catch(error => dispatch({ type: 'SET_ERROR', payload: error.toString() }));
  }, []);

  const handleAddTodo = (newTodo) => {
    const maxId = state.todos.length > 0 ? Math.max(...state.todos.map(item => item.id)) : 0;
    const optimisticTodo = { ...newTodo, completed: !!newTodo.completed, id: maxId + 1 };
    dispatch({ type: 'ADD_ITEM', payload: optimisticTodo });

    fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST', body: JSON.stringify(newTodo), headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to add todo'))
    .then(addedTodo => dispatch({ type: 'UPDATE_ITEM', payload: { ...addedTodo, completed: !!addedTodo.completed, id: optimisticTodo.id } }))
    .catch(error => {
        console.error("Error adding todo:", error);
        dispatch({ type: 'DELETE_ITEMS', payload: [optimisticTodo.id] });
        dispatch({ type: 'SET_ERROR', payload: `Error adding todo: ${error}` });
    });
  };

  const handleUpdateTodo = (updatedTodo) => {
    const finalTodo = { ...updatedTodo, completed: !!updatedTodo.completed };
    dispatch({ type: 'UPDATE_ITEM', payload: finalTodo });

    fetch(`https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`, {
        method: 'PUT', body: JSON.stringify(finalTodo), headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to update todo'))
    .then(data => console.log("Update successful:", data))
    .catch(error => {
        console.error("Error updating todo:", error);
        dispatch({ type: 'SET_ERROR', payload: `Error updating todo: ${error}` });
    });
  };

  const handleDeleteTodos = (selectedIds) => {
    dispatch({ type: 'DELETE_ITEMS', payload: selectedIds });
    selectedIds.forEach(id => {
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) console.warn(`Attempted to delete todo ${id}, status: ${response.status}`);
             else console.log(`Todo ${id} delete request sent.`);
        })
        .catch(error => {
            console.error("Error deleting todo:", error);
            dispatch({ type: 'SET_ERROR', payload: `Error deleting todo: ${error}` });
        });
    });
  };


  if (state.loading) return <p>Loading todos...</p>;
  if (state.error) return <p>Error loading todos: {state.error}</p>;

  return (
    <div>
      <h2>Todos</h2>
      {/* Add the Formik form */}
      <AddForm
        initialValues={todoInitialValues}
        validationSchema={todoValidationSchema}
        onSubmit={handleAddTodo}
        fieldsConfig={todoFieldsConfig}
      />
      {/* DataSet component */}
      <DataSet
        headers={headers}
        data={state.todos}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodos}
        // onAdd prop removed from DataSet usage here
        // Optional: Add custom render function for 'completed' if needed
        // renderCell={(item, header) => header.property === 'completed' ? (item.completed ? 'Yes' : 'No') : item[header.property]}
        // Note: The default renderCell in DataSet now handles booleans
      />
    </div>
  );
}

export default TodosPage;