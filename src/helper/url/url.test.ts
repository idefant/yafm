import { isValidUrl } from './url';

test('check is valid url', () => {
  expect(isValidUrl('https://example.com')).toBe(true);
  expect(isValidUrl('http://example.com')).toBe(true);
  expect(isValidUrl('http://example')).toBe(true);
  expect(isValidUrl('ftp://example.com')).toBe(false);
  expect(isValidUrl('tcp://example.com')).toBe(false);
  expect(isValidUrl('file://example.com')).toBe(false);
  expect(isValidUrl('https://foo.example.com')).toBe(true);
  expect(isValidUrl('http://localhost')).toBe(true);
  expect(isValidUrl('http://localhost:123')).toBe(true);
  expect(isValidUrl('http://196.92.0.1')).toBe(true);
  expect(isValidUrl('example.com')).toBe(false);
  expect(isValidUrl('https://example.com/')).toBe(true);
  expect(isValidUrl('https://example.com/test')).toBe(true);
  expect(isValidUrl('https://example.com?hello=world')).toBe(true);
  expect(isValidUrl('https://example.com#anchor')).toBe(true);
});
