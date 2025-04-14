// src/pages/AlbumsPage.jsx
import React, { useEffect, useReducer } from 'react';
import DataSet from '../components/DataSet';
import AddForm from '../components/AddForm';
import * as Yup from 'yup';
import '../App.css';

const initialState = {
  albums: [],
  loading: true,
  error: null,
};

// Headers for Albums
const headers = [
  { property: 'id', label: 'ID' },
  { property: 'userId', label: 'User ID' },
  { property: 'title', label: 'Title' },
];

// Generic reducer (can be reused or adapted)
function dataReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, albums: action.payload, loading: false };
    case 'ADD_ITEM':
      return { ...state, albums: [...state.albums, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        albums: state.albums.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_ITEMS':
      return {
        ...state,
        albums: state.albums.filter(
          (item) => !action.payload.includes(item.id)
        ),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// --- Formik & Yup Config for Albums ---
const albumValidationSchema = Yup.object({
  userId: Yup.number().required('User ID is required').positive().integer(),
  title: Yup.string().required('Title is required').min(5, 'Title must be at least 5 characters'),
});

const albumInitialValues = {
  userId: '',
  title: '',
};

const albumFieldsConfig = [
  { name: 'userId', label: 'User ID', type: 'number' },
  { name: 'title', label: 'Title', type: 'text' },
];
// --- End Formik & Yup Config ---

function AlbumsPage() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Fetch Albums
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/albums')
      .then(response => response.ok ? response.json() : Promise.reject('Failed to load albums'))
      .then(data => dispatch({ type: 'SET_DATA', payload: data }))
      .catch(error => dispatch({ type: 'SET_ERROR', payload: error.toString() }));
  }, []);

  // Add Album Handler
  const handleAddAlbum = (newAlbum) => {
    const maxId = state.albums.length > 0 ? Math.max(...state.albums.map(item => item.id)) : 0;
    const optimisticAlbum = { ...newAlbum, id: maxId + 1 };
    dispatch({ type: 'ADD_ITEM', payload: optimisticAlbum });

    fetch('https://jsonplaceholder.typicode.com/albums', {
        method: 'POST', body: JSON.stringify(newAlbum), headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to add album'))
    .then(addedAlbum => dispatch({ type: 'UPDATE_ITEM', payload: { ...addedAlbum, id: optimisticAlbum.id } }))
    .catch(error => {
        console.error("Error adding album:", error);
        dispatch({ type: 'DELETE_ITEMS', payload: [optimisticAlbum.id] });
        dispatch({ type: 'SET_ERROR', payload: `Error adding album: ${error}` });
    });
  };

  // Update Album Handler
  const handleUpdateAlbum = (updatedAlbum) => {
    // Ensure userId is a number
    const albumToSend = {
      ...updatedAlbum,
      userId: Number(updatedAlbum.userId) || 0,
    };

    // Optimistic update with corrected type
    dispatch({ type: 'UPDATE_ITEM', payload: albumToSend });

    fetch(`https://jsonplaceholder.typicode.com/albums/${albumToSend.id}`, {
        method: 'PUT', 
        body: JSON.stringify(albumToSend), // Send corrected data
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to update album'))
    .then(data => console.log("Update successful:", data))
    .catch(error => {
        console.error("Error updating album:", error);
        dispatch({ type: 'SET_ERROR', payload: `Error updating album: ${error}` });
        // Consider reverting optimistic update
    });
  };

  // Delete Albums Handler
  const handleDeleteAlbums = (selectedIds) => {
    dispatch({ type: 'DELETE_ITEMS', payload: selectedIds });
    selectedIds.forEach(id => {
        fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) console.warn(`Attempted to delete album ${id}, status: ${response.status}`);
            else console.log(`Album ${id} delete request sent.`);
        })
        .catch(error => {
            console.error("Error deleting album:", error);
            dispatch({ type: 'SET_ERROR', payload: `Error deleting album: ${error}` });
            // Consider reverting optimistic update for this ID
        });
    });
  };

  if (state.loading) return <p>Loading albums...</p>;
  if (state.error) return <p>Error loading albums: {state.error}</p>;

  return (
    <div>
      <h2>Albums</h2>
      {/* Add the Formik form */}
      <AddForm
        initialValues={albumInitialValues}
        validationSchema={albumValidationSchema}
        onSubmit={handleAddAlbum}
        fieldsConfig={albumFieldsConfig}
      />
      {/* DataSet component */}
      <DataSet
        headers={headers}
        data={state.albums}
        onUpdate={handleUpdateAlbum}
        onDelete={handleDeleteAlbums}
      />
    </div>
  );
}

export default AlbumsPage; 