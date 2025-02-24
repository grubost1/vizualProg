function isPlainObject(value) {
    return typeof value == 'object' && value != null && !Array.isArray(value);
}

function orderBy(array, keys) {
    if (!Array.isArray(array)) {
        throw new TypeError('Первый аргумент должен быть массивом');
    }

    if (!Array.isArray(keys) || !keys.every(key => typeof key == 'string')) {
        throw new TypeError('Второй аргумент должен быть массивом строк');
    }

    const result = [...array];

    result.sort((a, b) => {
        if (!isPlainObject(a) || !isPlainObject(b)) {
            throw new TypeError('Каждый элемент массива должен быть объектом');
        }

        for (const key of keys) {
            if (!(key in a)) {
                throw new Error(`Отсутствует свойство "${key}" в первом объекте`);
            }
            if (!(key in b)) {
                throw new Error(`Отсутствует свойство "${key}" во втором объекте`);
            }

            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
        }

        return 0;
    });

    return result;
}

module.exports = orderBy;