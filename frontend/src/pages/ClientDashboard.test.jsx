import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import ClientDashboard from './ClientDashboard';
import api from '../services/api';
jest.mock('../services/api',()=>({get:jest.fn(),post:jest.fn()}));
jest.mock('../services/clientService',()=>({getClientChatMessages:jest.fn().mockResolvedValue([])}));
jest.mock('sonner',()=>({toast:{success:jest.fn(),error:jest.fn()}}));
let container,root;
const projects=[{id:'one',name:'First project',status:'in_progress',progress:20},{id:'two',name:'Second project',status:'review',progress:80}];
beforeEach(()=>{
  global.IS_REACT_ACT_ENVIRONMENT=true;
  localStorage.setItem('client_token','test-session');localStorage.setItem('client_data',JSON.stringify({name:'Evaluation client',email:'qa@example.com'}));
  container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);
  api.get.mockResolvedValue({data:projects});
});
afterEach(()=>{act(()=>root.unmount());container.remove();localStorage.clear();jest.clearAllMocks();});
const render=async()=>{await act(async()=>{root.render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><ClientDashboard/></MemoryRouter>);});};
test('refresh preserves the client-selected project',async()=>{
  await render();
  const choices=container.querySelectorAll('[role="button"]');
  await act(async()=>choices[1].dispatchEvent(new MouseEvent('click',{bubbles:true})));
  expect(container.querySelectorAll('[role="button"]')[1].getAttribute('aria-pressed')).toBe('true');
  await act(async()=>container.querySelector('[data-testid="refresh-projects-btn"]').click());
  expect(container.querySelectorAll('[role="button"]')[1].getAttribute('aria-pressed')).toBe('true');
  expect(container.querySelectorAll('[role="tab"]')).toHaveLength(8);
});
test('a failed fetch shows a retry and never claims there are no assigned projects',async()=>{
  api.get.mockRejectedValue(new Error('Offline'));
  await render();
  expect(container.querySelector('[role="alert"]').textContent).toContain('couldn’t refresh');
  expect(container.textContent).not.toContain('No projects assigned yet');
  expect(container.querySelector('[role="alert"] button').textContent).toBe('Try again');
});
