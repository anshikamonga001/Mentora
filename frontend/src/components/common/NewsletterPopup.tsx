import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const PopupContainer = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 440px;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
`;

const HeaderArea = styled.div`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  padding: 2.5rem 2rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.5;
  }
`;

const IconCircle = styled.div`
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  color: #6366f1;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.5rem;
  letter-spacing: -0.03em;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.5;
`;

const BodyArea = styled.div`
  padding: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.875rem;
  font-size: 1rem;
  font-family: inherit;
  color: #0f172a;
  transition: all 0.2s;
  outline: none;
  &::placeholder { color: #94a3b8; }
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const SubscribeBtn = styled(motion.button)`
  width: 100%;
  padding: 0.875rem;
  border-radius: 0.875rem;
  border: none;
  background: #0f172a;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3);
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Notice = styled.p`
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 1rem 0 0;
`;

const SuccessState = styled(motion.div)`
  text-align: center;
  padding: 1rem 0;
`;

const NewsletterPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user has already seen or subscribed to the popup
    const hasSeenPopup = localStorage.getItem('mentora_newsletter_popup');
    
    if (!hasSeenPopup) {
      // Wait 5 seconds before showing the popup to new visitors
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    // Remember that the user closed it so we don't annoy them again
    localStorage.setItem('mentora_newsletter_popup', 'dismissed');
  };

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
        localStorage.setItem('mentora_newsletter_popup', 'subscribed');
        
        // Auto-close after 3 seconds of success
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Popup subscribe error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PopupContainer
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <CloseBtn onClick={closePopup}>
              <X size={18} />
            </CloseBtn>
            
            <HeaderArea>
              <IconCircle>
                <Mail size={32} strokeWidth={2.5} />
              </IconCircle>
              <Title>Stay in the loop!</Title>
              <Subtitle>Get the latest updates on top tutors, freelance projects, and community news.</Subtitle>
            </HeaderArea>
            
            <BodyArea>
              {success ? (
                <SuccessState
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                  <h4 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 0.5rem' }}>You're all set!</h4>
                  <p style={{ color: '#64748b', margin: 0 }}>Thanks for subscribing. Keep an eye on your inbox.</p>
                </SuccessState>
              ) : (
                <>
                  <InputGroup>
                    <Input 
                      type="email" 
                      placeholder="Enter your best email address..." 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                    />
                  </InputGroup>
                  <SubscribeBtn 
                    onClick={handleSubscribe}
                    disabled={loading || !email.includes('@')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Subscribing...' : 'Yes, subscribe me!'}
                  </SubscribeBtn>
                  <Notice>We respect your privacy. Unsubscribe at any time.</Notice>
                </>
              )}
            </BodyArea>
          </PopupContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
