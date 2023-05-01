import { getWordSelection } from './get-word-selection';

describe('getWordSelection', () => {
  describe('Backward', () => {
    it('"1 23 456|" => select "456" => [5,8]', () => {
      expect(
        getWordSelection(
          {
            value: '1 23 456',
            selection: [
              8, // '1 23 456'.length
              8,
            ],
          },
          false,
        ),
      ).toEqual([
        5, // '1 23 '.length
        8,
      ]);
    });

    it('"1 23 45|6" => select "45" => [5,7]', () => {
      expect(
        getWordSelection(
          {
            value: '1 23 456',
            selection: [
              7, // '1 23 45'.length
              7,
            ],
          },
          false,
        ),
      ).toEqual([
        5, // '1 23 '.length
        7,
      ]);
    });

    it('"1 23 |456" => select "23 " => [2,5]', () => {
      expect(
        getWordSelection(
          {
            value: '1 23 456',
            selection: [
              5, // '1 23 '.length
              5,
            ],
          },
          false,
        ),
      ).toEqual([
        2, // '1 '.length
        5,
      ]);
    });

    it('"1 23| 456" => select "23" => [2,4]', () => {
      expect(
        getWordSelection(
          {
            value: '1 23 456',
            selection: [
              4, // '1 23'.length
              4,
            ],
          },
          false,
        ),
      ).toEqual([
        2, // '1 '.length
        4,
      ]);
    });

    it('"|1 23 456" => select "" => [0,0]', () => {
      expect(
        getWordSelection({ value: '1 23 456', selection: [0, 0] }, false),
      ).toEqual([0, 0]);
    });

    it('"1 2  |3" (two spaces after 2) => select "2  " => [2,5]', () => {
      expect(
        getWordSelection(
          {
            value: '1 2  3',
            selection: [
              5, // space before 3
              5,
            ],
          },
          false,
        ),
      ).toEqual([2, 5]);
    });
  });

  describe('Forward', () => {
    it('"1 23 456|" => select "" => [8,8]', () => {
      expect(
        getWordSelection(
          {
            value: '1 23 456',
            selection: [
              8, // '1 23 456'.length
              8,
            ],
          },
          true,
        ),
      ).toEqual([8, 8]);
    });

    it('"1 23 45|6" => select "6" => [7,8]', () => {
      expect(
        getWordSelection(
          {
            value: '1 23 456',
            selection: [
              7, // '1 23 45'.length
              7,
            ],
          },
          true,
        ),
      ).toEqual([7, 8]);
    });

    it('"1 23 |456" => select "456" => [5,8]', () => {
      expect(
        getWordSelection(
          {
            value: '1 23 456',
            selection: [
              5, // '1 23 '.length
              5,
            ],
          },
          true,
        ),
      ).toEqual([5, 8]);
    });

    it('"1 23| 456" => select " 456" => [4,8]', () => {
      expect(
        getWordSelection(
          {
            value: '1 23 456',
            selection: [
              4, // '1 23'.length
              4,
            ],
          },
          true,
        ),
      ).toEqual([4, 8]);
    });

    it('"1 |23 456" => select "23" => [2,4]', () => {
      expect(
        getWordSelection({ value: '1 23 456', selection: [2, 2] }, true),
      ).toEqual([2, 4]);
    });

    it('"1| 23 456" => select " 23" => [1,4]', () => {
      expect(
        getWordSelection({ value: '1 23 456', selection: [1, 1] }, true),
      ).toEqual([1, 4]);
    });

    it('"1 2|  3" (two spaces after 2) => select "  3" => [3,6]', () => {
      expect(
        getWordSelection(
          {
            value: '1 2  3',
            selection: [3, 3],
          },
          true,
        ),
      ).toEqual([3, 6]);
    });
  });
});
