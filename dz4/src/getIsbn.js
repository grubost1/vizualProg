async function getBookCoverByISBN(isbn) {
    try {
      console.log(isbn);
      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.items || !data.items[0]?.volumeInfo?.imageLinks?.thumbnail) {
        console.warn(`Обложка для ISBN ${isbn} не найдена`);
        return null;
      }
  
      const imageUrl = data.items[0].volumeInfo.imageLinks.thumbnail;
  
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();

      const arrayBuffer = await imageBlob.arrayBuffer();
  
      const base64String = arrayBufferToBase64(arrayBuffer);
  
      return `data:${imageBlob.type};base64,${base64String}`;
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