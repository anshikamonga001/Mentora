import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  User, Edit3, Save, X,
  Award, Star, Briefcase, BookOpen, Users,
  Camera, Shield, Settings, Bell, Lock, CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/Avatar';

/* ── Styles ── */
const Page = styled.div`min-height:100vh;background:#f8fafc;padding-top:68px;`;

const HeroBand = styled.div`
  background:linear-gradient(135deg,#1e1b4b 0%,#0f172a 100%);
  padding:3rem 1.5rem 5rem;position:relative;overflow:hidden;
  &::before{content:'';position:absolute;inset:0;
    background-image:linear-gradient(rgba(99,102,241,.05) 1px,transparent 1px),
      linear-gradient(90deg,rgba(99,102,241,.05) 1px,transparent 1px);
    background-size:40px 40px;pointer-events:none;}
`;
const HeroInner = styled.div`max-width:900px;margin:0 auto;position:relative;z-index:1;`;

const ProfileCard = styled(motion.div)`
  max-width:900px;margin:-3.5rem auto 2rem;padding:0 1.5rem;
`;
const ProfileCardInner = styled.div`
  background:#fff;border:1px solid #e2e8f0;border-radius:1.25rem;
  padding:1.75rem;box-shadow:0 16px 40px rgba(0,0,0,.08);
`;

const HeaderRow = styled.div`
  display:flex;align-items:flex-start;gap:1.5rem;margin-bottom:1.5rem;
  @media(max-width:600px){flex-direction:column;align-items:center;text-align:center;}
`;
const AvatarWrap = styled.div`position:relative;flex-shrink:0;`;
const CameraBtn = styled.button`
  position:absolute;bottom:0;right:0;width:28px;height:28px;border-radius:50%;
  background:linear-gradient(135deg,#6366f1,#8b5cf6);border:2px solid #fff;
  display:flex;align-items:center;justify-content:center;color:#fff;cursor:pointer;
`;
const NameBlock = styled.div`flex:1;`;
const UserName = styled.h1`font-size:1.625rem;font-weight:900;letter-spacing:-.03em;color:#0f172a;margin-bottom:.375rem;`;
const UserBio = styled.p`font-size:.9rem;color:#64748b;line-height:1.6;margin:.5rem 0 1rem;max-width:480px;`;
const StatsRow = styled.div`display:flex;gap:2rem;flex-wrap:wrap;`;
const StatItem = styled.div`text-align:center;`;
const StatVal = styled.div`font-size:1.25rem;font-weight:800;color:#0f172a;letter-spacing:-.03em;`;
const StatLbl = styled.div`font-size:.7rem;color:#94a3b8;font-weight:500;margin-top:.1rem;`;
const EditBtn = styled(motion.button)`
  display:flex;align-items:center;gap:.5rem;padding:.5625rem 1rem;
  border-radius:.75rem;border:1.5px solid #e2e8f0;background:#fff;
  color:#334155;font-weight:600;font-size:.875rem;cursor:pointer;font-family:inherit;
  &:hover{border-color:rgba(99,102,241,.3);color:#6366f1;}
`;

const Main = styled.div`max-width:900px;margin:0 auto;padding:0 1.5rem 3rem;`;

const Tabs = styled.div`
  display:flex;gap:.25rem;background:#f1f5f9;padding:.3rem;border-radius:.875rem;
  margin-bottom:1.75rem;
`;
const Tab = styled.button<{$active:boolean}>`
  flex:1;padding:.5rem .875rem;border-radius:.625rem;border:none;cursor:pointer;
  font-family:inherit;font-weight:600;font-size:.875rem;transition:all .2s;
  background:${p=>p.$active?'#fff':'transparent'};
  color:${p=>p.$active?'#4f46e5':'#64748b'};
  box-shadow:${p=>p.$active?'0 1px 4px rgba(0,0,0,.08)':'none'};
`;

