import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github,
  Heart,
  ArrowUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.gray[900]} 0%, 
    ${({ theme }) => theme.colors.gray[800]} 100%);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['2xl']} 0 ${({ theme }) => theme.spacing.lg};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const FooterSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary[400]};
`;

const SectionDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[300]};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.gray[300]};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: all ${({ theme }) => theme.transitions.default};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[400]};
    transform: translateX(4px);
  }
`;

const FooterRouterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.gray[300]};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: all ${({ theme }) => theme.transitions.default};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[400]};
    transform: translateX(4px);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.gray[700]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.gray[300]};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray[700]};
  padding-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.gray[400]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const BackToTop = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary[500]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-2px);
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NewsletterBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const NewsletterTitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[200]};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const NewsletterInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.875rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  background: ${({ theme }) => theme.colors.gray[700]};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  outline: none;
  &::placeholder { color: ${({ theme }) => theme.colors.gray[400]}; }
  &:focus { border-color: ${({ theme }) => theme.colors.primary[400]}; }
`;

const SubscribeBtn = styled(motion.button)`
  width: 100%;
  padding: 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.primary[500]},
    ${({ theme }) => theme.colors.secondary[500]});
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  font-family: inherit;
`;

const SuccessMsg = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: #6ee7b7;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.secondary[500]});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.white};
`;

const Footer: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail]       = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    try {
      const res  = await fetch('http://localhost:5000/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      console.error('Subscribe error:', err);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <FooterContainer>
      <FooterContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <FooterGrid>
            <FooterSection variants={itemVariants}>
              <Logo>
                <LogoIcon>M</LogoIcon>
                <LogoText>Mentora</LogoText>
              </Logo>
              <SectionDescription>
                Empowering students, tutors, and freelancers to connect, learn, and grow together. 
                Join our community and unlock your potential.
              </SectionDescription>
              <SocialLinks>
                <SocialLink
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Facebook size={20} />
                </SocialLink>
                <SocialLink
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Twitter size={20} />
                </SocialLink>
                <SocialLink
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram size={20} />
                </SocialLink>
                <SocialLink
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={20} />
                </SocialLink>
                <SocialLink
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={20} />
                </SocialLink>
              </SocialLinks>
            </FooterSection>

            <FooterSection variants={itemVariants}>
              <SectionTitle>Quick Links</SectionTitle>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              {user?.role === 'tutor' ? (
                <>
                  <FooterLink href="/answer-zone">Answer Zone</FooterLink>
                  <FooterLink href="/sessions">Host Sessions</FooterLink>
                </>
              ) : (
                <>
                  <FooterLink href="/ask-zone">Ask Zone</FooterLink>
                  <FooterLink href="/mentors">Find Mentors</FooterLink>
                </>
              )}
              <FooterLink href="/freelance">Freelance Projects</FooterLink>
              <FooterLink href="/leaderboard">Leaderboard</FooterLink>
            </FooterSection>

            <FooterSection variants={itemVariants}>
              <SectionTitle>Support</SectionTitle>
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterRouterLink to="/contact">Contact Us</FooterRouterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>

              <NewsletterBox>
                <NewsletterTitle>📬 Subscribe to Newsletter</NewsletterTitle>
                {subscribed ? (
                  <SuccessMsg>✅ You're subscribed! Thanks for joining.</SuccessMsg>
                ) : (
                  <>
                    <NewsletterInput
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    <SubscribeBtn
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSubscribe}
                    >
                      Subscribe
                    </SubscribeBtn>
                  </>
                )}
              </NewsletterBox>
            </FooterSection>

            <FooterSection variants={itemVariants}>
              <SectionTitle>Contact Info</SectionTitle>
              <ContactInfo>
                <Mail size={16} />
                <span>support@mentora.com</span>
              </ContactInfo>
              <ContactInfo>
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </ContactInfo>
              <ContactInfo>
                <MapPin size={16} />
                <span>123 Education St, Learning City, LC 12345</span>
              </ContactInfo>
            </FooterSection>
          </FooterGrid>
        </motion.div>

        <FooterBottom>
          <Copyright>
            © 2026 Mentora. Made with <Heart size={16} color="#ef4444" /> for learners everywhere.
          </Copyright>
          <BackToTop
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp size={20} />
          </BackToTop>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;