import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, MessageCircle, Users, Briefcase,
  Star, Zap, Award,
  ChevronUp, Play,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/* ── Animations ── */
const gradShift = keyframes`
  0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}
`;
const orb = keyframes`
  0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-30px) scale(1.1)}66%{transform:translate(-20px,20px) scale(0.95)}
`;

/* ── Wrappers ── */
const Page = styled.div`min-height:100vh;overflow:hidden;`;

const Hero = styled.section`
  min-height:100vh;
  background:#0f172a;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  padding:8rem 1.5rem 5rem;
`;

const Orb = styled.div<{$c:string;$s:number;$t:string;$l:string;$d:string}>`
  position:absolute;
  width:${p=>p.$s}px;height:${p=>p.$s}px;
  border-radius:50%;
  background:${p=>p.$c};
  filter:blur(80px);
  opacity:0.25;
  top:${p=>p.$t};left:${p=>p.$l};
  animation:${orb} ${p=>p.$d} ease-in-out infinite;
  pointer-events:none;
`;

const GridBg = styled.div`
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px);
  background-size:50px 50px;pointer-events:none;
`;

const HeroInner = styled.div`
  max-width:900px;margin:0 auto;text-align:center;position:relative;z-index:1;
`;

const Pill = styled(motion.div)`
  display:inline-flex;align-items:center;gap:.5rem;
  padding:.375rem 1rem;border-radius:9999px;
  background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.25);
  color:#818cf8;font-size:.8125rem;font-weight:600;margin-bottom:2rem;
`;

const HeroH1 = styled(motion.h1)`
  font-size:clamp(2.5rem,6vw,4.5rem);
  font-weight:900;line-height:1.08;letter-spacing:-.04em;
  color:#f8fafc;margin-bottom:1.5rem;
  span{
    background:linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8);
    background-size:200% auto;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    animation:${gradShift} 4s linear infinite;
  }
`;

const HeroSub = styled(motion.p)`
  font-size:1.125rem;color:#94a3b8;max-width:580px;
  margin:0 auto 2.5rem;line-height:1.7;
`;

const CTARow = styled(motion.div)`
  display:flex;gap:.875rem;justify-content:center;flex-wrap:wrap;margin-bottom:3.5rem;
`;

const PrimaryBtn = styled(motion(Link))`
  display:inline-flex;align-items:center;gap:.5rem;
  padding:.875rem 1.875rem;border-radius:.875rem;
  background:linear-gradient(135deg,#6366f1,#8b5cf6);
  color:#fff;font-weight:700;font-size:1rem;text-decoration:none;
  box-shadow:0 8px 30px rgba(99,102,241,.4);letter-spacing:-.01em;
  transition:all .2s;
  &:hover{color:#fff;background:linear-gradient(135deg,#4f46e5,#7c3aed);box-shadow:0 12px 40px rgba(99,102,241,.5);transform:translateY(-2px);}
`;

const GhostBtn = styled(motion(Link))`
  display:inline-flex;align-items:center;gap:.5rem;
  padding:.875rem 1.875rem;border-radius:.875rem;
  background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
  color:#e2e8f0;font-weight:600;font-size:1rem;text-decoration:none;
  transition:all .2s;
  &:hover{color:#fff;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);}
`;

const TrustRow = styled(motion.div)`
  display:flex;align-items:center;justify-content:center;gap:2rem;flex-wrap:wrap;
`;

const TrustStat = styled.div`text-align:center;`;
const TrustNum = styled.div`font-size:1.5rem;font-weight:800;color:#f8fafc;letter-spacing:-.03em;`;
const TrustLabel = styled.div`font-size:.75rem;color:#64748b;font-weight:500;margin-top:.125rem;`;
const TrustDivider = styled.div`width:1px;height:36px;background:rgba(255,255,255,.08);`;

/* ── Features ── */
const Section = styled.section<{$bg?:string}>`
  padding:6rem 1.5rem;background:${p=>p.$bg||'#ffffff'};
`;

const MaxW = styled.div`max-width:1200px;margin:0 auto;`;

