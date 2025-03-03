async function loadData() {
    const baseUrl = "https://catfact.ninja/breeds";
    let allData = [];
    let currentPage = baseUrl;

    while(currentPage) {
        const response = await fetch(currentPage);
        const data = await response.json();
        if (data && data.data) {
            allData = allData.concat(data.data);
        } else {
            break;
        }
        currentPage = data.next_page_url;
    }
    return await allData;
}

module.exports.loadData = loadData;
