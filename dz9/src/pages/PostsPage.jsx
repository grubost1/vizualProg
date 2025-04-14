import React, { useEffect, useReducer } from 'react';
import DataSet from '../components/DataSet'; // Adjust path if needed
import AddForm from '../components/AddForm'; // Import AddForm
import * as Yup from 'yup'; // Import Yup
import '../App.css'; // Or a specific CSS file for the page

const initialState = {
  posts: [],
  loading: true,
  error: null,
};

// Define appropriate headers for the posts table
const headers = [
  { property: 'id', label: 'ID' },
  { property: 'userId', label: 'User ID' },
  { property: 'title', label: 'Title' },
  { property: 'body', label: 'Body' },
];

function postsReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, posts: action.payload, loading: false };
    case 'ADD_ITEM': // Renamed for generality
      return { ...state, posts: [...state.posts, action.payload] };
    case 'UPDATE_ITEM': // Renamed for generality
      return {
        ...state,
        posts: state.posts.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_ITEMS': // Renamed for generality
      return {
        ...state,
        posts: state.posts.filter(
          (item) => !action.payload.includes(item.id)
        ),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Define Yup validation schema for Posts
const postValidationSchema = Yup.object({
  userId: Yup.number().required('User ID is required').positive('User ID must be positive').integer(),
  title: Yup.string().required('Title is required').min(5, 'Title must be at least 5 characters'),
  body: Yup.string().required('Body is required').min(10, 'Body must be at least 10 characters'),
});

// Define initial values for the Post form
const postInitialValues = {
  userId: '', // Or perhaps a default user ID if applicable
  title: '',
  body: '',
};

// Configuration for the fields in the Post form
const postFieldsConfig = [
  { name: 'userId', label: 'User ID', type: 'number' },
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'body', label: 'Body', type: 'textarea' }, // Use textarea for body
];

function PostsPage() {
  const [state, dispatch] = useReducer(postsReducer, initialState);

  // Fetch posts data
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => dispatch({ type: 'SET_DATA', payload: data }))
      .catch((error) => dispatch({ type: 'SET_ERROR', payload: error.message }));
  }, []);

  // Add Post Handler (Placeholder - Formik form will call this)
  const handleAddPost = (newPost) => {
     // Optimistic UI update
     const maxId = state.posts.length > 0 ? Math.max(...state.posts.map(item => item.id)) : 0;
     const optimisticPost = { ...newPost, id: maxId + 1 }; // Assign temporary ID
     dispatch({ type: 'ADD_ITEM', payload: optimisticPost });

     fetch('https://jsonplaceholder.typicode.com/posts', {
         method: 'POST',
         body: JSON.stringify(newPost), // Send original data without temp ID
         headers: { 'Content-type': 'application/json; charset=UTF-8' },
     })
     .then(response => {
         if (!response.ok) throw new Error('Failed to add post');
         return response.json();
     })
     .then(addedPostFromServer => {
         // Update the item with the ID from the server
         dispatch({ type: 'UPDATE_ITEM', payload: { ...addedPostFromServer, id: optimisticPost.id } });
         // Note: JSONPlaceholder POST usually returns the new object with a new ID like 101
         // A real API might require updating the temp ID with the real one.
         // For simplicity here, we assume the optimistic ID might need replacement or confirmation.
         // Ideally, the server response should guide how to update the state accurately.
     })
     .catch(error => {
         console.error("Error adding post:", error);
         // Revert optimistic update
         dispatch({ type: 'DELETE_ITEMS', payload: [optimisticPost.id] });
         dispatch({ type: 'SET_ERROR', payload: `Error adding post: ${error.message}` });
     });
  };


  // Update Post Handler
  const handleUpdatePost = (updatedPost) => {
    // Ensure userId is a number before dispatching and sending
    const postToSend = {
      ...updatedPost,
      userId: Number(updatedPost.userId) || 0, // Convert userId to number, default to 0 if conversion fails
    };

    // Optimistic UI update with potentially corrected data type
    dispatch({ type: 'UPDATE_ITEM', payload: postToSend });

    fetch(`https://jsonplaceholder.typicode.com/posts/${postToSend.id}`, {
      method: 'PUT', 
      body: JSON.stringify(postToSend), // Send the version with corrected userId type
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to update post');
        return response.json();
    })
    .then(data => {
        // Optionally re-dispatch if server returns slightly different data
        // Ensure userId is number here too if re-dispatching
        // const receivedData = { ...data, userId: Number(data.userId) || 0 };
        // dispatch({ type: 'UPDATE_ITEM', payload: receivedData }); 
        console.log("Update successful:", data);
    })
    .catch(error => {
        console.error("Error updating post:", error);
        dispatch({ type: 'SET_ERROR', payload: `Error updating post: ${error.message}` });
        // Revert optimistic update: fetch original or store temporarily
        // Finding the original state requires more complex logic, maybe store it on edit start
        // For now, we leave the optimistic state
    });
  };

  // Delete Posts Handler
  const handleDeletePosts = (selectedIds) => {
    // Optimistic UI update
    dispatch({ type: 'DELETE_ITEMS', payload: selectedIds });

    // Send delete requests for each selected ID
    selectedIds.forEach(id => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                // Note: JSONPlaceholder DELETE returns {} with 200 status, even for non-existent IDs
                console.warn(`Attempted to delete post ${id}, server response status: ${response.status}`);
                // Throw error only on real network/server issues, not 404s if expected
                if (response.status >= 500) throw new Error(`Server error deleting post ${id}`);
                 // if response.status === 404 - maybe just log it?
            }
             console.log(`Post ${id} delete request sent.`);
        })
        .catch(error => {
            console.error("Error deleting post:", error);
            dispatch({ type: 'SET_ERROR', payload: `Error deleting post: ${error.message}` });
            // Revert optimistic update for the failed ID
            // This is complex as you need the original item state.
            // Fetching the data again or reverting based on stored state might be needed.
            // For simplicity, we'll just log the error. A robust implementation needs better error handling.
        });
    });
  };


  if (state.loading) return <p>Loading posts...</p>;
  if (state.error) return <p>Error loading posts: {state.error}</p>;

  return (
    <div>
      <h2>Posts</h2>
      {/* Add the Formik form */}
      <AddForm
        initialValues={postInitialValues}
        validationSchema={postValidationSchema}
        onSubmit={handleAddPost} // Pass the add handler
        fieldsConfig={postFieldsConfig} // Pass the field configuration
      />
      {/* DataSet component */}
      <DataSet
        headers={headers}
        data={state.posts}
        // Pass the handlers to DataSet - Note: onAdd will be triggered by the new Formik form later
        onUpdate={handleUpdatePost}
        onDelete={handleDeletePosts}
        // The 'onAdd' prop for DataSet might become obsolete or repurposed
        // depending on how the Formik form is integrated.
        // For now, let's keep the structure similar.
        // We will remove the internal Add form from DataSet next.
      />
    </div>
  );
}

export default PostsPage; 