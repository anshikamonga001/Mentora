import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Layout ── */
const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 68px;
`;

/* ── Hero ── */
const Hero = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  padding: 5rem 1.5rem 6rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.25), transparent);
    pointer-events: none;
  }
`;

const HeroEyebrow = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(99,102,241,0.15);
  border: 1px solid rgba(99,102,241,0.3);
  color: #818cf8;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  margin-bottom: 1.25rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 800;
  color: white;
  letter-spacing: -0.04em;
  margin-bottom: 1rem;
  line-height: 1.1;
`;

const HeroSub = styled(motion.p)`
  font-size: 1.0625rem;
  color: #94a3b8;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.65;
`;

/* ── Content ── */
const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 1.5rem 5rem;
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* ── Info cards ── */
const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  margin-bottom: 0.25rem;
`;

const InfoSub = styled.p`
  font-size: 0.9375rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const InfoCard = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: box-shadow 200ms;

  &:hover {
    box-shadow: 0 8px 24px rgba(99,102,241,0.1);
    border-color: rgba(99,102,241,0.25);
  }
`;

const InfoIcon = styled.div<{ $bg: string }>`
  width: 44px;
  height: 44px;
  border-radius: 0.75rem;
  background: ${p => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px ${p => p.$bg}60;
`;

const InfoBody = styled.div``;
const InfoLabel = styled.div`font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.25rem;`;
const InfoValue = styled.div`font-size: 0.9375rem; font-weight: 600; color: #0f172a;`;
const InfoDesc  = styled.div`font-size: 0.8125rem; color: #64748b; margin-top: 0.125rem;`;

