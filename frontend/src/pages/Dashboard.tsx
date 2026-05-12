import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  MessageCircle, Users, Briefcase, TrendingUp,
  Award, Clock, BookOpen, Star, Plus, ArrowRight,
  LayoutDashboard, Activity, Zap,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/Avatar';

/* ── Layout ── */
const DashLayout = styled.div`
  display:flex;min-height:100vh;background:#f8fafc;padding-top:68px;
`;

const Sidebar = styled.div`
  width:240px;flex-shrink:0;background:#0f172a;
  position:sticky;top:68px;
  align-self: flex-start;
  height:calc(100vh - 68px);
  display:flex;flex-direction:column;
  border-right:1px solid rgba(255,255,255,.06);
  overflow:hidden;z-index:100;
  @media(max-width:1024px){display:none;}
`;

const SideTop = styled.div`
  padding:1.5rem 1rem 1rem;border-bottom:1px solid rgba(255,255,255,.06);
`;

const SideUser = styled.div`
  display:flex;align-items:center;gap:.75rem;margin-bottom:1rem;
`;

const SideUserInfo = styled.div``;
const SideUserName = styled.div`font-size:.875rem;font-weight:700;color:#f8fafc;`;
const SideUserRole = styled.div`font-size:.7rem;color:#64748b;text-transform:capitalize;`;

const XPBar = styled.div`margin-top:.75rem;`;
const XPLabel = styled.div`display:flex;justify-content:space-between;font-size:.7rem;color:#64748b;margin-bottom:.375rem;`;

const SideNav = styled.nav`flex:1;padding:1rem 0.75rem 0;overflow-y:auto;`;

const SideSection = styled.div`margin-bottom:0.5rem;`;
const SideSectionTitle = styled.div`
  font-size:.65rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  color:#334155;padding:.25rem .5rem;margin-bottom:.375rem;
`;

const SideLink = styled(Link)<{$active?:boolean}>`
  display:flex;align-items:center;gap:.75rem;padding:.625rem .75rem;
  border-radius:.625rem;text-decoration:none;font-size:.875rem;font-weight:500;
  margin-bottom:.125rem;transition:all .15s;
  color:${p=>p.$active?'#818cf8':'#64748b'};
  background:${p=>p.$active?'rgba(99,102,241,.15)':'transparent'};
  &:hover{color:#818cf8;background:rgba(99,102,241,.1);}
  svg{flex-shrink:0;}
`;

const SideBottom = styled.div`
  padding:0.75rem;border-top:1px solid rgba(255,255,255,.06);
`;

const LevelBadge = styled.div`
  display:flex;align-items:center;gap:.5rem;padding:.625rem .875rem;
  background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.2);
  border-radius:.75rem;
`;
const LevelIcon = styled.div`
  width:28px;height:28px;border-radius:50%;
  background:linear-gradient(135deg,#f59e0b,#f97316);
  display:flex;align-items:center;justify-content:center;color:#fff;font-size:.75rem;
`;
const LevelText = styled.div``;
const LevelNum = styled.div`font-size:.8125rem;font-weight:700;color:#f8fafc;`;
const LevelSub = styled.div`font-size:.65rem;color:#64748b;`;

/* ── Main ── */
const Main = styled.main`
  flex:1;padding:2rem;
  @media(max-width:640px){padding:1.25rem;}
`;

const PageHeader = styled.div`margin-bottom:2rem;`;
const GreetBadge = styled.div`
  display:inline-flex;align-items:center;gap:.375rem;
  padding:.25rem .75rem;border-radius:9999px;
  background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.15);
  color:#6366f1;font-size:.75rem;font-weight:600;margin-bottom:.75rem;
`;
const GreetTitle = styled.h1`
  font-size:1.75rem;font-weight:800;color:#0f172a;
  letter-spacing:-.03em;margin-bottom:.375rem;
`;
const GreetSub = styled.p`font-size:.9375rem;color:#64748b;margin:0;`;

/* ── Stat cards ── */
const StatsRow = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem;
`;

const StatCard = styled(motion.div)<{$accent:string}>`
  background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.375rem;
  transition:all .25s;
  &:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(99,102,241,.1);border-color:${p=>p.$accent}30;}
`;

const StatTop = styled.div`display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.875rem;`;
const StatIconBox = styled.div<{$bg:string}>`
  width:44px;height:44px;border-radius:.75rem;
  background:${p=>p.$bg};display:flex;align-items:center;justify-content:center;color:#fff;
  box-shadow:0 4px 12px ${p=>p.$bg}60;
