const loadData = require("./loadData");
const calcStats = require("./calcStats");

async function calcStatsFromAPI() {
    let data = await loadData.loadData();
    let Stats = calcStats.calcStats(data);
    return Stats;
}

module.exports.calcStatsFromAPI = calcStatsFromAPI;