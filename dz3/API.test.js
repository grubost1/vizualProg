const calcStatsFromAPI = require("./calcStatsFromAPI");
const loadData = require("./loadData");

test("default", async () => {
    let newdata = [
        {
        breed: 'Turkish Van',
        country: 'developed in the United Kingdom founding stock from Turkey',
        origin: 'Natural',
        coat: 'Semi-long',
        pattern: 'Van'
        },
        {
        breed: 'York Chocolate',
        country: 'United States (New York)',
        origin: 'Natural',
        coat: 'Long',
        pattern: 'Solid'
        }
    ];

    const fMock = jest.spyOn(loadData, "loadData");
    fMock.mockImplementation(() => new Promise((resolve) => resolve(newdata)));
    let res = await calcStatsFromAPI.calcStatsFromAPI();
    fMock.mockRestore();

    let out = {'developed in the United Kingdom founding stock from Turkey': 1, 'United States (New York)': 1};
    expect(res).toEqual(out);
});