`;
const StatTrend = styled.span<{$up:boolean}>`
  font-size:.7rem;font-weight:700;padding:.2rem .5rem;border-radius:9999px;
  background:${p=>p.$up?'rgba(16,185,129,.1)':'rgba(239,68,68,.1)'};
  color:${p=>p.$up?'#059669':'#dc2626'};
`;
const StatVal = styled.div`font-size:1.625rem;font-weight:800;color:#0f172a;letter-spacing:-.03em;`;
const StatLbl = styled.div`font-size:.8125rem;color:#64748b;font-weight:500;margin-top:.2rem;`;

/* ── Grid 2-col ── */
const TwoCol = styled.div`
  display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:2rem;
  @media(max-width:900px){grid-template-columns:1fr;}
`;

const Panel = styled.div`
  background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.5rem;
`;

const PanelTitle = styled.div`
  display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;
`;
const PanelH = styled.h2`font-size:1rem;font-weight:700;color:#0f172a;`;
const PanelLink = styled(Link)`font-size:.8125rem;color:#6366f1;font-weight:600;text-decoration:none;&:hover{color:#4f46e5;}`;

/* ── Activity ── */
const ActivityList = styled.div`display:flex;flex-direction:column;gap:.125rem;`;
const ActivityRow = styled.div`
  display:flex;align-items:center;gap:.875rem;padding:.75rem .5rem;
  border-radius:.625rem;transition:background .15s;&:hover{background:#f8fafc;}
`;
const ActivityDot = styled.div<{$c:string}>`
  width:36px;height:36px;border-radius:50%;flex-shrink:0;
  background:${p=>p.$c};display:flex;align-items:center;justify-content:center;color:#fff;
`;
const ActivityBody = styled.div`flex:1;`;
const ActivityText = styled.div`font-size:.875rem;color:#1e293b;font-weight:500;`;
const ActivityTime = styled.div`font-size:.75rem;color:#94a3b8;margin-top:.1rem;`;

/* ── Quick actions ── */
const ActionGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem;
`;
const ActionCard = styled(Link)<{$accent:string}>`
  display:flex;flex-direction:column;align-items:center;text-align:center;
  padding:1.5rem 1rem;background:#fff;border:1.5px solid #e2e8f0;
  border-radius:1rem;text-decoration:none;transition:all .2s;
  &:hover{border-color:${p=>p.$accent}50;transform:translateY(-3px);box-shadow:0 12px 30px ${p=>p.$accent}15;}
`;
const ActionIco = styled.div<{$bg:string}>`
  width:48px;height:48px;border-radius:.875rem;
  background:${p=>p.$bg};display:flex;align-items:center;justify-content:center;
  color:#fff;margin-bottom:.875rem;box-shadow:0 4px 12px ${p=>p.$bg}60;
`;
const ActionTitle = styled.div`font-size:.875rem;font-weight:700;color:#0f172a;margin-bottom:.25rem;`;
const ActionDesc = styled.div`font-size:.75rem;color:#94a3b8;`;

