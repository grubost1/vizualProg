import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
// import DataSet from './components/DataSet'; // Will be used in page components
import './App.css';

// Import page components
import PostsPage from './pages/PostsPage'; // Import the new page
import AlbumsPage from './pages/AlbumsPage'; // Import AlbumsPage
import TodosPage from './pages/TodosPage';   // Import TodosPage
import UsersPage from './pages/UsersPage';   // Import UsersPage

// Placeholder components for pages - we will create actual files later
const HomePage = () => <h2>Home - Select a data type</h2>;
// const PostsPage = () => <h2>Posts Data</h2>; // Remove placeholder
// const AlbumsPage = () => <h2>Albums Data</h2>; // Remove placeholder
// const TodosPage = () => <h2>Todos Data</h2>; // Remove placeholder
// const UsersPage = () => <h2>Users Data</h2>; // Remove placeholder

function App() {
  // State and data fetching logic removed - will be moved to specific page components

  return (
    <div className="App app-container">
      <nav className="navigation">
        <h3>Data Types</h3>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          <li>
            <Link to="/albums">Albums</Link>
          </li>
          <li>
            <Link to="/todos">Todos</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;