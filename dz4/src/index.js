import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ReactBook from './App';
import loadData from './loadData';
import getIsbn from './getIsbn'

const root = ReactDOM.createRoot(document.getElementById('root'));

let massiv = await loadData();

function BookElement({ element }) {
  const [coverName, setCoverName] = useState(null);

  useEffect(() => {
    async function fetchCover() {
      const isbn = element.isbn;
      if (isbn) {
        const cover = await getIsbn(isbn);
        setCoverName(cover);
      }
    }

    fetchCover();
  }, [element.isbn]);

  return (
    <ReactBook
      cover_name={coverName}
      name_book={element.title}
      name_author={element.authors}
    />
  );
}

function renderBooks(massiv) {
  const bookElements = massiv.map(element => (
    <BookElement key={element.isbn} element={element} />
  ));

  root.render(
    <>
      {bookElements}
    </>
  );
}

renderBooks(massiv);



