import DOMPurify from 'dompurify';
test('stored HTML cannot execute scripts, handlers or javascript links',()=>{
  const safe = DOMPurify.sanitize('<p>Readable content</p><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">link</a>',{USE_PROFILES:{html:true}});
  expect(safe).toContain('<p>Readable content</p>');
  expect(safe).not.toMatch(/<script|onerror|javascript:/i);
});