const Panel = styled(motion.div)`
  background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.75rem;
`;
const Grid2 = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;@media(max-width:600px){grid-template-columns:1fr;}`;
const FGroup = styled.div``;
const FLabel = styled.label`display:block;font-size:.8125rem;font-weight:600;color:#374151;margin-bottom:.375rem;`;
const FInput = styled.input<{$disabled?:boolean}>`
  width:100%;padding:.625rem .875rem;border:1.5px solid #e2e8f0;border-radius:.75rem;
  font-size:.9rem;font-family:inherit;color:#0f172a;
  background:${p=>p.$disabled?'#f8fafc':'#fff'};
  &:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1);}
  &::placeholder{color:#cbd5e1;}
`;
const FTextarea = styled.textarea<{$disabled?:boolean}>`
  width:100%;padding:.625rem .875rem;border:1.5px solid #e2e8f0;border-radius:.75rem;
  font-size:.9rem;font-family:inherit;color:#0f172a;min-height:90px;resize:vertical;
  background:${p=>p.$disabled?'#f8fafc':'#fff'};
  &:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1);}
  &::placeholder{color:#cbd5e1;}
`;
const BtnRow = styled.div`display:flex;gap:.75rem;justify-content:flex-end;margin-top:1.5rem;`;
const SecBtn = styled(motion.button)`
  display:flex;align-items:center;gap:.5rem;padding:.625rem 1.125rem;
  border-radius:.75rem;border:1.5px solid #e2e8f0;background:#fff;
  color:#475569;font-weight:600;font-size:.875rem;cursor:pointer;font-family:inherit;
`;
const PrimaryBtn = styled(motion.button)`
  display:flex;align-items:center;gap:.5rem;padding:.625rem 1.5rem;
  border-radius:.75rem;border:none;background:linear-gradient(135deg,#6366f1,#8b5cf6);
  color:#fff;font-weight:700;font-size:.875rem;cursor:pointer;font-family:inherit;
  box-shadow:0 4px 12px rgba(99,102,241,.3);
`;

const AchGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;`;
const AchCard = styled(motion.div)`
  background:#f8fafc;border:1px solid #e2e8f0;border-radius:1rem;
  padding:1.375rem;text-align:center;transition:all .2s;
  &:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,.07);border-color:rgba(99,102,241,.2);}
`;
const AchIcon = styled.div<{$bg:string}>`
  width:52px;height:52px;border-radius:.875rem;background:${p=>p.$bg};
  display:flex;align-items:center;justify-content:center;color:#fff;
  margin:0 auto .875rem;box-shadow:0 4px 12px ${p=>p.$bg}60;
`;
const AchTitle = styled.h3`font-size:.9rem;font-weight:700;color:#0f172a;margin-bottom:.25rem;`;
const AchDesc = styled.p`font-size:.75rem;color:#64748b;margin:0;`;

