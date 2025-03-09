// async function getBookCoverByISBN(isbn) {
//     try {
//         console.log(isbn);
//         const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
//         const response = await fetch(apiUrl);
//         const data = await response.json();
//         //console.log(await data.items[0].volumeInfo.imageLinks.thumbnail);
//         return data.items[0].volumeInfo.imageLinks.thumbnail;
        
//     }
//     catch {
//         return null;
//     }
// }


async function getBookCoverByISBN(isbn) {
    try {
      console.log(isbn);
      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.items && data.items.length > 0 && data.items[0].volumeInfo.imageLinks && data.items[0].volumeInfo.imageLinks.thumbnail) {
        const imageUrl = data.items[0].volumeInfo.imageLinks.thumbnail;
  
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();

        const arrayBuffer = await imageBlob.arrayBuffer();
  
        const base64String = arrayBufferToBase64(arrayBuffer);
  
        return `data:${imageBlob.type};base64,${base64String}`;
      }
      return null;
    } catch (error) {
      console.error("Ошибка при получении обложки:", error);
      return null;
    }
  }
  
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

export default getBookCoverByISBN