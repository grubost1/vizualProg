import React, { useState, useEffect } from 'react';
import ReactBook from './ReactBook';
import getIsbn from './getIsbn'


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

export default BookElement;