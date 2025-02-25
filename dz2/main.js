const orderBy = require('./orderBy');

const massive = [
    { name: 'I', age: 20 },
    { name: 'Danil', age: 50 },
    { name: 'Shpakov', age: 10 },
    { name: 'Sergeevich', age: 80 },
    { name: 'ustal', age: 57 },
    { name: 'delat', age: 78 },
    { name: 'labu', age: 90 },
    { name: 'labu', age: 80 }
];

try {
    const sortedmassive = orderBy(massive, ['name', 'age']);

    console.log('Массив отсортирован:');
    console.log(sortedmassive);
} catch (error) {
    console.error('Ошибка:', error.message);
}