import { isObject, isEmptyObject, getObjectClassName } from './validate-object';

describe('Validate Object Utils', () => {
  it('isObject return true with a valid object', () => {
    expect(isObject({})).toEqual(true);
  });

  it('isObject return false with a invalid object', () => {
    expect(isObject('')).toEqual(false);
  });

  it('isEmptyObject return true with a empty object', () => {
    expect(isEmptyObject({})).toEqual(true);
  });

  it('isObject return false with a object filled', () => {
    expect(isEmptyObject({ a: '1', b: '2' })).toEqual(false);
  });

  it('getObjectClassName return the class name', () => {
    class Test {}

    const instance = new Test();
    expect(getObjectClassName(instance)).toEqual('Test');
  });

  it('getObjectClassName return the class default Name', () => {
    expect(getObjectClassName([], 'Test')).toEqual('Test');
  });
});
