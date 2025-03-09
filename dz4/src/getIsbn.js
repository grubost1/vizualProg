async function getBookCoverByISBN(isbn) {
    try {
        console.log(isbn);
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return await data.items[0].volumeInfo.imageLinks.thumbnail;
    }
    catch {
        return null;
    }
    
      
}

export default getBookCoverByISBN