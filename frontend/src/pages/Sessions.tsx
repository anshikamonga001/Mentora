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
const NoMeet = styled.div`font-size:.75rem;color:#94a3b8;margin-top:.375rem;font-style:italic;`;

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
  &:disabled{opacity:.65;cursor:not-allowed;}
`;
const BookBtn = styled(motion.button)`
  display:inline-flex;align-items:center;gap:.375rem;margin-top:.625rem;
  padding:.375rem .875rem;border-radius:.625rem;font-size:.8rem;font-weight:700;
  background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;cursor:pointer;
  box-shadow:0 4px 10px rgba(99,102,241,.3);font-family:inherit;
`;
const SectionHdr = styled.div`font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin-bottom:.75rem;margin-top:.25rem;`;
const EmptyMsg = styled.div`text-align:center;padding:2rem;color:#94a3b8;font-size:.875rem;line-height:1.6;`;
const ConnectedBadge = styled.div`
  display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;padding:.5rem .75rem;
  background:rgba(16,185,129,.08);border-radius:.625rem;border:1px solid rgba(16,185,129,.2);
  font-size:.75rem;color:#10b981;font-weight:700;
`;
const SlotRow = styled.div`
  display:grid;grid-template-columns:1fr 1fr auto;gap:.5rem;align-items:center;margin-bottom:.5rem;
`;
const SlotTag = styled.div`
  display:flex;align-items:center;justify-content:space-between;
  padding:.4rem .75rem;background:#f1f5f9;border-radius:.625rem;
  font-size:.78rem;color:#334155;font-weight:600;
  border:1px solid #e2e8f0;
`;
const RemoveBtn = styled.button`
  background:none;border:none;cursor:pointer;color:#ef4444;font-size:1rem;
  padding:0 .25rem;line-height:1;
  &:hover{color:#dc2626;}
`;
const AddSlotBtn = styled(motion.button)`
  width:100%;display:flex;align-items:center;justify-content:center;gap:.5rem;
  padding:.575rem;border-radius:.75rem;border:1.5px dashed #c7d2fe;cursor:pointer;
  font-family:inherit;font-weight:700;font-size:.8rem;margin-top:-.25rem;margin-bottom:.875rem;
  background:rgba(99,102,241,.04);color:#6366f1;
  &:hover{background:rgba(99,102,241,.08);border-color:#6366f1;}
`;
const ProgressBar = styled.div<{pct:number}>`
  height:4px;background:#e2e8f0;border-radius:9999px;margin-bottom:.75rem;overflow:hidden;
  &::after{content:'';display:block;height:100%;width:${p=>p.pct}%;background:linear-gradient(90deg,#6366f1,#8b5cf6);transition:width .3s;}
`;
const SuccessBanner = styled(motion.div)`
  background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);
  border-radius:.75rem;padding:.75rem 1rem;margin-bottom:1rem;
  font-size:.82rem;color:#065f46;font-weight:600;
`;

