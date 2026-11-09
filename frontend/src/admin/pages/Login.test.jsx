import React from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import { useAdmin } from '../context/AdminContext';
jest.mock('../context/AdminContext', () => ({ useAdmin: jest.fn() }));
let root, container, login;
beforeEach(() => {
 global.IS_REACT_ACT_ENVIRONMENT = true;
 login = jest.fn(); useAdmin.mockReturnValue({ login });
 container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); jest.clearAllMocks(); });
async function submit() {
 await act(async () => root.render(<MemoryRouter initialEntries={['/admin/login']} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><Routes><Route path="/admin/login" element={<Login/>}/><Route path="/admin" element={<p>Admin workspace</p>}/></Routes></MemoryRouter>));
 act(() => {
  Simulate.change(container.querySelector('input[type=text]'), {target:{value:'reviewer'}});
  Simulate.change(container.querySelector('input[type=password]'), {target:{value:'test-password'}});
 });
 await act(async () => Simulate.submit(container.querySelector('form')));
}
test('admin sign-in uses the shared admin session and enters the workspace', async () => {
 login.mockResolvedValue({success:true}); await submit();
 expect(login).toHaveBeenCalledWith('reviewer','test-password');
 expect(container.textContent).toContain('Admin workspace');
});
test('failed admin sign-in remains on the form with the server error', async () => {
 login.mockResolvedValue({success:false,error:'Invalid username or password'}); await submit();
 expect(container.textContent).toContain('Invalid username or password');
 expect(container.querySelector('button[type=submit]').disabled).toBe(false);
 expect(container.textContent).not.toContain('Admin workspace');
});
