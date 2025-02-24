const orderBy = require('./orderBy');

describe('orderBy function with valid input', () => {
    test('should sort by multiple keys correctly', () => {
        const data = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
            { name: 'Alice', age: 22 },
            { name: 'Charlie', age: 35 }
        ];
        const keys = ['name', 'age'];
        const expected = [
            { name: 'Alice', age: 22 },
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
            { name: 'Charlie', age: 35 }
        ];

        const result = orderBy(data, keys);
        expect(result).toEqual(expected);
    });

    test('should handle empty array', () => {
        const data = [];
        const keys = ['name', 'age'];
        const expected = [];

        const result = orderBy(data, keys);
        expect(result).toEqual(expected);
    });

    test('should handle sorting with one key', () => {
        const data = [
            { age: 30 },
            { age: 25 },
            { age: 22 },
            { age: 35 }
        ];
        const keys = ['age'];
        const expected = [
            { age: 22 },
            { age: 25 },
            { age: 30 },
            { age: 35 }
        ];

        const result = orderBy(data, keys);
        expect(result).toEqual(expected);
    });
});

describe('orderBy function with invalid input', () => {
    test('should throw error if first argument is not an array', () => {
        const data = 'not an array';
        const keys = ['name'];

        expect(() => orderBy(data, keys)).toThrow('Первый аргумент должен быть массивом');
    });

    test('should throw error if second argument is not an array of strings', () => {
        const data = [{ name: 'Alice' }, { name: 'Bob' }];
        const keys = 'not an array';

        expect(() => orderBy(data, keys)).toThrow('Второй аргумент должен быть массивом строк');
    });

    test('should throw error if elements in the array are not objects', () => {
        const data = [1, 2, 3];
        const keys = ['name'];

        expect(() => orderBy(data, keys)).toThrow('Каждый элемент массива должен быть объектом');
    });

    test('should throw error if a property is missing in one of the objects', () => {
        const data = [{ name: 'Alice' }, { age: 25 }];
        const keys = ['name', 'age'];
    
        expect(() => orderBy(data, keys)).toThrow(/отсутствует.*name/i);
    });
});