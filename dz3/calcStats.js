function calcStats(catsInfo) {
    let info = {};
    catsInfo.forEach(element => {
        info[element.country] = (info[element.country] || 0) + 1;
    });
    return info;
}

module.exports.calcStats = calcStats;

