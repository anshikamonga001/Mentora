import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Twitter, Linkedin, Github, Instagram,
  Mail, MapPin, Heart, ArrowUp,
  BookOpen, Users, Briefcase, MessageCircle,
  Shield, FileText, HelpCircle, Phone,
  Zap, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usersAPI } from '../../services/api';

import { Link, useLocation } from 'react-router-dom';

/* ── Styled Components ──────────────────────────── */
const FooterRoot = styled.footer<{ $isDashboard?: boolean }>`
  background: #0f172a;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255,255,255,0.06);
  margin-left: ${props => props.$isDashboard ? '240px' : '0'};
  
  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
`;

const GlowOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

/* ── Top row: newsletter banner ─────────────────── */
const NewsletterBand = styled.div`
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 2.5rem 0;
`;

const NewsletterInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
`;

const NewsletterLeft = styled.div``;

const NewsletterTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.25rem;
`;

const NewsletterSub = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const NewsletterInput = styled.input`
  padding: 0.625rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.06);
  color: #f8fafc;
  font-size: 0.875rem;
  width: 220px;
  font-family: inherit;
  transition: all 200ms ease;

  &::placeholder { color: #475569; }
  &:focus {
    outline: none;
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
`;

const NewsletterBtn = styled(motion.button)`
  padding: 0.625rem 1.25rem;
  border-radius: 0.625rem;
  border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  font-family: inherit;

  &:hover {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    box-shadow: 0 6px 20px rgba(99,102,241,0.4);
  }
`;

/* ── Main grid ──────────────────────────────────── */
const FooterGrid = styled.div`
  padding: 3rem 0 2.5rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const BrandCol = styled.div``;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
`;

const LogoIcon = styled.div`
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
`;

const LogoWord = styled.span`
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #f8fafc;
`;

const BrandDesc = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  max-width: 260px;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 0.625rem;
`;

const SocialBtn = styled(motion.a)`
  width: 36px;
  height: 36px;
  border-radius: 0.625rem;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  text-decoration: none;
  transition: all 200ms ease;

  &:hover {
    background: rgba(99,102,241,0.15);
    border-color: rgba(99,102,241,0.3);
    color: #818cf8;
  }
`;

const Col = styled.div``;

const ColTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #475569;
  margin-bottom: 1rem;
`;

const ColLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const ColLink = styled.a`
  font-size: 0.875rem;
  color: #64748b;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 200ms ease;

  &:hover {
    color: #818cf8;
    transform: translateX(3px);
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.625rem;

  svg { flex-shrink: 0; margin-top: 2px; }
`;

/* ── Bottom bar ─────────────────────────────────── */
const BottomBar = styled.div`
  padding: 1.25rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Copyright = styled.div`
  font-size: 0.8125rem;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

const BottomLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const BottomLink = styled.a`
  font-size: 0.8125rem;
  color: #334155;
  text-decoration: none;
  transition: color 200ms ease;
  &:hover { color: #818cf8; }
`;

const BackTop = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: 0.625rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(99,102,241,0.15);
  color: #818cf8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;

  &:hover {
    background: rgba(99,102,241,0.25);
    border-color: rgba(99,102,241,0.4);
  }
