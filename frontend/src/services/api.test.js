import api from './api';
const attach = api.interceptors.request.handlers[0].fulfilled;
afterEach(()=>localStorage.clear());
test('client requests never borrow an admin session',()=>{
  localStorage.setItem('admin_token','admin-test-token');
  const config=attach({url:'/client/projects',headers:{}});
  expect(config.headers.Authorization).toBeUndefined();
});
test('client requests use the client session when both are present',()=>{
  localStorage.setItem('admin_token','admin-test-token');localStorage.setItem('client_token','client-test-token');
  expect(attach({url:'/client/projects',headers:{}}).headers.Authorization).toBe('Bearer client-test-token');
});
test('admin requests do not borrow a client session',()=>{
  localStorage.setItem('client_token','client-test-token');
  expect(attach({url:'/admin/clients/',headers:{}}).headers.Authorization).toBeUndefined();
});
