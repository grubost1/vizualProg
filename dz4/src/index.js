import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ReactBook from './App';
import loadData from './loadData';
//import getIsbn from './getIsbn';

const root = ReactDOM.createRoot(document.getElementById('root'));

let massiv = await loadData();
// massiv.forEach(element => {
//   root.render(
//     <ReactBook cover_name={getIsbn(element.isbn)} name_book={element.title} name_author={element.authors}/>
//   );
// });

function renderBooks(massiv) {
  const bookElements = massiv.map(element => {
    return (
      <ReactBook
        //cover_name={getIsbn(element.isbn)}
        cover_name="https://avatars.mds.yandex.net/i?id=d1d6099f4a430f3d5fa105a10b8450349250154a-12473708-images-thumbs&n=13"
        name_book={element.title}
        name_author={element.authors}
      />
    );
  });

  root.render(
    <>
      {bookElements}
    </>
  );
}

renderBooks(massiv);

// root.render(
//   <ReactBook cover_name="https://avatars.mds.yandex.net/i?id=d1d6099f4a430f3d5fa105a10b8450349250154a-12473708-images-thumbs&n=13" name_book="Ljagushka" name_author="Kro"/>
// );


