import React, { useEffect, useReducer } from 'react';
import DataSet from '../components/DataSet';
import AddForm from '../components/AddForm';
import * as Yup from 'yup';
import '../App.css';

const initialState = {
  users: [],
  loading: true,
  error: null,
};

// Headers for Users (including nested properties)
// Note: DataSet might need adjustment for nested properties like 'address.city'
const headers = [
  { property: 'id', label: 'ID' },
  { property: 'name', label: 'Name' },
  { property: 'username', label: 'Username' },
  { property: 'email', label: 'Email' },
  { property: 'address.street', label: 'Street' }, // Nested
  { property: 'address.suite', label: 'Suite' },   // Nested
  { property: 'address.city', label: 'City' },     // Nested
  { property: 'address.zipcode', label: 'Zipcode' }, // Nested
  { property: 'phone', label: 'Phone' },
  { property: 'website', label: 'Website' },
  { property: 'company.name', label: 'Company Name' }, // Nested
];

// Generic reducer
function dataReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, users: action.payload, loading: false };
    case 'ADD_ITEM':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        users: state.users.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_ITEMS':
      return {
        ...state,
        users: state.users.filter(
          (item) => !action.payload.includes(item.id)
        ),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Helper function to get nested property value
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// --- Formik & Yup Config for Users ---
const userValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  username: Yup.string().required('Username is required').min(3, 'Username too short'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  address: Yup.object({
    street: Yup.string().required('Street is required'),
    suite: Yup.string(), // Optional
    city: Yup.string().required('City is required'),
    zipcode: Yup.string().required('Zipcode is required').matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Invalid zipcode format'), // Basic US zipcode format
    // geo object is usually part of user data but often not editable directly in simple forms
  }),
  phone: Yup.string().required('Phone is required'), // Add more specific phone validation if needed
  website: Yup.string().url('Invalid URL format'), // Optional
  company: Yup.object({
    name: Yup.string().required('Company name is required'),
    // catchPhrase and bs are often part of user data but not typically form fields
  }),
});

const userInitialValues = {
  name: '',
  username: '',
  email: '',
  address: {
    street: '',
    suite: '',
    city: '',
    zipcode: '',
  },
  phone: '',
  website: '',
  company: {
    name: '',
  },
};

// Use dot notation for nested fields
const userFieldsConfig = [
  { name: 'name', label: 'Name' },
  { name: 'username', label: 'Username' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'website', label: 'Website', type: 'url' },
  // Address fields
  { name: 'address.street', label: 'Street' },
  { name: 'address.suite', label: 'Suite' },
  { name: 'address.city', label: 'City' },
  { name: 'address.zipcode', label: 'Zipcode' },
  // Company field
  { name: 'company.name', label: 'Company Name' },
];
// --- End Formik & Yup Config ---

function UsersPage() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Fetch Users
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.ok ? response.json() : Promise.reject('Failed to load users'))
      .then(data => dispatch({ type: 'SET_DATA', payload: data }))
      .catch(error => dispatch({ type: 'SET_ERROR', payload: error.toString() }));
  }, []);

  // Add User Handler
  const handleAddUser = (newUser) => {
    const maxId = state.users.length > 0 ? Math.max(...state.users.map(item => item.id)) : 0;
    // JSONPlaceholder expects the full structure, including nested objects
    const optimisticUser = { ...newUser, id: maxId + 1 };
    dispatch({ type: 'ADD_ITEM', payload: optimisticUser });

    fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST', body: JSON.stringify(newUser), headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to add user'))
    // Note: JSONPlaceholder might return the posted object *with a new ID* (e.g., 11)
    // We update our optimistic user ID with the ID returned by the server.
    .then(addedUser => dispatch({ type: 'UPDATE_ITEM', payload: { ...addedUser, id: optimisticUser.id } }))
    .catch(error => {
        console.error("Error adding user:", error);
        dispatch({ type: 'DELETE_ITEMS', payload: [optimisticUser.id] });
        dispatch({ type: 'SET_ERROR', payload: `Error adding user: ${error}` });
    });
  };

  // Update User Handler
  const handleUpdateUser = (updatedUser) => {
    dispatch({ type: 'UPDATE_ITEM', payload: updatedUser });
    fetch(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, {
        method: 'PUT', body: JSON.stringify(updatedUser), headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to update user'))
    .then(data => console.log("Update successful:", data))
    .catch(error => {
        console.error("Error updating user:", error);
        dispatch({ type: 'SET_ERROR', payload: `Error updating user: ${error}` });
        // Consider reverting optimistic update
    });
  };

  // Delete Users Handler
  const handleDeleteUsers = (selectedIds) => {
    dispatch({ type: 'DELETE_ITEMS', payload: selectedIds });
    selectedIds.forEach(id => {
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { method: 'DELETE' })
         .then(response => {
            if (!response.ok) console.warn(`Attempted to delete user ${id}, status: ${response.status}`);
             else console.log(`User ${id} delete request sent.`);
        })
        .catch(error => {
            console.error("Error deleting user:", error);
            dispatch({ type: 'SET_ERROR', payload: `Error deleting user: ${error}` });
            // Consider reverting optimistic update
        });
    });
  };

   // Custom cell renderer for DataSet to handle nested properties
  const renderUserCell = (item, header) => {
    const value = getNestedValue(item, header.property);
    // Handle potential undefined values if nesting is deep or data inconsistent
    return value !== undefined && value !== null ? String(value) : '';
  };


  if (state.loading) return <p>Loading users...</p>;
  if (state.error) return <p>Error loading users: {state.error}</p>;

  return (
    <div>
      <h2>Users</h2>
      {/* Add the Formik form */}
      <AddForm
        initialValues={userInitialValues}
        validationSchema={userValidationSchema}
        onSubmit={handleAddUser} // Pass the add handler
        fieldsConfig={userFieldsConfig} // Pass the field configuration
      />
      {/* DataSet component */}
      <DataSet
        headers={headers}
        data={state.users}
        onUpdate={handleUpdateUser}
        onDelete={handleDeleteUsers}
        renderCell={renderUserCell} // Pass custom renderer
      />
    </div>
  );
}

export default UsersPage; 