`;

/* ── Component ──────────────────────────────────── */
const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    setIsSubscribing(true);
    const loadingToast = toast.loading('Subscribing...');

    try {
      await usersAPI.subscribeNewsletter(email);
      
      toast.dismiss(loadingToast);
      // Premium informative popup
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            background: '#fff',
            padding: '1.25rem 1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            gap: '1rem',
            maxWidth: '400px',
            border: '1px solid #f1f5f9',
            position: 'relative'
          }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(99,102,241,0.1)', color: '#6366f1',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Mail size={20} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem', color: '#0f172a', fontSize: '0.9375rem', fontWeight: 700 }}>
              Successfully Subscribed! 🎉
            </h4>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.8125rem', lineHeight: 1.5 }}>
              Welcome aboard! We've sent a confirmation to <b>{email}</b>. You'll now get our weekly tips and top mentors straight to your inbox.
            </p>
          </div>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </motion.div>
      ), { duration: 5000 });

      setEmail('');
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to subscribe. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const productLinks = [
    { href: '/ask-zone',  label: 'Ask Zone',       icon: MessageCircle },
    { href: '/mentors',   label: 'Find Mentors',   icon: Users },
    { href: '/freelance', label: 'Freelance Board', icon: Briefcase },
    { href: '/sessions',  label: 'Sessions',        icon: BookOpen },
    { href: '/dashboard', label: 'Dashboard',       icon: Zap },
  ];

  const companyLinks = [
    { href: '/about',    label: 'About Us' },
    { href: '/blog',     label: 'Blog' },
    { href: '/careers',  label: 'Careers' },
    { href: '/contact',  label: 'Contact' },
    { href: '/press',    label: 'Press Kit' },
  ];

  const legalLinks = [
    { href: '/help',    label: 'Help Center', icon: HelpCircle },
    { href: '/privacy', label: 'Privacy',     icon: Shield },
    { href: '/terms',   label: 'Terms',       icon: FileText },
    { href: '/contact', label: 'Support',     icon: Phone },
  ];

  const socials = [
    { href: '#', icon: Twitter,   label: 'Twitter' },
    { href: '#', icon: Linkedin,  label: 'LinkedIn' },
    { href: '#', icon: Github,    label: 'GitHub' },
    { href: '#', icon: Instagram, label: 'Instagram' },
  ];

  return (
    <FooterRoot $isDashboard={isDashboard}>
      <GridOverlay />
      <GlowOrb style={{ top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'rgba(99,102,241,0.05)' }} />
      <GlowOrb style={{ bottom: '-150px', right: '-150px', width: '400px', height: '400px', background: 'rgba(139,92,246,0.05)' }} />

      <Content>
        {/* Newsletter */}
        <NewsletterBand>
          <NewsletterInner>
            <NewsletterLeft>
              <NewsletterTitle>Stay in the loop 📬</NewsletterTitle>
              <NewsletterSub>New mentors, features, and learning resources, weekly.</NewsletterSub>
            </NewsletterLeft>
            <NewsletterForm onSubmit={handleSubscribe}>
              <NewsletterInput 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <NewsletterBtn type="submit" disabled={isSubscribing} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </NewsletterBtn>
            </NewsletterForm>
          </NewsletterInner>
        </NewsletterBand>

        {/* Main grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        >
          <FooterGrid>
            {/* Brand */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <BrandCol>
                <LogoRow>
                  <LogoIcon>M</LogoIcon>
                  <LogoWord>Mentora</LogoWord>
                </LogoRow>
                <BrandDesc>
                  The all-in-one platform for students to learn, get mentored,
                  solve doubts, and grow their freelance careers together.
                </BrandDesc>
                <SocialRow>
                  {socials.map(({ href, icon: Icon, label }) => (
                    <SocialBtn
                      key={label}
                      href={href}
                      aria-label={label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.93 }}
                    >
                      <Icon size={15} />
                    </SocialBtn>
                  ))}
                </SocialRow>
              </BrandCol>
            </motion.div>

            {/* Product */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <Col>
                <ColTitle>Product</ColTitle>
                <ColLinks>
                  {productLinks.map(({ href, label, icon: Icon }) => (
                    <ColLink key={href} href={href}>
                      <Icon size={13} />
                      {label}
                    </ColLink>
                  ))}
                </ColLinks>
              </Col>
            </motion.div>

            {/* Company */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <Col>
                <ColTitle>Company</ColTitle>
                <ColLinks>
                  {companyLinks.map(({ href, label }) => (
                    <ColLink key={href} href={href}>{label}</ColLink>
                  ))}
                </ColLinks>
              </Col>
            </motion.div>

            {/* Contact / Legal */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <Col>
                <ColTitle>Contact</ColTitle>
                <ContactItem>
                  <Mail size={14} />
                  <span>support@mentora.app</span>
                </ContactItem>
                <ContactItem>
                  <MapPin size={14} />
                  <span>Remote · Worldwide 🌍</span>
                </ContactItem>
                <div style={{ height: '1rem' }} />
                <ColTitle>Legal</ColTitle>
                <ColLinks>
                  {legalLinks.map(({ href, label, icon: Icon }) => (
                    <ColLink key={href} href={href}>
                      <Icon size={13} />
                      {label}
                    </ColLink>
                  ))}
                </ColLinks>
              </Col>
            </motion.div>
          </FooterGrid>
        </motion.div>

        {/* Bottom bar */}
        <BottomBar>
          <Copyright>
            © 2025 Mentora. Made with <Heart size={13} color="#f43f5e" fill="#f43f5e" /> for learners everywhere.
          </Copyright>
          <BottomLinks>
            <BottomLink href="/privacy">Privacy</BottomLink>
            <BottomLink href="/terms">Terms</BottomLink>
            <BottomLink href="/cookies">Cookies</BottomLink>
            <BackTop
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.93 }}
              title="Back to top"
            >
              <ArrowUp size={15} />
            </BackTop>
          </BottomLinks>
        </BottomBar>
      </Content>
    </FooterRoot>
  );
};

export default Footer;