/* ── Form ── */
const FormCard = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  padding: 2.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.375rem;
`;

const FormSub = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.55;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-family: inherit;
  color: #0f172a;
  background: #f8fafc;
  transition: all 200ms;
  outline: none;

  &:focus {
    border-color: #6366f1;
    background: white;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  &::placeholder { color: #94a3b8; }
`;

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-family: inherit;
  color: #0f172a;
  background: #f8fafc;
  transition: all 200ms;
  outline: none;
  resize: vertical;
  min-height: 140px;

  &:focus {
    border-color: #6366f1;
    background: white;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  &::placeholder { color: #94a3b8; }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-family: inherit;
  color: #0f172a;
  background: #f8fafc;
  transition: all 200ms;
  outline: none;
  cursor: pointer;
  appearance: none;

  &:focus {
    border-color: #6366f1;
    background: white;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
`;

const SubmitBtn = styled(motion.button)`
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 16px rgba(99,102,241,0.35);
  margin-top: 0.5rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SuccessBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  padding: 3rem 2rem;
`;

const SuccessIcon = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(16,185,129,0.35);
`;

const SuccessTitle = styled.h3`
  font-size: 1.375rem;
  font-weight: 800;
  color: #0f172a;
`;

const SuccessText = styled.p`
  font-size: 0.9375rem;
  color: #64748b;
  line-height: 1.6;
  max-width: 320px;
`;

/* ── FAQ strip ── */
const FAQSection = styled.div`
  background: #0f172a;
  padding: 4rem 1.5rem;
`;

const FAQInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const FAQTitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: white;
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: -0.03em;
`;

const FAQSub = styled.p`
  text-align: center;
  color: #64748b;
  margin-bottom: 2.5rem;
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const FAQCard = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 1rem;
  padding: 1.5rem;
`;

const FAQQuestion = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.5rem;
`;

const FAQAnswer = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
`;

/* ── Page component ── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0  },
};

const ContactUs: React.FC = () => {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', category: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    // Simulate API call — wire to a real backend endpoint later
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
    toast.success('Message sent! We\'ll get back to you soon.');
  };

  const faqs = [
    { q: 'How quickly do you respond?', a: 'We aim to respond to all enquiries within 24 hours on business days.' },
    { q: 'Is Mentora free to use?', a: 'Yes! Core features are completely free. Premium features are available on paid plans.' },
    { q: 'Can I become a tutor?', a: 'Absolutely. Register with the "Tutor" role and complete your profile to start helping students.' },
    { q: 'Is my data safe?', a: 'We take privacy seriously. Your data is encrypted and never shared with third parties.' },
  ];

  return (
    <Page>
      {/* Hero */}
      <Hero>
        <HeroEyebrow
          initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
        >
          <MessageSquare size={13} /> Get in touch
        </HeroEyebrow>
        <HeroTitle initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
          We'd love to hear<br />from you
        </HeroTitle>
        <HeroSub initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
          Have a question, suggestion, or just want to say hello? Our team is here to help you get the most out of Mentora.
        </HeroSub>
      </Hero>

      {/* Main grid */}
      <Content>
        {/* Left — contact info */}
        <InfoCol>
          <div>
            <InfoTitle>Contact Information</InfoTitle>
            <InfoSub>Reach us through any of the channels below. We read every message and will get back to you as soon as possible.</InfoSub>
          </div>

          <InfoCard initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4 }}>
            <InfoIcon $bg="linear-gradient(135deg,#6366f1,#8b5cf6)"><Mail size={20} /></InfoIcon>
            <InfoBody>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>support@mentora.com</InfoValue>
              <InfoDesc>For general enquiries and support</InfoDesc>
            </InfoBody>
          </InfoCard>

          <InfoCard initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
            <InfoIcon $bg="linear-gradient(135deg,#10b981,#059669)"><Phone size={20} /></InfoIcon>
            <InfoBody>
              <InfoLabel>Phone</InfoLabel>
              <InfoValue>+1 (555) 123-4567</InfoValue>
              <InfoDesc>Mon – Fri, 9 AM – 6 PM EST</InfoDesc>
            </InfoBody>
          </InfoCard>

          <InfoCard initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
            <InfoIcon $bg="linear-gradient(135deg,#f97316,#f59e0b)"><MapPin size={20} /></InfoIcon>
            <InfoBody>
              <InfoLabel>Office</InfoLabel>
              <InfoValue>123 Education St, Learning City</InfoValue>
              <InfoDesc>LC 12345, United States</InfoDesc>
            </InfoBody>
          </InfoCard>

          <InfoCard initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
            <InfoIcon $bg="linear-gradient(135deg,#8b5cf6,#a855f7)"><Clock size={20} /></InfoIcon>
            <InfoBody>
              <InfoLabel>Response Time</InfoLabel>
              <InfoValue>Within 24 hours</InfoValue>
              <InfoDesc>We read every single message</InfoDesc>
            </InfoBody>
          </InfoCard>
        </InfoCol>

        {/* Right — form */}
        <FormCard initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
          {sent ? (
            <SuccessBox
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <SuccessIcon><CheckCircle size={36} /></SuccessIcon>
              <SuccessTitle>Message Sent! 🎉</SuccessTitle>
              <SuccessText>Thanks for reaching out. Our team will get back to you within 24 hours.</SuccessText>
              <SubmitBtn
                as={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', category:'', message:'' }); }}
                style={{ marginTop: '0.5rem', maxWidth: '200px' }}
              >
                Send another
              </SubmitBtn>
            </SuccessBox>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormTitle>Send us a message</FormTitle>
              <FormSub>Fill in the form and we'll get back to you as soon as possible.</FormSub>

              <Row>
                <Field>
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" placeholder="Your full name" value={form.name} onChange={handle} required />
                </Field>
                <Field>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
                </Field>
              </Row>

              <Field>
                <Label htmlFor="category">Category</Label>
                <Select id="category" name="category" value={form.category} onChange={handle}>
                  <option value="">Select a category</option>
                  <option value="general">General Enquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </Select>
              </Field>

              <Field>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="Brief subject line" value={form.subject} onChange={handle} />
              </Field>

              <Field>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" name="message" placeholder="Tell us how we can help…" value={form.message} onChange={handle} required />
              </Field>

              <SubmitBtn
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
              >
                {loading ? 'Sending…' : <><Send size={16} /> Send Message</>}
              </SubmitBtn>
            </form>
          )}
        </FormCard>
      </Content>

      {/* FAQ strip */}
      <FAQSection>
        <FAQInner>
          <FAQTitle>Frequently Asked Questions</FAQTitle>
          <FAQSub>Quick answers to common questions</FAQSub>
          <FAQGrid>
            {faqs.map(f => (
              <FAQCard key={f.q}>
                <FAQQuestion>{f.q}</FAQQuestion>
                <FAQAnswer>{f.a}</FAQAnswer>
              </FAQCard>
            ))}
          </FAQGrid>
        </FAQInner>
      </FAQSection>
    </Page>
  );
};

export default ContactUs;
