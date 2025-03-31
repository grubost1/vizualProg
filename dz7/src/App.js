import React from 'react';
import DataSet from './components/DataSet';
import "./App.css"

function App() {
  const headers = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    {key: 'сity', label: 'City'}
  ];

  const data = [
    { name: 'Данил', age: 10, сity: 'Новосибирск'},
    { name: 'Шпаков', age: 20, сity: 'Москва'},
    { name: 'Сергеевич', age: -10, сity: 'Томск'},
  ];

  return (
    <div className='container'>
      <h1>Таблица</h1>
      <DataSet
        headers={headers}
        data={data}
        renderHeader={(header) => <strong>{header.label}</strong>}
        renderRow={(item, header) => <span>{item[header.key]}</span>}
      />
    </div>
  );
}

export default App;