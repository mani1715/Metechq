import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

let root, container, callback, observer, preference, animation, originalAnimate, originalObserver, originalMatchMedia;
beforeEach(() => {
 global.IS_REACT_ACT_ENVIRONMENT = true;
 originalAnimate = Element.prototype.animate;
 originalObserver = window.IntersectionObserver;
 originalMatchMedia = window.matchMedia;
 animation = {cancel: jest.fn()};
 Element.prototype.animate = jest.fn(() => animation);
 observer = {observe:jest.fn(), unobserve:jest.fn(), disconnect:jest.fn()};
 window.IntersectionObserver = jest.fn(fn => { callback = fn; return observer; });
 preference = {matches:false, addEventListener:jest.fn(), removeEventListener:jest.fn()};
 window.matchMedia = jest.fn(() => preference);
 container = document.createElement('div'); document.body.appendChild(container);
 container.innerHTML = '<main id="main-content"><div class="studio-work-card"><button>Open project</button></div></main><div id="reveal-root"></div>';
 container.querySelector('.studio-work-card').getBoundingClientRect = () => ({top:1500});
 root = createRoot(container.querySelector('#reveal-root'));
});
afterEach(() => {
 act(() => root.unmount()); container.remove();
 Element.prototype.animate = originalAnimate;
 window.IntersectionObserver = originalObserver;
 window.matchMedia = originalMatchMedia;
});
function render(path='/') {
 act(() => root.render(<MemoryRouter initialEntries={[path]} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><ScrollReveal /></MemoryRouter>));
}
test('below-fold cards rise once on entry and release animation styles on completion', () => {
 render(); const card = container.querySelector('.studio-work-card');
 expect(observer.observe).toHaveBeenCalledWith(card);
 callback([{target:card,isIntersecting:true}]);
 expect(observer.unobserve).toHaveBeenCalledWith(card);
 expect(card.animate.mock.calls[0][0][0].transform).toContain('rotateX(4deg)');
 animation.onfinish(); expect(animation.cancel).toHaveBeenCalled();
});
test('reduced motion leaves content visible and never starts an animation', () => {
 preference.matches = true; render();
 expect(observer.observe).not.toHaveBeenCalled();
 expect(Element.prototype.animate).not.toHaveBeenCalled();
 expect(container.querySelector('.studio-work-card').style.opacity).toBe('');
});
test('keyboard focus immediately cancels an active reveal', () => {
 render(); callback([{target:container.querySelector('.studio-work-card'),isIntersecting:true}]);
 container.querySelector('button').focus(); expect(animation.cancel).toHaveBeenCalled();
});
test('admin workspace does not install motion observers', () => {
 render('/admin/contacts'); expect(window.IntersectionObserver).not.toHaveBeenCalled();
});
