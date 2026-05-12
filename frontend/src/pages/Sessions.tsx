import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Clock, Calendar, Video, Plus, Link as LinkIcon, CalendarDays } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SessionBookingModal from '../components/booking/SessionBookingModal';
import { Badge } from '../components/ui/Badge';

/* ── Styles ── */
const Page = styled.div`min-height:100vh;background:#f8fafc;padding-top:68px;`;

const TopBand = styled.div`
  background:linear-gradient(135deg,#1e1b4b 0%,#0f172a 100%);
  padding:2.5rem 1.5rem;position:relative;overflow:hidden;
  &::before{content:'';position:absolute;inset:0;
    background-image:linear-gradient(rgba(99,102,241,.05) 1px,transparent 1px),
      linear-gradient(90deg,rgba(99,102,241,.05) 1px,transparent 1px);
    background-size:40px 40px;pointer-events:none;}
`;
const TopInner = styled.div`max-width:1100px;margin:0 auto;position:relative;z-index:1;`;
const Eyebrow = styled.div`
  display:inline-flex;align-items:center;gap:.4rem;padding:.2rem .75rem;border-radius:9999px;
  background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.25);
  color:#818cf8;font-size:.75rem;font-weight:600;margin-bottom:.875rem;
`;
const PageTitle = styled.h1`font-size:2rem;font-weight:900;letter-spacing:-.04em;color:#f8fafc;margin-bottom:.5rem;`;
const PageSub = styled.p`font-size:.9375rem;color:#64748b;margin:0;`;

const Main = styled.div`max-width:1100px;margin:0 auto;padding:2rem 1.5rem;`;
const TwoCol = styled.div`
  display:grid;grid-template-columns:1fr 380px;gap:1.5rem;
  @media(max-width:900px){grid-template-columns:1fr;}
`;

const Panel = styled.div`background:#fff;border:1px solid #e2e8f0;border-radius:1rem;overflow:hidden;`;
const PanelHead = styled.div`
  padding:1.25rem 1.5rem;border-bottom:1px solid #e2e8f0;
  display:flex;align-items:center;justify-content:space-between;
`;
const PanelTitle = styled.h2`font-size:1rem;font-weight:700;color:#0f172a;`;
const PanelBody = styled.div`padding:1.25rem;`;

const SessionItem = styled(motion.div)`
  padding:1rem;border:1px solid #e2e8f0;border-radius:.875rem;margin-bottom:.75rem;
  &:last-child{margin-bottom:0;}transition:all .2s;
  &:hover{border-color:rgba(99,102,241,.2);background:#fafafa;}
`;
const SessionTopic = styled.div`font-size:.9375rem;font-weight:700;color:#0f172a;margin-bottom:.375rem;`;
const SessionMeta = styled.div`display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;`;
const SMeta = styled.div`display:flex;align-items:center;gap:.375rem;font-size:.75rem;color:#64748b;`;
const MeetBtn = styled.a`
  display:inline-flex;align-items:center;gap:.375rem;margin-top:.625rem;
  padding:.375rem .75rem;border-radius:.625rem;font-size:.75rem;font-weight:600;
  background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.15);color:#6366f1;
  text-decoration:none;&:hover{background:rgba(99,102,241,.14);}
`;
const NoMeet = styled.div`
  font-size:.75rem;color:#94a3b8;margin-top:.375rem;font-style:italic;
`;

/* ── Create form ── */
const FormLabel = styled.label`display:block;font-size:.8125rem;font-weight:600;color:#374151;margin-bottom:.375rem;`;
const FormInput = styled.input`
  width:100%;padding:.625rem .875rem;border:1.5px solid #e2e8f0;border-radius:.75rem;
  font-size:.875rem;font-family:inherit;color:#0f172a;margin-bottom:.875rem;
  &:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1);}
  &::placeholder{color:#cbd5e1;}
`;
const ConnectBtn = styled(motion.button)`
  width:100%;display:flex;align-items:center;justify-content:center;gap:.5rem;
  padding:.6875rem;border-radius:.75rem;border:none;cursor:pointer;font-family:inherit;
  font-weight:700;font-size:.875rem;margin-bottom:1rem;
  background:linear-gradient(135deg,#ea4335,#d93025);color:#fff;
  box-shadow:0 4px 12px rgba(234,67,53,.3);
`;
const CreateBtn = styled(motion.button)`
  width:100%;display:flex;align-items:center;justify-content:center;gap:.5rem;
  padding:.6875rem;border-radius:.75rem;border:none;cursor:pointer;font-family:inherit;
  font-weight:700;font-size:.875rem;margin-top:.5rem;
  background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;
  box-shadow:0 4px 12px rgba(99,102,241,.35);
`;
const SectionHdr = styled.div`font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin-bottom:.75rem;margin-top:.25rem;`;
const EmptyMsg = styled.div`text-align:center;padding:2rem;color:#94a3b8;font-size:.875rem;`;

