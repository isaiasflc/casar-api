import { parseJSON } from './json';

describe('JSON Utils', () => {
  it('should parse a string to json', () => {
    const objectJson = parseJSON(
      `{
        "user": "johndoe@myemailservice.com",
        "password": "12345678",
      }`,
    );
    expect(typeof objectJson).toEqual('object');
  });

  it('should return null invalid json string', () => {
    const objectJson = parseJSON(`any string value`);
    expect(objectJson).toBeNull();
  });
});
