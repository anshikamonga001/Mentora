import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Video, Clock, Users, Star, Calendar, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SessionBookingModal from '../components/booking/SessionBookingModal';
import { Avatar } from '../components/ui/Avatar';
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
  display:inline-flex;align-items:center;gap:.4rem;
  padding:.2rem .75rem;border-radius:9999px;
  background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.25);
  color:#818cf8;font-size:.75rem;font-weight:600;margin-bottom:.875rem;
`;
const PageTitle = styled.h1`font-size:2rem;font-weight:900;letter-spacing:-.04em;color:#f8fafc;margin-bottom:.5rem;`;
const PageSub = styled.p`font-size:.9375rem;color:#64748b;margin:0;`;

const SearchRow = styled.div`margin-top:1.5rem;position:relative;max-width:420px;`;
const SearchIco = styled.div`position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#64748b;display:flex;`;
const SearchInput = styled.input`
  width:100%;padding:.625rem .875rem .625rem 2.5rem;
  border-radius:.75rem;border:1px solid rgba(255,255,255,.1);
  background:rgba(255,255,255,.07);color:#f8fafc;font-size:.9rem;font-family:inherit;
  &::placeholder{color:#475569;}
  &:focus{outline:none;border-color:rgba(99,102,241,.4);}
`;

const Main = styled.div`max-width:1100px;margin:0 auto;padding:2rem 1.5rem;`;

const Grid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem;
`;

const SessionCard = styled(motion.div)`
  background:#fff;border:1px solid #e2e8f0;border-radius:1.125rem;overflow:hidden;
  transition:all .25s;
  &:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(99,102,241,.12);border-color:rgba(99,102,241,.2);}
