import React, { useState } from 'react';
import BookElement from './BookElement';

function BookList({ initialBooks }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const sortedAndFilteredBooks = () => {
    let filtered = initialBooks.filter(book => {
      if (!searchTerm.trim()) return true;
      const searchStr = `${book.title} ${book.authors}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    });
  
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
      }
    });
    return filtered;
  };

  const bookElements = sortedAndFilteredBooks().map(element => (
    <BookElement key={element.isbn} element={element} />
  ));

  return (
    <div>
      <input
        type="text"
        placeholder="Поиск по названию или автору"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="Poisk">
        <label>Сортировать по:</label>
        <select value={sortField} onChange={handleSortFieldChange}>
          <option value="title">Названию</option>
          <option value="authors">Автору</option>
        </select>

        <select value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Возрастанию</option>
          <option value="desc">Убыванию</option>
        </select>
      </div>

      <div className="Main">
        {bookElements}
      </div>
    </div>
  );
}

export default BookList;