const SectionEyebrow = styled(motion.div)`
  text-align:center;
  span{
    display:inline-block;padding:.25rem .875rem;border-radius:9999px;
    background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.15);
    color:#6366f1;font-size:.75rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  }
`;

const SectionH2 = styled(motion.h2)`
  text-align:center;font-size:clamp(1.875rem,4vw,2.75rem);font-weight:800;
  letter-spacing:-.04em;color:#0f172a;margin:.75rem 0 .875rem;
`;

const SectionSub = styled(motion.p)`
  text-align:center;font-size:1.0625rem;color:#64748b;
  max-width:540px;margin:0 auto 3.5rem;line-height:1.65;
`;

const FeatGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;
`;

const FeatCard = styled(motion.div)<{$accent:string}>`
  height:100%;
  background:#fff;border:1px solid #e2e8f0;border-radius:1.25rem;padding:2rem;
  transition:all .25s cubic-bezier(.4,0,.2,1);
  &:hover{
    transform:translateY(-6px);
    box-shadow:0 20px 50px rgba(99,102,241,.12),0 4px 12px rgba(0,0,0,.05);
    border-color:${p=>p.$accent}40;
  }
`;

const FeatIcon = styled.div<{$bg:string}>`
  width:52px;height:52px;border-radius:.875rem;
  background:${p=>p.$bg};
  display:flex;align-items:center;justify-content:center;color:#fff;
  margin-bottom:1.25rem;box-shadow:0 6px 16px ${p=>p.$bg}60;
`;

const FeatTitle = styled.h3`font-size:1.0625rem;font-weight:700;color:#0f172a;margin-bottom:.5rem;`;
const FeatDesc = styled.p`font-size:.875rem;color:#64748b;line-height:1.6;margin:0;`;

/* ── How it works ── */
const Steps = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:2rem;
`;

const StepCard = styled(motion.div)`
  text-align:center;padding:2rem 1.5rem;
  background:#f8fafc;border-radius:1.25rem;border:1px solid #e2e8f0;
`;

const StepNum = styled.div`
  width:48px;height:48px;border-radius:50%;
  background:linear-gradient(135deg,#6366f1,#8b5cf6);
  color:#fff;font-size:1.25rem;font-weight:800;
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 1.25rem;box-shadow:0 6px 20px rgba(99,102,241,.3);
`;

const StepTitle = styled.h3`font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:.5rem;`;
const StepDesc = styled.p`font-size:.875rem;color:#64748b;line-height:1.6;margin:0;`;

/* ── Testimonials ── */
const TestiGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;
`;

const TestiCard = styled(motion.div)`
  background:#fff;border:1px solid #e2e8f0;border-radius:1.25rem;padding:1.75rem;
  &:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.07);}
  transition:all .25s;
`;

const Stars = styled.div`display:flex;gap:.2rem;margin-bottom:1rem;`;
const Quote = styled.p`font-size:.9375rem;color:#334155;line-height:1.65;margin-bottom:1.25rem;`;
const TestiAuthor = styled.div`display:flex;align-items:center;gap:.75rem;`;
const AuthorAvatar = styled.div<{$bg:string}>`
  width:40px;height:40px;border-radius:50%;
  background:${p=>p.$bg};color:#fff;
  display:flex;align-items:center;justify-content:center;
  font-weight:700;font-size:.875rem;
`;
const AuthorName = styled.div`font-weight:700;font-size:.875rem;color:#0f172a;`;
const AuthorRole = styled.div`font-size:.75rem;color:#94a3b8;`;

/* ── Stats band ── */
const StatsBand = styled.section`
  background:linear-gradient(135deg,#1e1b4b 0%,#0f172a 100%);
  padding:5rem 1.5rem;position:relative;overflow:hidden;
`;

const StatsGrid = styled.div`
  max-width:900px;margin:0 auto;
  display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:2rem;
`;

const StatItem = styled(motion.div)`text-align:center;`;
const StatNum = styled.div`
  font-size:2.5rem;font-weight:900;letter-spacing:-.04em;
  background:linear-gradient(135deg,#818cf8,#38bdf8);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
`;
const StatLabel = styled.div`font-size:.875rem;color:#64748b;font-weight:500;margin-top:.375rem;`;

