async function loadData() {
    const baseUrl = "https://fakeapi.extendsclass.com/books";

    const response = await fetch(baseUrl);
    const allData = await response.json();

    return await allData;
}

export default loadData;