import { safeProjectUrl } from './projectUrls';
test.each(['javascript:alert(1)', 'data:text/html,test', '//evil.example', 'https://user:password@example.com', 'https://example.com\\evil'])('rejects unsafe project URL %s', value => { expect(safeProjectUrl(value)).toBe(''); });
test.each(['https://example.com/work', '/demo/ecommerce'])('keeps supported project URL %s', value => { expect(safeProjectUrl(value)).toBe(value); });
