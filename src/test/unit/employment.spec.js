import {Employment} from '../../src/employment';
import using from 'jasmine-data-provider';

describe('the Employment module', () => {
  var sut;

  beforeEach(() => {
    sut = new Employment();
  });

  it('initiates the current property to zero', () => {
    expect(sut.current).toEqual(0);
  });

  it('initiates all views', () => {
    expect(sut.views).toContain('./employment1.html');
    expect(sut.views).toContain('./employment2.html');
    expect(sut.views).toContain('./employment3.html');
  });

  // length minus 1 because index start at 0
  it('initiates the max property to length minus 1', () => {
    expect(sut.max).toEqual(2);
  });

  using([
    { step: 1, current: 2, expect: 3 },
    { step: -1, current: 2, expect: 1 },
  ], data => {
    it('increments/decrements the current step', () => {
      sut.current = data.current;

      sut.next(data.step);

      expect(sut.current).toEqual(data.expect);
    })
  });
});