/* ── CTA banner ── */
const CTABanner = styled.section`
  background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);
  padding:5rem 1.5rem;text-align:center;position:relative;overflow:hidden;
`;

const CTATitle = styled(motion.h2)`
  font-size:clamp(2rem,4vw,3rem);font-weight:900;color:#fff;
  letter-spacing:-.04em;margin-bottom:1rem;
`;

const CTASub = styled(motion.p)`font-size:1.0625rem;color:rgba(255,255,255,.8);margin-bottom:2.5rem;`;

const WhiteBtn = styled(motion(Link))`
  display:inline-flex;align-items:center;gap:.5rem;
  padding:.875rem 2rem;border-radius:.875rem;
  background:#fff;color:#4f46e5;font-weight:700;font-size:1rem;
  text-decoration:none;box-shadow:0 8px 30px rgba(0,0,0,.15);
  transition:all .2s;
  &:hover{color:#4338ca;transform:translateY(-2px);box-shadow:0 14px 40px rgba(0,0,0,.2);}
`;

/* ── Scroll to top ── */
const ScrollTop = styled(motion.button)`
  position:fixed;bottom:2rem;right:2rem;width:44px;height:44px;border-radius:50%;
  background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;color:#fff;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  box-shadow:0 8px 24px rgba(99,102,241,.4);z-index:999;
`;

