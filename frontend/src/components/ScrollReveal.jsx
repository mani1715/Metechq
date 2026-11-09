import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Deliberately target presentation elements, never forms or authenticated workspaces.
const TARGETS = [
  '.studio-section-heading', '.studio-offering', '.studio-work-card',
  '.process-step', '.studio-testimonials blockquote',
  '.portfolio-grid-item', '.section-header-premium', '.value-card-premium',
  '.detailed-service-card', '.why-choose-card', '.story-visual', '.story-content',
  '.project-gallery-section', '.blog-card', '[data-scroll-reveal]'
].join(',');

export default function ScrollReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (/^\/(admin|client|demo)(\/|$)/.test(pathname)) return;
    if (!window.IntersectionObserver || !Element.prototype.animate || !window.matchMedia) return;
    const main = document.getElementById('main-content');
    if (!main) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let seen = new WeakSet();
    const animations = new Map();
    const cancelAnimations = () => {
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const observer = new IntersectionObserver(entries => {
      let stagger = 0;
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        if (preference.matches || target.contains(document.activeElement)) return;
        const compact = window.innerWidth < 768;
        const animation = target.animate([
          { opacity: 0, transform: `perspective(1000px) translate3d(0, ${compact ? 20 : 34}px, 0) rotateX(${compact ? 2 : 4}deg) scale(.985)`, transformOrigin: '50% 100%' },
          { opacity: 1, transform: 'perspective(1000px) translate3d(0, 0, 0) rotateX(0deg) scale(1)', transformOrigin: '50% 100%' }
        ], { duration: compact ? 500 : 680, delay: Math.min(stagger++ * 55, 165), easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
        animations.set(target, animation);
        animation.onfinish = () => { animation.cancel(); animations.delete(target); };
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

    const discover = () => {
      if (preference.matches) return;
      main.querySelectorAll(TARGETS).forEach(element => {
        if (seen.has(element)) return;
        seen.add(element);
        // Do not stack transforms on nested cards or replay above-the-fold content.
        if (element.parentElement?.closest(TARGETS)) return;
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        observer.observe(element);
      });
    };
    const mutations = new MutationObserver(discover);
    mutations.observe(main, { childList: true, subtree: true });
    const onPreferenceChange = () => {
      if (preference.matches) { observer.disconnect(); cancelAnimations(); }
      else { seen = new WeakSet(); discover(); }
    };
    const onFocus = event => {
      animations.forEach((animation, element) => {
        if (element.contains(event.target)) { animation.cancel(); animations.delete(element); }
      });
    };
    preference.addEventListener('change', onPreferenceChange);
    main.addEventListener('focusin', onFocus);
    discover();
    return () => {
      observer.disconnect(); mutations.disconnect(); cancelAnimations();
      preference.removeEventListener('change', onPreferenceChange);
      main.removeEventListener('focusin', onFocus);
    };
  }, [pathname]);
  return null;
}
