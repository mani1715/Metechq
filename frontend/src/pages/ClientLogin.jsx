import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Eye, EyeOff, LockKeyhole, FolderOpen, MessagesSquare, ListChecks } from 'lucide-react';
import api from '../services/api';
import SEO from '../components/SEO';
export default function ClientLogin() {
  const navigate = useNavigate();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [visible,setVisible] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const submit = async event => {
    event.preventDefault(); if(busy) return; setBusy(true); setError('');
    try {
      const {data} = await api.post('/client/auth/login',{email:email.trim(),password});
      if(!data.access_token || !data.client) throw new Error('Invalid sign-in response');
      localStorage.setItem('client_token',data.access_token);
      localStorage.setItem('client_data',JSON.stringify(data.client));
      navigate('/client/dashboard',{replace:true});
    } catch(err) {
      setError(err.response?.status === 401 ? 'The email or password is incorrect. Please try again.' : err.response?.status === 429 ? 'Too many sign-in attempts. Please wait a moment and try again.' : 'We couldn’t connect to your workspace. Please try again shortly.');
    } finally { setBusy(false); }
  };
  return <section className="client-entry"><SEO title="Client Portal | METECHQ" description="Your METECHQ project workspace."/><aside className="client-entry-story"><p className="studio-eyebrow">YOUR CLIENT WORKSPACE</p><h1>Great things.<br/><em>Built together.</em></h1><p>A little more clarity. A lot more progress. Everything you need to stay connected to your project, in one place.</p><ul>{[[FolderOpen,'Your projects, at a glance'],[ListChecks,'Milestones and deliverables'],[MessagesSquare,'A direct line to your team']].map(([Icon,label]) => <li key={label}><Icon size={20} strokeWidth={1.3}/>{label}</li>)}</ul><span className="client-story-mark" aria-hidden="true">m.</span></aside>
    <div className="client-entry-form"><div className="client-signin" data-testid="client-login-card"><LockKeyhole size={28} strokeWidth={1.2}/><p className="studio-eyebrow">WELCOME BACK</p><h2>Your next chapter<br/>is taking shape.</h2><p>Sign in to your client workspace.</p><form onSubmit={submit} data-testid="client-login-form"><label htmlFor="client-email">Email address</label><input id="client-email" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" disabled={busy} data-testid="client-login-email"/><label htmlFor="client-password">Password</label><div className="client-password"><input id="client-password" type={visible?'text':'password'} autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} disabled={busy} data-testid="client-login-password"/><button type="button" onClick={()=>setVisible(!visible)} aria-label={visible?'Hide password':'Show password'} aria-pressed={visible}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>{error && <p className="client-form-error" role="alert">{error}</p>}<button type="submit" className="studio-button" disabled={busy} data-testid="client-login-submit-btn">{busy?'Signing in…':'Enter your workspace'}<ArrowRight size={18}/></button></form><div className="client-signin-help"><p>Need access or help signing in?</p><Link to="/contact" className="studio-text-link">Contact your project team <ArrowUpRight size={16}/></Link></div></div></div>
  </section>;
}