`;

const CardAccent = styled.div`
  height:4px;background:linear-gradient(90deg,#6366f1,#8b5cf6);
`;

const CardBody = styled.div`padding:1.375rem;`;

const MentorRow = styled.div`display:flex;align-items:center;gap:.875rem;margin-bottom:1rem;`;
const MentorInfo = styled.div`flex:1;`;
const MentorName = styled.div`font-size:.9375rem;font-weight:700;color:#0f172a;`;
const MentorSub = styled.div`font-size:.75rem;color:#94a3b8;margin-top:.1rem;`;

const SessionDetails = styled.div`display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.25rem;`;
const DetailRow = styled.div`display:flex;align-items:center;gap:.5rem;font-size:.8125rem;color:#475569;`;

const PriceRow = styled.div`
  display:flex;align-items:center;justify-content:space-between;
  padding:.75rem;background:#f8fafc;border-radius:.75rem;border:1px solid #e2e8f0;margin-bottom:1rem;
`;
const PriceLabel = styled.div`font-size:.75rem;color:#94a3b8;font-weight:500;`;
const PriceVal = styled.div`font-size:1.125rem;font-weight:800;color:#0f172a;`;

const BookBtn = styled(motion.button)<{$booked?:boolean}>`
  width:100%;display:flex;align-items:center;justify-content:center;gap:.5rem;
  padding:.6875rem;border-radius:.75rem;border:none;cursor:${p=>p.$booked?'default':'pointer'};
  font-family:inherit;font-weight:700;font-size:.875rem;transition:all .2s;
  background:${p=>p.$booked?'#f1f5f9':'linear-gradient(135deg,#6366f1,#8b5cf6)'};
  color:${p=>p.$booked?'#94a3b8':'#fff'};
  box-shadow:${p=>p.$booked?'none':'0 4px 12px rgba(99,102,241,.3)'};
`;

const MeetLink = styled.a`
  display:flex;align-items:center;justify-content:center;gap:.4rem;
  font-size:.8125rem;font-weight:600;color:#6366f1;text-decoration:none;
  padding:.5rem;border-radius:.625rem;background:rgba(99,102,241,.06);
  border:1px solid rgba(99,102,241,.15);margin-top:.5rem;
  &:hover{background:rgba(99,102,241,.1);}
`;

const EmptyState = styled.div`text-align:center;padding:4rem 2rem;grid-column:1/-1;`;

const Mentors: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [bookingModal, setBookingModal] = useState<{isOpen:boolean;mentorName:string;mentorAvatar:string;session?:any}>({isOpen:false,mentorName:'',mentorAvatar:''});
  const BACKEND = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000';

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/mentors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) {
        const all = data.mentors.flatMap((e: any) =>
          (e.sessions || []).map((s: any) => ({ ...s, mentor: e.mentor }))
        );
        setSessions(all);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchSessions(); }, []);

  const filtered = sessions.filter(s =>
    s.mentor?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.topic?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Page>
      <TopBand>
        <TopInner>
          <Eyebrow><Users size={12}/>Mentors</Eyebrow>
          <PageTitle>Find Your Mentor</PageTitle>
          <PageSub>Book a 1:1 session with expert mentors. Learn faster, grow smarter.</PageSub>
          <SearchRow>
            <SearchIco><Search size={16}/></SearchIco>
            <SearchInput placeholder="Search by mentor or topic…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </SearchRow>
        </TopInner>
      </TopBand>

      <Main>
        <Grid>
          {filtered.length === 0 && (
            <EmptyState>
              <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🎓</div>
              <h3 style={{color:'#0f172a',marginBottom:'.5rem'}}>No sessions available</h3>
              <p style={{color:'#64748b',fontSize:'.9rem'}}>Check back soon — mentors post new sessions regularly.</p>
            </EmptyState>
          )}

          {filtered.map((s, i) => (
            <SessionCard key={s._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:i*.07}}>
              <CardAccent/>
              <CardBody>
                <MentorRow>
                  <Avatar name={s.mentor?.name||'?'} size="md"/>
                  <MentorInfo>
                    <MentorName>{s.mentor?.name}</MentorName>
                    <MentorSub>Expert Mentor</MentorSub>
                  </MentorInfo>
                  {s.isBooked
                    ? <Badge variant="success" size="sm" dot>Booked</Badge>
                    : <Badge variant="primary" size="sm">Available</Badge>}
                </MentorRow>

                <SessionDetails>
                  {s.topic && (
                    <DetailRow>
                      <Star size={14} color="#f59e0b"/>
                      <span style={{fontWeight:600,color:'#1e293b'}}>{s.topic}</span>
                    </DetailRow>
                  )}
                  <DetailRow>
                    <Calendar size={14} color="#6366f1"/>
                    {new Date(s.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
                    {' · '}
                    {new Date(s.date).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                  </DetailRow>
                  <DetailRow>
                    <Clock size={14} color="#10b981"/>
                    {s.duration} minutes
                  </DetailRow>
                </SessionDetails>

                <PriceRow>
                  <div><PriceLabel>Session Fee</PriceLabel></div>
                  <PriceVal>₹{s.price}</PriceVal>
                </PriceRow>

                {/* Student booking */}
                {user?.role === 'student' && (
                  s.isBooked ? (
                    <BookBtn $booked disabled>✓ Already Booked</BookBtn>
                  ) : (
                    <BookBtn whileHover={{scale:1.02}} whileTap={{scale:.97}} onClick={()=>setBookingModal({isOpen:true,mentorName:s.mentor.name,mentorAvatar:s.mentor.name.charAt(0),session:s})}>
                      <Video size={16}/> Book Session
                    </BookBtn>
                  )
                )}

                {/* Tutor cancel */}
                {user?.role === 'tutor' && user._id === s.mentor._id && (
                  <BookBtn $booked onClick={async()=>{
                    await fetch(`${BACKEND}/api/sessions/${s._id}/cancel`,{method:'PATCH',headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}});
                    fetchSessions();
                  }}>Cancel</BookBtn>
                )}

                {/* Meet link */}
                {s.isBooked && s.meetLink && (
                  <MeetLink href={s.meetLink} target="_blank" rel="noreferrer">
                    <Video size={14}/> Join Google Meet
                  </MeetLink>
                )}
              </CardBody>
            </SessionCard>
          ))}
        </Grid>
      </Main>

      <SessionBookingModal
        isOpen={bookingModal.isOpen}
        mentorName={bookingModal.mentorName}
        mentorAvatar={bookingModal.mentorAvatar}
        session={bookingModal.session}
        onClose={()=>{setBookingModal({isOpen:false,mentorName:'',mentorAvatar:''});fetchSessions();}}
      />
    </Page>
  );
};

export default Mentors;
