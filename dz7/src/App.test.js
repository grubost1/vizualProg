import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataSet from './components/DataSet';

describe('DataSet Component', () => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
  ];

  const data = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 },
  ];

  test('Правильно обрабатывает заголовки и данные', () => {
    render(<DataSet headers={headers} data={data} />);

    // Проверяем заголовки
    headers.forEach((header) => {
      expect(screen.getByText(header.label)).toBeInTheDocument();
    });

    // Проверяем данные
    data.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.age.toString())).toBeInTheDocument();
    });
  });

  test('Выделяет строку при нажатии', () => {
    render(<DataSet headers={headers} data={data} />);

    const firstRow = screen.getAllByRole('row')[1]; // Первая строка данных
    fireEvent.click(firstRow);

    expect(firstRow).toHaveClass('selected');
  });

  test('Позволяет выделять несколько строк с помощью Ctrl', () => {
    render(<DataSet headers={headers} data={data} />);

    const firstRow = screen.getAllByRole('row')[1];
    const secondRow = screen.getAllByRole('row')[2];

    fireEvent.click(firstRow);
    fireEvent.click(secondRow, { ctrlKey: true });

    expect(firstRow).toHaveClass('selected');
    expect(secondRow).toHaveClass('selected');
  });

  test('Убирает выделение строки при повторном нажатии', () => {
    render(<DataSet headers={headers} data={data} />);

    const firstRow = screen.getAllByRole('row')[1]; // Первая строка данных
    fireEvent.click(firstRow); // Выделяем строку
    fireEvent.click(firstRow); // Кликаем снова

    expect(firstRow).not.toHaveClass('selected');
  });

  test('Выделяет ячейку при нажатии', () => {
    render(<DataSet headers={headers} data={data} />);

    const firstCell = screen.getAllByRole('cell')[1]; // Первая ячейка данных (ID первой строки)
    fireEvent.click(firstCell);

    expect(firstCell).toHaveClass('cell-selected');
  });

  test('Убирает выделение ячейки при повторном нажатии с помощью Ctrl', () => {
    render(<DataSet headers={headers} data={data} />);

    const firstCell = screen.getAllByRole('cell')[1]; // Первая ячейка данных (ID первой строки)
    fireEvent.click(firstCell); // Выделяем ячейку
    fireEvent.click(firstCell, { ctrlKey: true }); // Кликаем с зажатой клавишей Ctrl

    expect(firstCell).not.toHaveClass('cell-selected');
  });

  test('Не убирает выделение строки при выделении другой', () => {
    render(<DataSet headers={headers} data={data} />);

    const firstRow = screen.getAllByRole('row')[1]; // Первая строка данных
    const firstCell = screen.getAllByRole('cell')[1]; // Первая ячейка данных (ID первой строки)

    fireEvent.click(firstRow); // Выделяем строку
    fireEvent.click(firstCell); // Выделяем ячейку

    expect(firstRow).toHaveClass('selected'); // Строка все еще выделена
    expect(firstCell).toHaveClass('cell-selected'); // Ячейка выделена
  });
});