/* ── Component ── */
const Sessions: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [sessions,  setSessions]  = useState<any[]>([]);
  const [booked,    setBooked]    = useState<any[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [creating,  setCreating]  = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [successMsg,setSuccessMsg]= useState('');
  const [bookingSession, setBookingSession] = useState<any|null>(null);
  // Shared fields
  const [form, setForm] = useState({ duration:'60', topic:'', price:'0' });
  // Slot fields (date+time) — start with one empty slot
  const [slots, setSlots] = useState([{ date:'', time:'' }]);
  const BACKEND = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000';

  const safeJson = async (r: Response) => {
    const t = await r.text();
    try { return JSON.parse(t); } catch { throw new Error('Invalid response'); }
  };
  const token = () => localStorage.getItem('token') || '';

  /* tutor: own sessions */
  const fetchMySessions = async () => {
    const r = await fetch(`${BACKEND}/api/sessions/my`, { headers:{ Authorization:`Bearer ${token()}` } });
    const d = await safeJson(r);
    if (d.success) setSessions(d.sessions || []);
  };

  /* student: all sessions */
  const fetchAllSessions = async () => {
    const r = await fetch(`${BACKEND}/api/sessions`, { headers:{ Authorization:`Bearer ${token()}` } });
    const d = await safeJson(r);
    if (d.success) {
      const all: any[] = d.sessions || [];
      setSessions(all.filter(s => !s.isBooked));
      setBooked(all.filter(s => s.isBooked));
    }
  };

  useEffect(() => {
    setLoading(true);
    const load = user?.role === 'tutor' ? fetchMySessions : fetchAllSessions;
    load().finally(() => setLoading(false));

    if (window.location.search.includes('google=connected')) {
      (async () => {
        await refreshUser();
        await fetchMySessions();
        window.history.replaceState({}, document.title, '/sessions');
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const addSlot = () => setSlots(prev => [...prev, { date:'', time:'' }]);
  const removeSlot = (i:number) => setSlots(prev => prev.filter((_,idx)=>idx!==i));
  const updateSlot = (i:number, field:'date'|'time', val:string) =>
    setSlots(prev => prev.map((s,idx)=> idx===i ? {...s,[field]:val} : s));

  const createAllSessions = async () => {
    if (!form.topic) { alert('Please enter a topic'); return; }
    const validSlots = slots.filter(s => s.date && s.time);
    if (validSlots.length === 0) { alert('Please fill in at least one date and time slot'); return; }
    setCreating(true);
    setProgress(0);
    setSuccessMsg('');
    let created = 0;
    for (let i = 0; i < validSlots.length; i++) {
      const s = validSlots[i];
      try {
        const r = await fetch(`${BACKEND}/api/sessions`, {
          method:'POST',
          headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token()}` },
          body: JSON.stringify({ date:s.date, time:s.time, duration:Number(form.duration), topic:form.topic, price:Number(form.price) }),
        });
        const d = await safeJson(r);
        if (r.ok) created++;
        else console.warn(`Slot ${i+1} failed:`, d.message);
      } catch(e) { console.error(e); }
      setProgress(Math.round(((i+1)/validSlots.length)*100));
    }
    setCreating(false);
    setSuccessMsg(`✅ ${created} of ${validSlots.length} session${created!==1?'s':''} created!`);
    setSlots([{ date:'', time:'' }]);
    await fetchMySessions();
  };

  const bookSession = async (s: any) => {
    const r = await fetch(`${BACKEND}/api/sessions/${s._id}/book`, {
      method:'POST', headers:{ Authorization:`Bearer ${token()}` }
    });
    const d = await safeJson(r);
    if (d.success) {
      alert(`✅ Session booked!\nMeet Link: ${d.meetLink || 'Will be shared by tutor'}`);
      fetchAllSessions();
    } else {
      alert(d.message || 'Booking failed');
    }
  };

  const isTutor = user?.role === 'tutor';

  return (
    <Page>
      <TopBand>
        <TopInner>
          <Eyebrow><CalendarDays size={12}/>{isTutor ? 'My Sessions' : 'Sessions'}</Eyebrow>
          <PageTitle>{isTutor ? 'My Sessions' : 'Available Sessions'}</PageTitle>
          <PageSub>{isTutor ? 'Manage your sessions and create new ones with Google Meet.' : 'Browse and book 1-on-1 sessions with expert tutors.'}</PageSub>
        </TopInner>
      </TopBand>

      <Main>
        <TwoCol>
          {/* ── Left: session list ── */}
          <Panel>
            <PanelHead>
              <PanelTitle>{isTutor ? 'My Sessions' : 'Open Sessions'}</PanelTitle>
              <Badge variant="primary" size="sm">{sessions.length} {isTutor ? 'total' : 'available'}</Badge>
            </PanelHead>
            <PanelBody>
              {loading && <EmptyMsg>Loading sessions…</EmptyMsg>}
              {!loading && sessions.length === 0 && (
                <EmptyMsg>
                  {isTutor
                    ? 'No sessions yet. Create one using the form →'
                    : 'No open sessions right now. Check back soon or contact a tutor directly.'}
                </EmptyMsg>
              )}
              {sessions.map((s, i) => (
                <SessionItem key={s._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'.375rem'}}>
                    <SessionTopic>{s.topic || 'Session'}</SessionTopic>
                    <Badge variant={s.isBooked?'success':'neutral'} size="sm" dot>{s.isBooked?'Booked':'Open'}</Badge>
                  </div>
                  {!isTutor && s.mentor?.name && (
                    <div style={{fontSize:'.78rem',color:'#6366f1',fontWeight:600,marginBottom:'.375rem'}}>
                      👤 {s.mentor.name}
                    </div>
                  )}
                  <SessionMeta>
                    <SMeta><Calendar size={12}/>{new Date(s.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</SMeta>
                    <SMeta><Clock size={12}/>{s.duration} min</SMeta>
                    {s.price > 0 && <SMeta><span style={{fontWeight:700,color:'#0f172a'}}>₹{s.price}</span></SMeta>}
                  </SessionMeta>
                  {isTutor ? (
                    s.meetLink
                      ? <MeetBtn href={s.meetLink} target="_blank" rel="noreferrer"><Video size={13}/> Join Google Meet</MeetBtn>
                      : <NoMeet>Connect Google to generate Meet link</NoMeet>
                  ) : (
                    <BookBtn whileHover={{scale:1.03}} whileTap={{scale:.96}} onClick={() => bookSession(s)}>
                      <Video size={14}/> Book Session
                    </BookBtn>
                  )}
                </SessionItem>
              ))}
            </PanelBody>
          </Panel>

          {/* ── Right: tutor → create form | student → my bookings ── */}
          <Panel>
            {isTutor ? (
              <>
                <PanelHead>
                  <PanelTitle>Create Sessions</PanelTitle>
                  <Badge variant="primary" size="sm">{slots.length} slot{slots.length!==1?'s':''}</Badge>
                </PanelHead>
                <PanelBody>
                  {!user?.google?.accessToken ? (
                    <ConnectBtn whileHover={{scale:1.02}} whileTap={{scale:.97}} onClick={async () => {
                      const r = await fetch(`${BACKEND}/api/google/connect`, { headers:{ Authorization:`Bearer ${token()}` } });
                      const d = await safeJson(r);
                      if (d.url) window.location.href = d.url;
                    }}>
                      <LinkIcon size={16}/> Connect Google Account
                    </ConnectBtn>
                  ) : (
                    <ConnectedBadge>✅ Google Account Connected</ConnectedBadge>
                  )}

                  {successMsg && (
                    <SuccessBanner initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}>{successMsg}</SuccessBanner>
                  )}
                  {creating && <ProgressBar pct={progress}/>}

                  <SectionHdr>Shared Details</SectionHdr>
                  <FormLabel>Topic *</FormLabel>
                  <FormInput placeholder="e.g. React Fundamentals" value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})}/>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}>
                    <div>
                      <FormLabel>Duration (min)</FormLabel>
                      <FormInput type="number" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder="60"/>
                    </div>
                    <div>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormInput type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="0"/>
                    </div>
                  </div>

                  <SectionHdr style={{marginTop:'.5rem'}}>
                    Time Slots ({slots.length})
                  </SectionHdr>

                  {slots.map((slot, i) => (
                    <SlotRow key={i}>
                      <FormInput
                        type="date" value={slot.date}
                        onChange={e=>updateSlot(i,'date',e.target.value)}
                        style={{marginBottom:0}}
                      />
                      <FormInput
                        type="time" value={slot.time}
                        onChange={e=>updateSlot(i,'time',e.target.value)}
                        style={{marginBottom:0}}
                      />
                      {slots.length > 1 && (
                        <RemoveBtn onClick={()=>removeSlot(i)} title="Remove slot">✕</RemoveBtn>
                      )}
                    </SlotRow>
                  ))}

                  <AddSlotBtn
                    type="button"
                    whileHover={{scale:1.01}} whileTap={{scale:.98}}
                    onClick={addSlot}
                  >
                    <Plus size={14}/> Add Another Time Slot
                  </AddSlotBtn>

                  <CreateBtn
                    whileHover={{scale:1.02}} whileTap={{scale:.97}}
                    onClick={createAllSessions}
                    disabled={creating}
                  >
                    <Plus size={16}/>
                    {creating
                      ? `Creating… (${progress}%)`
                      : slots.length > 1
                        ? `Create ${slots.length} Sessions`
                        : 'Create Session'}
                  </CreateBtn>
                </PanelBody>
              </>

            ) : (
              <>
                <PanelHead>
                  <PanelTitle>My Bookings</PanelTitle>
                  <Badge variant="success" size="sm">{booked.length} booked</Badge>
                </PanelHead>
                <PanelBody>
                  {booked.length === 0 ? (
                    <EmptyMsg>
                      No bookings yet.<br/>Browse open sessions on the left and click <strong>Book Session</strong>!
                    </EmptyMsg>
                  ) : booked.map((s, i) => (
                    <SessionItem key={s._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}>
                      <SessionTopic>{s.topic}</SessionTopic>
                      {s.mentor?.name && <div style={{fontSize:'.78rem',color:'#6366f1',fontWeight:600,marginBottom:'.375rem'}}>👤 {s.mentor.name}</div>}
                      <SessionMeta>
                        <SMeta><Calendar size={12}/>{new Date(s.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</SMeta>
                        <SMeta><Clock size={12}/>{s.duration} min</SMeta>
                      </SessionMeta>
                      {s.meetLink
                        ? <MeetBtn href={s.meetLink} target="_blank" rel="noreferrer"><Video size={13}/> Join Google Meet</MeetBtn>
                        : <NoMeet>Meet link coming soon</NoMeet>}
                    </SessionItem>
                  ))}
                </PanelBody>
              </>
            )}
          </Panel>
        </TwoCol>
      </Main>

      <SessionBookingModal
        isOpen={!!bookingSession}
        mentorName={bookingSession?.mentor?.name || ''}
        mentorAvatar={bookingSession?.mentor?.avatar || ''}
        session={bookingSession || undefined}
        onClose={() => setBookingSession(null)}
      />
    </Page>
  );
};

export default Sessions;