const ToggleRow = styled.label`
  display:flex;align-items:center;justify-content:space-between;
  padding:.875rem 1rem;background:#f8fafc;border-radius:.75rem;
  border:1px solid #e2e8f0;margin-bottom:.625rem;cursor:pointer;
  &:hover{border-color:rgba(99,102,241,.2);}
`;
const ToggleLabel = styled.div``;
const ToggleName = styled.div`font-size:.9rem;font-weight:600;color:#0f172a;`;
const ToggleSub = styled.div`font-size:.75rem;color:#94a3b8;margin-top:.1rem;`;
const Toggle = styled.input`
  width:42px;height:22px;appearance:none;background:#cbd5e1;border-radius:9999px;
  cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;
  &:checked{background:#6366f1;}
  &::after{content:'';position:absolute;top:2px;left:2px;width:18px;height:18px;
    border-radius:50%;background:#fff;transition:transform .2s;}
  &:checked::after{transform:translateX(20px);}
`;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'personal'|'achievements'|'settings'>('personal');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name||'', email: user?.email||'',
    phone:'', location:'', bio:'', skills:''
  });

  const onChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(p=>({...p,[e.target.name]:e.target.value}));

  const getStats = () => {
    switch(user?.role) {
      case 'student': return [{v:'12',l:'Questions'},{v:'28',l:'Answers'},{v:String(user?.xp||0),l:'XP Points'},{v:String(user?.level||1),l:'Level'}];
      case 'tutor':   return [{v:'45',l:'Students'},{v:'89',l:'Answers'},{v:'4.8',l:'Rating'},{v:String(user?.xp||0),l:'XP Points'}];
      case 'freelancer': return [{v:'8',l:'Projects'},{v:'4.9',l:'Rating'},{v:'₹24K',l:'Earned'},{v:String(user?.xp||0),l:'XP Points'}];
      default: return [{v:'567',l:'Users'},{v:'1.2K',l:'Questions'},{v:'89',l:'Projects'},{v:'+12%',l:'Growth'}];
    }
  };

  const achievements = [
    {icon:Award,  title:'First Answer',   desc:'Answered first question', bg:'linear-gradient(135deg,#f59e0b,#f97316)'},
    {icon:Star,   title:'Top Contributor',desc:'Earned 1000+ XP',         bg:'linear-gradient(135deg,#8b5cf6,#a855f7)'},
    {icon:Users,  title:'Team Player',    desc:'Helped 10+ students',     bg:'linear-gradient(135deg,#10b981,#059669)'},
    {icon:Briefcase,title:'Freelancer',   desc:'Completed first project', bg:'linear-gradient(135deg,#3b82f6,#6366f1)'},
    {icon:BookOpen, title:'Scholar',      desc:'Asked 5+ questions',      bg:'linear-gradient(135deg,#f43f5e,#ec4899)'},
    {icon:CheckCircle,title:'Verified',   desc:'Profile 100% complete',   bg:'linear-gradient(135deg,#0ea5e9,#38bdf8)'},
  ];

  const stats = getStats();
  const xp = Number(user?.xp||0);

  return (
    <Page>
      <HeroBand>
        <HeroInner>
          <div style={{display:'inline-flex',alignItems:'center',gap:'.4rem',padding:'.2rem .75rem',borderRadius:'9999px',background:'rgba(99,102,241,.15)',border:'1px solid rgba(99,102,241,.25)',color:'#818cf8',fontSize:'.75rem',fontWeight:600,marginBottom:'.875rem'}}>
            <User size={12}/>Profile
          </div>
          <h1 style={{color:'#f8fafc',fontSize:'1.75rem',fontWeight:900,letterSpacing:'-.04em',margin:0}}>
            Your Profile
          </h1>
        </HeroInner>
      </HeroBand>

      <ProfileCard initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
        <ProfileCardInner>
          <HeaderRow>
            <AvatarWrap>
              <Avatar name={user?.name||''} size="2xl"/>
              <CameraBtn><Camera size={13}/></CameraBtn>
            </AvatarWrap>
            <NameBlock>
              <div style={{display:'flex',alignItems:'center',gap:'.625rem',flexWrap:'wrap'}}>
                <UserName>{user?.name||'User Name'}</UserName>
                <Badge variant="primary" size="sm">
                  <Shield size={10}/> {user?.role ? user.role.charAt(0).toUpperCase()+user.role.slice(1) : 'Member'}
                </Badge>
              </div>
              <UserBio>Passionate about learning and sharing knowledge. Always ready to help others grow and succeed.</UserBio>
              <StatsRow>
                {stats.map(s=>(
                  <StatItem key={s.l}><StatVal>{s.v}</StatVal><StatLbl>{s.l}</StatLbl></StatItem>
                ))}
              </StatsRow>
            </NameBlock>
            <EditBtn whileHover={{scale:1.02}} whileTap={{scale:.97}} onClick={()=>setEditing(!editing)}>
              <Edit3 size={15}/> {editing?'Cancel':'Edit Profile'}
            </EditBtn>
          </HeaderRow>

          {/* XP bar */}
          <div style={{padding:'1rem',background:'#f8fafc',borderRadius:'.875rem',border:'1px solid #e2e8f0'}}>
            <ProgressBar value={xp} max={500} color="primary" label={`Level ${user?.level||1} Progress`} showValue size="sm"/>
          </div>
        </ProfileCardInner>
      </ProfileCard>

      <Main>
        <Tabs>
          {(['personal','achievements','settings'] as const).map(t=>(
            <Tab key={t} $active={tab===t} onClick={()=>setTab(t)}>
              {t==='personal'?'Personal Info':t==='achievements'?'Achievements':'Settings'}
            </Tab>
          ))}
        </Tabs>

        {tab==='personal'&&(
          <Panel initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.3}}>
            <Grid2>
              <FGroup>
                <FLabel>Full Name</FLabel>
                <FInput name="name" value={form.name} onChange={onChange} disabled={!editing} $disabled={!editing}/>
              </FGroup>
              <FGroup>
                <FLabel>Email</FLabel>
                <FInput name="email" type="email" value={form.email} onChange={onChange} disabled={!editing} $disabled={!editing}/>
              </FGroup>
              <FGroup>
                <FLabel>Phone</FLabel>
                <FInput name="phone" type="tel" value={form.phone} onChange={onChange} disabled={!editing} $disabled={!editing} placeholder="+91 98765 43210"/>
              </FGroup>
              <FGroup>
                <FLabel>Location</FLabel>
                <FInput name="location" value={form.location} onChange={onChange} disabled={!editing} $disabled={!editing} placeholder="City, Country"/>
              </FGroup>
            </Grid2>
            <FGroup style={{marginTop:'1rem'}}>
              <FLabel>Bio</FLabel>
              <FTextarea name="bio" value={form.bio} onChange={onChange} disabled={!editing} $disabled={!editing} placeholder="Tell the community about yourself…"/>
            </FGroup>
            <FGroup style={{marginTop:'1rem'}}>
              <FLabel>Skills <span style={{color:'#94a3b8',fontWeight:400}}>(comma separated)</span></FLabel>
              <FInput name="skills" value={form.skills} onChange={onChange} disabled={!editing} $disabled={!editing} placeholder="JavaScript, React, Python…"/>
            </FGroup>
            {editing&&(
              <BtnRow>
                <SecBtn whileTap={{scale:.97}} onClick={()=>setEditing(false)}><X size={15}/>Cancel</SecBtn>
                <PrimaryBtn whileTap={{scale:.97}} onClick={()=>setEditing(false)}><Save size={15}/>Save Changes</PrimaryBtn>
              </BtnRow>
            )}
          </Panel>
        )}

        {tab==='achievements'&&(
          <Panel initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.3}}>
            <AchGrid>
              {achievements.map((a,i)=>(
                <AchCard key={a.title} initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:i*.07}}>
                  <AchIcon $bg={a.bg}><a.icon size={22}/></AchIcon>
                  <AchTitle>{a.title}</AchTitle>
                  <AchDesc>{a.desc}</AchDesc>
                </AchCard>
              ))}
            </AchGrid>
          </Panel>
        )}

        {tab==='settings'&&(
          <Panel initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.3}}>
            <div style={{marginBottom:'1.5rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'1rem'}}>
                <Bell size={16} color="#6366f1"/>
                <span style={{fontWeight:700,color:'#0f172a'}}>Notifications</span>
              </div>
              <ToggleRow>
                <ToggleLabel><ToggleName>Email notifications</ToggleName><ToggleSub>New answers to your questions</ToggleSub></ToggleLabel>
                <Toggle type="checkbox" defaultChecked/>
              </ToggleRow>
              <ToggleRow>
                <ToggleLabel><ToggleName>Mention alerts</ToggleName><ToggleSub>When someone tags you</ToggleSub></ToggleLabel>
                <Toggle type="checkbox" defaultChecked/>
              </ToggleRow>
              <ToggleRow>
                <ToggleLabel><ToggleName>Weekly digest</ToggleName><ToggleSub>Summary of platform activity</ToggleSub></ToggleLabel>
                <Toggle type="checkbox"/>
              </ToggleRow>
            </div>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'1rem'}}>
                <Lock size={16} color="#6366f1"/>
                <span style={{fontWeight:700,color:'#0f172a'}}>Privacy</span>
              </div>
              <ToggleRow>
                <ToggleLabel><ToggleName>Public profile</ToggleName><ToggleSub>Other users can view your profile</ToggleSub></ToggleLabel>
                <Toggle type="checkbox" defaultChecked/>
              </ToggleRow>
              <ToggleRow>
                <ToggleLabel><ToggleName>Direct messages</ToggleName><ToggleSub>Allow members to message you</ToggleSub></ToggleLabel>
                <Toggle type="checkbox" defaultChecked/>
              </ToggleRow>
              <ToggleRow>
                <ToggleLabel><ToggleName>Show online status</ToggleName><ToggleSub>Let others know when you're active</ToggleSub></ToggleLabel>
                <Toggle type="checkbox"/>
              </ToggleRow>
            </div>
            <BtnRow>
              <PrimaryBtn whileTap={{scale:.97}}><Settings size={15}/>Save Settings</PrimaryBtn>
            </BtnRow>
          </Panel>
        )}
      </Main>
    </Page>
  );
};

export default Profile;