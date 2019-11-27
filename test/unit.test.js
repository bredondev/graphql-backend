const { paginateResults } = require('../src/utils/tools');

const anArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

describe('Test paginateResults', () => {
  it('page: 2, pageSize: 4', () => {
    const res = paginateResults({ page: 2, pageSize: 4, results: anArray });
    expect(res).toEqual([4, 5, 6, 7]);
  });
  it('page: 2, pageSize: 6', () => {
    const res = paginateResults({ page: 2, pageSize: 6, results: anArray });
    expect(res).toEqual([6, 7, 8, 9]);
  });
  it('page: 5, pageSize: 5', () => {
    const res = paginateResults({ page: 5, pageSize: 5, results: anArray });
    expect(res).toEqual([]);
  });
});