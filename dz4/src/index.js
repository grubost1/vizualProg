import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import loadData from './loadData';
import BookList from './App';

const massiv = await loadData();
massiv.splice(16, 1);
massiv.push({
  "id": 17,
  "title": "Distributed Application Development with PowerBuilder 6.0",
  "isbn": "18847776866",
  "pageCount": 504,
  "authors": [
    "Michael J. Barlotta"
  ]
});

async function start() {

  const rootElement = document.getElementById('root');
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <BookList initialBooks={massiv} />
  );
}
start()