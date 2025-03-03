const calcStatsFromAPI = require("./calcStatsFromAPI");

calcStatsFromAPI.calcStatsFromAPI()
    .then(stats => {
        console.log(stats);
    })