/* ── Component ── */
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const location = window.location;

  const getStats = () => {
    switch(user?.role){
      case 'student': return [
        {icon:MessageCircle,label:'Questions Asked',value:'12',trend:'+3',up:true,color:'#6366f1',bg:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
        {icon:BookOpen,     label:'Answers Received',value:'28',trend:'+8',up:true,color:'#10b981',bg:'linear-gradient(135deg,#10b981,#059669)'},
        {icon:Award,        label:'XP Points',value:String(user?.xp||0),trend:'+50',up:true,color:'#f59e0b',bg:'linear-gradient(135deg,#f59e0b,#f97316)'},
        {icon:TrendingUp,   label:'Current Level',value:String(user?.level||1),trend:'↑',up:true,color:'#8b5cf6',bg:'linear-gradient(135deg,#8b5cf6,#a855f7)'},
      ];
      case 'tutor': return [
        {icon:Users,        label:'Students Helped',value:'45',trend:'+5',up:true,color:'#10b981',bg:'linear-gradient(135deg,#10b981,#059669)'},
        {icon:MessageCircle,label:'Answers Given',value:'89',trend:'+12',up:true,color:'#6366f1',bg:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
        {icon:Star,         label:'Avg Rating',value:'4.8',trend:'+0.1',up:true,color:'#f59e0b',bg:'linear-gradient(135deg,#f59e0b,#f97316)'},
        {icon:Award,        label:'XP Points',value:String(user?.xp||0),trend:'+80',up:true,color:'#8b5cf6',bg:'linear-gradient(135deg,#8b5cf6,#a855f7)'},
      ];
      default: return [
        {icon:MessageCircle,label:'Total Questions',value:'1,234',trend:'+24',up:true,color:'#6366f1',bg:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
        {icon:Users,        label:'Active Users',value:'567',trend:'+12',up:true,color:'#10b981',bg:'linear-gradient(135deg,#10b981,#059669)'},
        {icon:Briefcase,    label:'Projects',value:'89',trend:'+4',up:true,color:'#f97316',bg:'linear-gradient(135deg,#f97316,#f59e0b)'},
        {icon:TrendingUp,   label:'Growth',value:'+12%',trend:'+2%',up:true,color:'#8b5cf6',bg:'linear-gradient(135deg,#8b5cf6,#a855f7)'},
      ];
    }
  };

  const getActions = () => {
    switch(user?.role){
      case 'student': return [
        {icon:Plus,         title:'Ask Question',  desc:'Post a doubt',     link:'/ask-zone', color:'#6366f1',bg:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
        {icon:Users,        title:'Find Mentor',   desc:'Connect 1:1',      link:'/mentors',  color:'#10b981',bg:'linear-gradient(135deg,#10b981,#059669)'},
        {icon:BookOpen,     title:'Browse Q&A',    desc:'Learn from others', link:'/ask-zone', color:'#f97316',bg:'linear-gradient(135deg,#f97316,#f59e0b)'},
        {icon:Briefcase,    title:'Freelance',     desc:'Find gigs',         link:'/freelance',color:'#8b5cf6',bg:'linear-gradient(135deg,#8b5cf6,#a855f7)'},
      ];
      case 'tutor': return [
        {icon:MessageCircle,title:'Answer Zone', desc:'Help students', link:'/answer-zone',color:'#6366f1',bg:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
        {icon:Users,        title:'Sessions',   desc:'My schedule',  link:'/sessions',    color:'#10b981',bg:'linear-gradient(135deg,#10b981,#059669)'},
        {icon:Award,        title:'Profile',    desc:'Update skills', link:'/profile',     color:'#8b5cf6',bg:'linear-gradient(135deg,#8b5cf6,#a855f7)'},
      ];
      default: return [
        {icon:Briefcase,    title:'Projects',  desc:'Browse gigs',  link:'/freelance',color:'#6366f1',bg:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
        {icon:Users,        title:'Mentors',   desc:'Find experts', link:'/mentors',  color:'#10b981',bg:'linear-gradient(135deg,#10b981,#059669)'},
        {icon:BookOpen,     title:'Ask Zone',  desc:'Q&A community',link:'/ask-zone', color:'#f97316',bg:'linear-gradient(135deg,#f97316,#f59e0b)'},
      ];
    }
  };

  const activity = [
    {icon:MessageCircle,text:'New question in Mathematics',  time:'2 min ago', color:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
    {icon:Award,        text:'You earned 50 XP',             time:'1 hr ago',  color:'linear-gradient(135deg,#f59e0b,#f97316)'},
    {icon:Users,        text:'Mentor match request',         time:'3 hr ago',  color:'linear-gradient(135deg,#10b981,#059669)'},
    {icon:Star,         text:'5-star rating received',       time:'1 day ago', color:'linear-gradient(135deg,#8b5cf6,#a855f7)'},
  ];

  const getSideLinks = () => {
    switch (user?.role) {
      case 'tutor': return [
        {path:'/dashboard',    label:'Dashboard',    icon:LayoutDashboard},
        {path:'/answer-zone',  label:'Answer Zone',  icon:BookOpen},
        {path:'/sessions',     label:'My Sessions',  icon:Clock},
        {path:'/freelance',    label:'Freelance',    icon:Briefcase},
        {path:'/profile',      label:'Profile',      icon:Activity},
      ];
      case 'freelancer': return [
        {path:'/dashboard',    label:'Dashboard',    icon:LayoutDashboard},
        {path:'/freelance',    label:'Projects',     icon:Briefcase},
        {path:'/mentors',      label:'Find Mentors', icon:Users},
        {path:'/profile',      label:'Portfolio',    icon:Activity},
      ];
      default: return [ // student
        {path:'/dashboard',    label:'Dashboard',    icon:LayoutDashboard},
        {path:'/ask-zone',     label:'Ask Zone',     icon:MessageCircle},
        {path:'/mentors',      label:'Mentors',      icon:Users},
        {path:'/sessions',     label:'Sessions',     icon:Clock},
        {path:'/freelance',    label:'Freelance',    icon:Briefcase},
        {path:'/profile',      label:'Profile',      icon:Activity},
      ];
    }
  };

  const sideLinks = getSideLinks();

  const stats   = getStats();
  const actions = getActions();
  const xpMax   = 500;
  const xp      = Number(user?.xp || 0);
  const level   = user?.level || 1;

  const isActive = (p:string) => location.pathname === p;

  return (
    <DashLayout>
      {/* Sidebar */}
      <Sidebar>
        <SideTop>
          <SideUser>
            <Avatar name={user?.name || ''} size="md" online/>
            <SideUserInfo>
              <SideUserName>{user?.name?.split(' ')[0] || 'User'}</SideUserName>
              <SideUserRole>{user?.role || 'member'}</SideUserRole>
            </SideUserInfo>
          </SideUser>
          <XPBar>
            <XPLabel><span>XP Progress</span><span>{xp}/{xpMax}</span></XPLabel>
            <ProgressBar value={xp} max={xpMax} size="sm" color="primary"/>
          </XPBar>
        </SideTop>

        <SideNav>
          <SideSection>
            <SideSectionTitle>Navigation</SideSectionTitle>
            {sideLinks.map(({path,label,icon:Icon})=>(
              <SideLink key={path} to={path} $active={isActive(path)}>
                <Icon size={16}/>{label}
                {isActive(path)&&<Badge variant="primary" size="sm" style={{marginLeft:'auto'}}>Active</Badge>}
              </SideLink>
            ))}
          </SideSection>
        </SideNav>

        <SideBottom>
          <LevelBadge>
            <LevelIcon>⭐</LevelIcon>
            <LevelText>
              <LevelNum>Level {level}</LevelNum>
              <LevelSub>{xpMax-xp} XP to next</LevelSub>
            </LevelText>
          </LevelBadge>
        </SideBottom>
      </Sidebar>

      {/* Main content */}
      <Main>
        {/* Header */}
        <PageHeader>
          <GreetBadge><Zap size={12}/> Dashboard</GreetBadge>
          <GreetTitle>Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋</GreetTitle>
          <GreetSub>Here's what's happening with your {user?.role || 'account'} today.</GreetSub>
        </PageHeader>

        {/* Stats */}
        <StatsRow>
          {stats.map((s,i)=>(
            <StatCard key={s.label} $accent={s.color} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:i*.08}}>
              <StatTop>
                <StatIconBox $bg={s.bg}><s.icon size={20}/></StatIconBox>
                <StatTrend $up={s.up}>{s.trend}</StatTrend>
              </StatTop>
              <StatVal>{s.value}</StatVal>
              <StatLbl>{s.label}</StatLbl>
            </StatCard>
          ))}
        </StatsRow>

        {/* Quick actions */}
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
            <h2 style={{fontSize:'1rem',fontWeight:700,color:'#0f172a'}}>Quick Actions</h2>
          </div>
          <ActionGrid>
            {actions.map(a=>(
              <ActionCard key={a.title} to={a.link} $accent={a.color}>
                <ActionIco $bg={a.bg}><a.icon size={22}/></ActionIco>
                <ActionTitle>{a.title}</ActionTitle>
                <ActionDesc>{a.desc}</ActionDesc>
              </ActionCard>
            ))}
          </ActionGrid>
        </div>

        {/* Two col */}
        <TwoCol>
          <Panel>
            <PanelTitle>
              <PanelH>Recent Activity</PanelH>
              <PanelLink to="/dashboard">View all <ArrowRight size={12}/></PanelLink>
            </PanelTitle>
            <ActivityList>
              {activity.map((a,i)=>(
                <ActivityRow key={i}>
                  <ActivityDot $c={a.color}><a.icon size={16}/></ActivityDot>
                  <ActivityBody>
                    <ActivityText>{a.text}</ActivityText>
                    <ActivityTime>{a.time}</ActivityTime>
                  </ActivityBody>
                </ActivityRow>
              ))}
            </ActivityList>
          </Panel>

          <Panel>
            <PanelTitle>
              <PanelH>Your Progress</PanelH>
              <Badge variant="primary" size="sm">Level {level}</Badge>
            </PanelTitle>
            <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
              <ProgressBar value={xp} max={xpMax} color="primary" label="XP Progress" showValue size="md"/>
              <ProgressBar value={75} max={100} color="success"  label="Profile Complete" showValue size="md"/>
              <ProgressBar value={40} max={100} color="warning"  label="Goals This Week" showValue size="md"/>
            </div>

            <div style={{marginTop:'1.5rem',padding:'1rem',background:'#f8fafc',borderRadius:'.75rem',border:'1px solid #e2e8f0'}}>
              <div style={{fontSize:'.8125rem',fontWeight:700,color:'#0f172a',marginBottom:'.5rem'}}>🎯 Next milestone</div>
              <div style={{fontSize:'.8125rem',color:'#64748b'}}>Earn {xpMax-xp} more XP to reach <strong>Level {Number(level)+1}</strong> and unlock new features.</div>
            </div>
          </Panel>
        </TwoCol>
      </Main>
    </DashLayout>
  );
};

export default Dashboard;