/* ── Component ── */
const Home: React.FC = () => {
  const { user } = useAuth();
  const [showTop, setShowTop] = useState(false);
  useEffect(()=>{
    const h=()=>setShowTop(window.scrollY>400);
    window.addEventListener('scroll',h,{passive:true});
    return()=>window.removeEventListener('scroll',h);
  },[]);

  const features = user?.role === 'tutor' ? [
    {icon:MessageCircle,title:'Answer Zone',desc:'Browse student doubts by subject. Provide quality answers and earn reputation instantly.',color:'#6366f1',bg:'linear-gradient(135deg,#6366f1,#8b5cf6)',link:'/answer-zone'},
    {icon:Users,title:'Host Sessions',desc:'Conduct 1:1 mentorship sessions. Provide career guidance and help students grow.',color:'#10b981',bg:'linear-gradient(135deg,#10b981,#059669)',link:'/sessions'},
    {icon:Briefcase,title:'Freelance Board',desc:'Find freelance gigs or post projects. Build a real portfolio while tutoring.',color:'#f97316',bg:'linear-gradient(135deg,#f97316,#f59e0b)',link:'/freelance'},
    {icon:Award,title:'XP & Reputation',desc:'Earn XP, unlock badges, climb the leaderboard by helping and contributing.',color:'#8b5cf6',bg:'linear-gradient(135deg,#8b5cf6,#a855f7)',link:'/profile'},
  ] : [
    {icon:MessageCircle,title:'Ask Zone',desc:'Post doubts tagged by subject. Get quality answers from peers and expert tutors instantly.',color:'#6366f1',bg:'linear-gradient(135deg,#6366f1,#8b5cf6)',link:'/ask-zone'},
    {icon:Users,title:'Mentor Match',desc:'Connect 1:1 with vetted mentors for personalized career advice and skill development.',color:'#10b981',bg:'linear-gradient(135deg,#10b981,#059669)',link:'/mentors'},
    {icon:Briefcase,title:'Freelance Board',desc:'Find freelance gigs or post projects. Build a real portfolio while studying.',color:'#f97316',bg:'linear-gradient(135deg,#f97316,#f59e0b)',link:'/freelance'},
    {icon:Award,title:'XP & Reputation',desc:'Earn XP, unlock badges, climb the leaderboard by helping and contributing.',color:'#8b5cf6',bg:'linear-gradient(135deg,#8b5cf6,#a855f7)',link:'/profile'},
  ];

  const steps = [
    {n:'1',title:'Create your profile',desc:'Sign up in 30 seconds. Pick your role — student, mentor, or freelancer.'},
    {n:'2',title:'Find your community',desc:'Browse mentors, post doubts, or list services on the freelance board.'},
    {n:'3',title:'Learn & grow',desc:'Get answers, book sessions, complete projects, and earn reputation.'},
  ];

  const testimonials = [
    {q:'Mentora helped me land my first internship. My mentor guided me through every step of the process.',name:'Priya S.',role:'CS Student',initials:'PS',bg:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
    {q:'As a tutor, I love how easy it is to help students and earn reputation for my answers.',name:'Arjun K.',role:'Tutor · IIT Delhi',initials:'AK',bg:'linear-gradient(135deg,#10b981,#059669)'},
    {q:'Got 3 freelance clients through Mentora in my first month. The platform just works.',name:'Sneha M.',role:'Full-Stack Dev',initials:'SM',bg:'linear-gradient(135deg,#f97316,#f59e0b)'},
  ];

  const stats = [
    {num:'12K+',label:'Active Students'},
    {num:'600+',label:'Expert Mentors'},
    {num:'3K+',label:'Doubts Solved'},
    {num:'450+',label:'Projects Posted'},
  ];

  const fade={hidden:{opacity:0,y:24},visible:{opacity:1,y:0}};

  return (
    <Page>
      {/* ── HERO ── */}
      <Hero>
        <GridBg/>
        <Orb $c="#6366f1" $s={500} $t="-10%" $l="-10%" $d="12s"/>
        <Orb $c="#8b5cf6" $s={400} $t="20%" $l="60%" $d="15s"/>
        <Orb $c="#0ea5e9" $s={300} $t="60%" $l="30%" $d="18s"/>

        <HeroInner>
          <Pill initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{duration:.5}}>
            <Zap size={13}/> The student-first learning platform
          </Pill>

          <HeroH1 initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.1}}>
            Learn. Solve.<br/><span>Grow Together.</span>
          </HeroH1>

          <HeroSub initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.2}}>
            Your all-in-one space for doubt-solving, 1:1 mentorship, and freelancing — built for students, by students.
          </HeroSub>

          <CTARow initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.3}}>
            {!user ? (
              <>
                <PrimaryBtn to="/register" whileHover={{scale:1.03}} whileTap={{scale:.97}}>
                  Get started free <ArrowRight size={18}/>
                </PrimaryBtn>
                <GhostBtn to="/ask-zone" whileHover={{scale:1.03}} whileTap={{scale:.97}}>
                  <Play size={16}/> Explore Ask Zone
                </GhostBtn>
              </>
            ) : (
              <>
                {user.role === 'tutor' ? (
                  <PrimaryBtn to="/answer-zone" whileHover={{scale:1.03}} whileTap={{scale:.97}}>
                    Explore Answer Zone <ArrowRight size={18}/>
                  </PrimaryBtn>
                ) : (
                  <PrimaryBtn to="/ask-zone" whileHover={{scale:1.03}} whileTap={{scale:.97}}>
                    Explore Ask Zone <ArrowRight size={18}/>
                  </PrimaryBtn>
                )}
              </>
            )}
          </CTARow>

          <TrustRow initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6,delay:.5}}>
            {stats.map((s,i)=>(
              <React.Fragment key={s.label}>
                {i>0&&<TrustDivider/>}
                <TrustStat>
                  <TrustNum>{s.num}</TrustNum>
                  <TrustLabel>{s.label}</TrustLabel>
                </TrustStat>
              </React.Fragment>
            ))}
          </TrustRow>
        </HeroInner>
      </Hero>

      {/* ── FEATURES ── */}
      <Section>
        <MaxW>
          <SectionEyebrow initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} transition={{duration:.5}}>
            <span>Platform Features</span>
          </SectionEyebrow>
          <SectionH2 initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} transition={{duration:.5,delay:.1}}>
            Everything you need to succeed
          </SectionH2>
          <SectionSub initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} transition={{duration:.5,delay:.15}}>
            Mentora is a complete ecosystem — ask doubts, find mentors, pick up freelance work, and build your reputation.
          </SectionSub>
          <FeatGrid>
            {features.map((f,i)=>(
              <Link key={f.title} to={f.link} style={{textDecoration:'none', display:'block', height:'100%'}}>
                <FeatCard
                  $accent={f.color}
                  initial={{opacity:0,y:32}}
                  whileInView={{opacity:1,y:0}}
                  viewport={{once:true}}
                  transition={{duration:.5,delay:i*.1}}
                >
                  <FeatIcon $bg={f.bg}><f.icon size={24}/></FeatIcon>
                  <FeatTitle>{f.title}</FeatTitle>
                  <FeatDesc>{f.desc}</FeatDesc>
                </FeatCard>
              </Link>
            ))}
          </FeatGrid>
        </MaxW>
      </Section>

      {/* ── STATS BAND ── */}
      <StatsBand>
        <MaxW>
          <SectionH2 style={{color:'#f8fafc'}} initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade}>
            Trusted by thousands of learners
          </SectionH2>
          <StatsGrid>
            {stats.map((s,i)=>(
              <StatItem key={s.label} initial={{opacity:0,scale:.8}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.5,delay:i*.1}}>
                <StatNum>{s.num}</StatNum>
                <StatLabel>{s.label}</StatLabel>
              </StatItem>
            ))}
          </StatsGrid>
        </MaxW>
      </StatsBand>

      {/* ── HOW IT WORKS ── */}
      <Section $bg="#f8fafc">
        <MaxW>
          <SectionEyebrow initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade}>
            <span>How It Works</span>
          </SectionEyebrow>
          <SectionH2 initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} transition={{delay:.1}}>
            Up and running in minutes
          </SectionH2>
          <SectionSub initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} transition={{delay:.15}}>
            Three simple steps to start your learning journey on Mentora.
          </SectionSub>
          <Steps>
            {steps.map((s,i)=>(
              <StepCard key={s.n} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5,delay:i*.12}}>
                <StepNum>{s.n}</StepNum>
                <StepTitle>{s.title}</StepTitle>
                <StepDesc>{s.desc}</StepDesc>
              </StepCard>
            ))}
          </Steps>
        </MaxW>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section>
        <MaxW>
          <SectionEyebrow initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade}>
            <span>Testimonials</span>
          </SectionEyebrow>
          <SectionH2 initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} transition={{delay:.1}}>
            Loved by students & mentors
          </SectionH2>
          <SectionSub initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} transition={{delay:.15}}>
            Real results from real people in the Mentora community.
          </SectionSub>
          <TestiGrid>
            {testimonials.map((t,i)=>(
              <TestiCard key={t.name} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5,delay:i*.12}}>
                <Stars>{[...Array(5)].map((_,j)=><Star key={j} size={14} color="#f59e0b" fill="#f59e0b"/>)}</Stars>
                <Quote>"{t.q}"</Quote>
                <TestiAuthor>
                  <AuthorAvatar $bg={t.bg}>{t.initials}</AuthorAvatar>
                  <div><AuthorName>{t.name}</AuthorName><AuthorRole>{t.role}</AuthorRole></div>
                </TestiAuthor>
              </TestiCard>
            ))}
          </TestiGrid>
        </MaxW>
      </Section>

      {/* ── CTA BANNER ── */}
      <CTABanner>
        <CTATitle initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade}>
          {user ? 'Ready to dive back in?' : 'Ready to start learning?'}
        </CTATitle>
        <CTASub initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} transition={{delay:.1}}>
          {user 
            ? 'Continue growing your skills with the Mentora community.' 
            : 'Join 12,000+ students already growing with Mentora. Free forever.'}
        </CTASub>
        <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} transition={{delay:.2}}>
          {user ? (
            <WhiteBtn to="/dashboard" whileHover={{scale:1.03}} whileTap={{scale:.97}}>
              Go to Dashboard <ArrowRight size={18}/>
            </WhiteBtn>
          ) : (
            <WhiteBtn to="/register" whileHover={{scale:1.03}} whileTap={{scale:.97}}>
              Create free account <ArrowRight size={18}/>
            </WhiteBtn>
          )}
        </motion.div>
      </CTABanner>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop&&(
          <ScrollTop initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0}} whileHover={{scale:1.1}} whileTap={{scale:.9}} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
            <ChevronUp size={20}/>
          </ScrollTop>
        )}
      </AnimatePresence>
    </Page>
  );
};

export default Home;