const Sessions: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [mySessions, setMySessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingSession, setBookingSession] = useState<any|null>(null);
  const [form, setForm] = useState({ date:'', time:'', duration:'60', topic:'', price:'0' });
  const BACKEND = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000';

  const safeJson = async (res:Response) => {
    const t = await res.text();
    try { return JSON.parse(t); } catch { throw new Error('Invalid response'); }
  };

  const fetchMySessions = async () => {
    const res = await fetch(`${BACKEND}/api/sessions/my`, {
      headers: { Authorization:`Bearer ${localStorage.getItem('token')}` }
    });
    const data = await safeJson(res);
    if (data.success) setMySessions(data.sessions || []);
  };

  useEffect(() => {
    setLoading(true);
    fetchMySessions().finally(() => setLoading(false));
    if (window.location.search.includes('google=connected')) {
      (async () => {
        await refreshUser();
        await fetchMySessions();
        window.history.replaceState({}, document.title, '/sessions');
      })();
    }
  }, []);

  const createSession = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ date:form.date, time:form.time, duration:Number(form.duration), topic:form.topic, price:Number(form.price) }),
      });
      const data = await safeJson(res);
      if (!res.ok) { alert(data.message||'Failed'); return; }
      setForm({ date:'', time:'', duration:'60', topic:'', price:'0' });
      await fetchMySessions();
      alert('Session created!');
    } catch(err) { alert('Failed to create session'); }
  };

  return (
    <Page>
      <TopBand>
        <TopInner>
          <Eyebrow><CalendarDays size={12}/>Sessions</Eyebrow>
          <PageTitle>My Sessions</PageTitle>
          <PageSub>Manage your upcoming sessions and create new ones.</PageSub>
        </TopInner>
      </TopBand>

      <Main>
        <TwoCol>
          {/* Left: Session list */}
          <Panel>
            <PanelHead>
              <PanelTitle>Upcoming Sessions</PanelTitle>
              <Badge variant="primary" size="sm">{mySessions.length} total</Badge>
            </PanelHead>
            <PanelBody>
              {loading && <EmptyMsg>Loading sessions…</EmptyMsg>}
              {!loading && mySessions.length === 0 && (
                <EmptyMsg>No sessions yet. {user?.role==='tutor'?'Create one →':'Book a session from the Mentors page.'}</EmptyMsg>
              )}
              {mySessions.map((s, i) => (
                <SessionItem key={s._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'.375rem'}}>
                    <SessionTopic>{s.topic || 'Session'}</SessionTopic>
                    <Badge variant={s.isBooked?'success':'neutral'} size="sm" dot>{s.isBooked?'Booked':'Open'}</Badge>
                  </div>
                  <SessionMeta>
                    <SMeta><Calendar size={12}/>{new Date(s.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</SMeta>
                    <SMeta><Clock size={12}/>{s.duration} min</SMeta>
                    {s.price>0&&<SMeta><span style={{fontWeight:700,color:'#0f172a'}}>₹{s.price}</span></SMeta>}
                  </SessionMeta>
                  {s.meetLink
                    ? <MeetBtn href={s.meetLink} target="_blank" rel="noreferrer"><Video size={13}/> Join Google Meet</MeetBtn>
                    : <NoMeet>Meet link will appear when session is confirmed</NoMeet>
                  }
                </SessionItem>
              ))}
            </PanelBody>
          </Panel>

          {/* Right: Create (tutors only) */}
          {user?.role === 'tutor' && (
            <Panel>
              <PanelHead>
                <PanelTitle>Create Session</PanelTitle>
                <Plus size={18} color="#6366f1"/>
              </PanelHead>
              <PanelBody>
                {!user?.google?.accessToken && (
                  <ConnectBtn whileHover={{scale:1.02}} whileTap={{scale:.97}} onClick={async()=>{
                    const res = await fetch(`${BACKEND}/api/google/connect`,{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}});
                    const data = await safeJson(res);
                    if(data.url) window.location.href=data.url;
                  }}>
                    <LinkIcon size={16}/> Connect Google Account
                  </ConnectBtn>
                )}

                <SectionHdr>Session Details</SectionHdr>

                <FormLabel>Topic *</FormLabel>
                <FormInput placeholder="e.g. React Fundamentals" value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})}/>

                <FormLabel>Date *</FormLabel>
                <FormInput type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>

                <FormLabel>Time *</FormLabel>
                <FormInput type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/>

                <FormLabel>Duration (minutes)</FormLabel>
                <FormInput type="number" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder="60"/>

                <FormLabel>Price (₹)</FormLabel>
                <FormInput type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="0"/>

                <CreateBtn whileHover={{scale:1.02}} whileTap={{scale:.97}} onClick={createSession}>
                  <Plus size={16}/> Create Session
                </CreateBtn>
              </PanelBody>
            </Panel>
          )}
        </TwoCol>
      </Main>

      <SessionBookingModal
        isOpen={!!bookingSession}
        mentorName={bookingSession?.mentor?.name||''}
        mentorAvatar={bookingSession?.mentor?.avatar||''}
        session={bookingSession||undefined}
        onClose={()=>setBookingSession(null)}
      />
    </Page>
  );
};

export default Sessions;
