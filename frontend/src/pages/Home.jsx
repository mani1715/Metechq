import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ArrowDown, Code2, Layers, ShoppingBag, PenTool } from 'lucide-react';
import api from '../services/api';
import SEO from '../components/SEO';
import ProjectImage from '../components/portfolio/ProjectImage';
import projectService from '../services/projectService';
import { getPublicTestimonials } from '../services/testimonialService';
import { trackPageView } from '../services/analytics';
const offerings = [
  [PenTool, 'Design with intention.', 'UI / UX DESIGN', 'Thoughtful interfaces that make every interaction feel natural.'],
  [Code2, 'Built to make an impact.', 'WEB DEVELOPMENT', 'Distinctive, responsive websites that turn your vision into a digital experience.'],
  [ShoppingBag, 'A better way to shop.', 'E-COMMERCE', 'Seamless storefronts, from the first discovery to the final checkout.'],
  [Layers, 'Ideas without limits.', 'FULL-STACK DEVELOPMENT', 'Connected applications with a strong foundation and room to grow.']
];
export default function Home() {
  const [content,setContent] = useState(null);
  const [projects,setProjects] = useState(() => {
    try {
      const cached = projectService.getCachedProjects();
      if (Array.isArray(cached) && cached.length > 0) {
        return cached.slice(0, 3);
      }
    } catch (e) {}
    return [];
  });
  const [projectState,setProjectState] = useState(() => {
    try {
      const cached = projectService.getCachedProjects();
      if (Array.isArray(cached) && cached.length > 0) return 'ready';
    } catch (e) {}
    return 'loading';
  });
  const [attempt,setAttempt] = useState(0);
  const [quotes,setQuotes] = useState([]);
  useEffect(() => {
    let active = true;
    trackPageView('home');
    api.get('/content/').then(r => { if(active) setContent(r.data); }).catch(() => {});
    projectService.getPublicProjects().then(data => {
      if(active && Array.isArray(data) && data.length > 0) {
        setProjects(data.slice(0, 3));
        setProjectState('ready');
      }
    }).catch(() => {
      if(active && projects.length === 0) setProjectState('error');
    });
    getPublicTestimonials().then(data => { if(active) setQuotes(data.slice(0,3)); }).catch(() => {});
    return () => { active = false; };
  }, [attempt]);
  return <div className="studio-home"><SEO title="METECHQ | Design & Development Studio" description="Thoughtful websites and digital experiences." canonical="https://metechq.com/"/>
    <section className="studio-hero">
      <div className="hero-editorial">
        <p className="studio-eyebrow"><span/> INDEPENDENT DIGITAL STUDIO</p>
        <h1 data-admin-editable="hero-headline">{content?.hero_headline || <>Thoughtfully<br/>designed.<br/><em>Beautifully</em> built.</>}</h1>
        <p className="studio-hero-copy" data-admin-editable="hero-description">{content?.hero_description || 'We bring ambitious ideas to life through distinctive design and purposeful development. Your next chapter starts here.'}</p>
        <div className="studio-actions"><Link to="/contact" className="studio-button">{content?.hero_cta1_text || 'Start a project'}<ArrowUpRight size={18}/></Link><Link to="/portfolio" className="studio-text-link">{content?.hero_cta2_text || 'Explore our work'}<ArrowRight size={17}/></Link></div>
        <div className="hero-footnote"><span>DESIGN WITH PURPOSE. BUILD WITH CARE.</span><a href="#studio-work" aria-label="Scroll to selected work"><ArrowDown size={19}/></a></div>
      </div>
      <div className="studio-art" role="img" aria-label="Architectural composition of amber arches and champagne planes in warm sunlight">
        <div className="art-grid"/><span className="art-caption">FORM MEETS FUNCTION</span><div className="art-sun"/><div className="art-arch arch-back"/><div className="art-arch arch-front"/><div className="art-plinth"/><div className="art-orbit"/><span className="art-star">✳</span><div className="art-label"><span>A different<br/><em>perspective.</em></span><small>CRAFTED TO STAND APART — 01</small></div><span className="art-side">METECHQ / DIGITAL EXPERIENCES</span>
      </div>
    </section>
    <div className="studio-discipline"><span>Strategy meets creativity.</span><p>WEB DESIGN <i>✳</i> DEVELOPMENT <i>✳</i> E-COMMERCE <i>✳</i> DIGITAL EXPERIENCES</p></div>
    <section className="studio-section" id="studio-services">
      <div className="studio-section-heading"><div><p className="studio-eyebrow">01 / WHAT WE DO</p><h2>Good design.<br/><em>Even better experiences.</em></h2></div><div><p>From the first sketch to the final line of code, we connect the details that make your business feel like you.</p><Link to="/services" className="studio-text-link">Discover our services <ArrowUpRight size={18}/></Link></div></div>
      <div className="studio-offerings">{offerings.map(([Icon,title,label,description],i) => <Link to="/services" className="studio-offering" key={label}><div className="offering-top"><Icon size={25} strokeWidth={1.3}/><span>0{i+1}</span></div><p className="studio-eyebrow">{label}</p><h3>{title}</h3><p>{description}</p><ArrowUpRight className="offering-arrow" size={22}/></Link>)}</div>
    </section>
    <section className="studio-work-section" id="studio-work"><div className="studio-section"><div className="studio-section-heading"><div><p className="studio-eyebrow">02 / SELECTED EXPERIENCES</p><h2>Made with care.<br/><em>Made to be remembered.</em></h2></div><Link to="/portfolio" className="studio-text-link">View the portfolio <ArrowUpRight size={18}/></Link></div>
      {projectState === 'loading' && <div className="work-status" role="status">Loading our latest projects…</div>}
      {projectState === 'error' && <div className="work-status" role="alert"><h3>Our work is taking a moment to load.</h3><p>Please try again to view the portfolio.</p><button className="studio-button" onClick={() => setAttempt(n => n + 1)}>Try again</button></div>}
      {projectState === 'ready' && projects.length === 0 && <div className="work-status"><p>New work will be shared here soon.</p></div>}
      <div className="studio-work-grid">{projects.map(project => <Link key={project.id} to={`/portfolio/${project.slug || project.id}`} className="studio-work-card"><div className="work-visual"><ProjectImage src={project.image_url} alt={project.title} loading="lazy"/></div><div className="work-caption"><div><p>{project.category}{project.live_demo_url?.startsWith('/demo/') ? ' · Demo project' : ''}</p><h3>{project.title}</h3></div><span><ArrowUpRight size={23}/></span></div></Link>)}</div>
    </div></section>
    <section className="studio-section studio-process"><div><p className="studio-eyebrow">03 / THE WAY WE WORK</p><h2>A shared vision.<br/><em>A clear path forward.</em></h2><p>Great work starts with a conversation. We keep you involved at every step, bringing clarity to the process and care to the details.</p><Link to="/about" className="studio-text-link">Meet the studio <ArrowUpRight size={18}/></Link></div><div className="process-list">{[['Discover','We listen, ask the right questions, and find what makes your idea unique.'],['Design','We shape a visual direction and intuitive journeys around your audience.'],['Develop','We turn the design into a responsive, carefully engineered experience.'],['Launch & evolve','We test the details, prepare your launch, and help you take the next step.']].map(([title,desc],i) => <div key={title}><span>0{i+1}</span><section><h3>{title}</h3><p>{desc}</p></section><ArrowUpRight size={20}/></div>)}</div></section>
    {quotes.length > 0 && <section className="studio-section studio-testimonials"><p className="studio-eyebrow">IN THEIR WORDS</p><h2>Good work. <em>Real connections.</em></h2><div>{quotes.map(q => <blockquote key={q.id}><p>“{q.message}”</p><footer>{q.name}<small>{[q.role,q.company].filter(Boolean).join(' · ')}</small></footer></blockquote>)}</div><Link to="/submit-testimonial" className="studio-text-link">Share your experience <ArrowUpRight size={18}/></Link></section>}
    <section className="studio-invitation"><p className="studio-eyebrow">HAVE SOMETHING IN MIND?</p><h2>{content?.cta_heading || <>Let’s make<br/><em>something matter.</em></>}</h2><p>{content?.cta_description || 'A fresh idea. A new beginning. A better digital experience.'}</p><Link to="/contact" className="studio-button">{content?.cta_button_text || 'Tell us about your project'}<ArrowUpRight size={20}/></Link><span className="invitation-star" aria-hidden="true">✳</span></section>
  </div>;
}
