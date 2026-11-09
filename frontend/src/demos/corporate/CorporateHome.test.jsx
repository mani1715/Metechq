import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import CorporateHome from './CorporateHome';

// Render the real bundled data: string results previously crashed this route.
test('corporate concept renders its case studies and studio attribution', () => {
 global.IS_REACT_ACT_ENVIRONMENT = true;
 const container = document.createElement('div');
 const root = createRoot(container);
 try {
  act(() => root.render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><CorporateHome /></MemoryRouter>));
  expect(container.textContent).toContain('60% faster processing, 40% cost reduction');
  expect(container.querySelector('h1').textContent).toContain('Digital Backbone');
 } finally { act(() => root.unmount()); }
});
