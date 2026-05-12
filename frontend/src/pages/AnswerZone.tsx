import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Clock, User, Send, X, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';

/* ── Types ── */
interface Answer { _id: string; content: string; answeredBy: { name: string; role: string }; createdAt: string; }
interface Doubt { _id: string; title: string; content: string; tags: string[]; askedBy: { name: string; role: string }; answers?: Answer[]; createdAt: string; }

/* ── Styles ── */
const Page = styled.div`min-height:100vh;background:#f8fafc;padding-top:68px;`;

const TopBand = styled.div`
  background:linear-gradient(135deg,#064e3b 0%,#0f172a 100%);
  padding:2.5rem 1.5rem;position:relative;overflow:hidden;
  &::before{content:'';position:absolute;inset:0;
    background-image:linear-gradient(rgba(16,185,129,.05) 1px,transparent 1px),
      linear-gradient(90deg,rgba(16,185,129,.05) 1px,transparent 1px);
    background-size:40px 40px;pointer-events:none;}
`;
const TopInner = styled.div`max-width:900px;margin:0 auto;position:relative;z-index:1;`;
const Eyebrow = styled.div`
  display:inline-flex;align-items:center;gap:.4rem;padding:.2rem .75rem;border-radius:9999px;
  background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.25);
  color:#6ee7b7;font-size:.75rem;font-weight:600;margin-bottom:.875rem;
`;
const PageTitle = styled.h1`font-size:2rem;font-weight:900;letter-spacing:-.04em;color:#f8fafc;margin-bottom:.5rem;`;
const PageSub = styled.p`font-size:.9375rem;color:#64748b;margin:0;`;

const Main = styled.div`max-width:900px;margin:0 auto;padding:2rem 1.5rem;`;

const QCard = styled(motion.div)`
  background:#fff;border:1px solid #e2e8f0;border-radius:1rem;margin-bottom:1rem;overflow:hidden;
  transition:all .2s;&:hover{border-color:rgba(16,185,129,.25);box-shadow:0 10px 28px rgba(16,185,129,.07);}
`;
const QBody = styled.div`padding:1.375rem 1.5rem;`;
const QTitle = styled.h3`font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:.5rem;`;
const QText = styled.p`font-size:.875rem;color:#64748b;line-height:1.6;margin-bottom:.875rem;`;
const QMeta = styled.div`display:flex;align-items:center;gap:.875rem;flex-wrap:wrap;`;
const MetaItem = styled.div`display:flex;align-items:center;gap:.375rem;font-size:.75rem;color:#94a3b8;`;
const TagChip = styled.span`
  padding:.15rem .625rem;border-radius:9999px;font-size:.7rem;font-weight:600;
  background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.15);color:#059669;
`;
const AnswerBtn = styled(motion.button)`
  display:flex;align-items:center;gap:.5rem;padding:.5rem 1.125rem;
  border-radius:.75rem;border:none;cursor:pointer;font-family:inherit;font-weight:700;font-size:.8125rem;
  background:linear-gradient(135deg,#10b981,#059669);color:#fff;
  box-shadow:0 3px 10px rgba(16,185,129,.35);margin-top:1rem;
`;
const AnswersSection = styled.div`
  background:#f8fafc;border-top:1px solid #e2e8f0;padding:1.125rem 1.5rem;
`;
const AnsItem = styled.div`
  padding:.75rem 1rem;background:#fff;border-radius:.75rem;
  border:1px solid #e2e8f0;margin-bottom:.625rem;&:last-child{margin-bottom:0;}
`;
const AnsAuthor = styled.div`display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;`;
const AnsName = styled.span`font-size:.8125rem;font-weight:700;color:#0f172a;`;
const AnsRole = styled.span`font-size:.7rem;color:#94a3b8;text-transform:capitalize;`;
const AnsText = styled.p`font-size:.875rem;color:#334155;line-height:1.6;margin:0;`;

/* ── Modal ── */
const Overlay = styled(motion.div)`
  position:fixed;inset:0;background:rgba(0,0,0,.55);
  display:flex;align-items:center;justify-content:center;z-index:2000;padding:1rem;
`;
const ModalBox = styled(motion.div)`
  width:100%;max-width:540px;background:#fff;border-radius:1.25rem;
  box-shadow:0 24px 64px rgba(0,0,0,.2);overflow:hidden;
`;
const ModalHead = styled.div`
  padding:1.375rem 1.5rem;border-bottom:1px solid #e2e8f0;
  display:flex;align-items:center;justify-content:space-between;
`;
const ModalTitle = styled.h2`font-size:1.125rem;font-weight:800;color:#0f172a;`;
const CloseBtn = styled.button`
  width:32px;height:32px;border-radius:.5rem;border:1px solid #e2e8f0;background:#f8fafc;
  color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;
  &:hover{background:#f1f5f9;}
`;
const ModalBody = styled.div`padding:1.5rem;`;
const QContext = styled.div`
  padding:.875rem;background:#f8fafc;border-radius:.75rem;border:1px solid #e2e8f0;
  margin-bottom:1.25rem;
`;
const QContextTitle = styled.div`font-size:.9rem;font-weight:700;color:#0f172a;margin-bottom:.25rem;`;
const QContextText = styled.div`font-size:.8125rem;color:#64748b;line-height:1.5;`;
const MTextarea = styled.textarea`
  width:100%;padding:.75rem .875rem;border:1.5px solid #e2e8f0;border-radius:.75rem;
  font-size:.9rem;font-family:inherit;color:#0f172a;min-height:130px;resize:vertical;
  margin-bottom:1rem;
  &:focus{outline:none;border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.1);}
  &::placeholder{color:#cbd5e1;}
`;
const SubmitBtn = styled(motion.button)`
  width:100%;display:flex;align-items:center;justify-content:center;gap:.5rem;
  padding:.8125rem;border-radius:.75rem;border:none;cursor:pointer;font-family:inherit;
  font-weight:700;font-size:.9375rem;
  background:linear-gradient(135deg,#10b981,#059669);color:#fff;
  box-shadow:0 4px 16px rgba(16,185,129,.35);
`;

/* ── Unauthorized ── */
const Unauthorized = styled.div`
  min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:2rem;
`;

const BACKEND = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000';

const AnswerZone: React.FC = () => {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [active, setActive] = useState<Doubt|null>(null);
  const [answer, setAnswer] = useState('');

  const fetchDoubts = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/doubts`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      if (data.success) setDoubts(data.doubts);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchDoubts(); }, []);

  const submit = async () => {
    if (!active || !answer.trim()) return;
    try {
      const res = await fetch(`${BACKEND}/api/doubts/${active._id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ content: answer.trim() }),
      });
      const data = await res.json();
      if (data.success) { setActive(null); setAnswer(''); fetchDoubts(); }
      else alert(data.message || 'Failed');
    } catch { alert('Failed to post answer'); }
  };

  if (user?.role !== 'tutor') {
    return (
      <Page>
        <TopBand><TopInner><PageTitle>Answer Zone</PageTitle></TopInner></TopBand>
        <Unauthorized>
          <div style={{width:72,height:72,borderRadius:'1rem',background:'rgba(239,68,68,.1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.25rem'}}>
            <Lock size={30} color="#ef4444"/>
          </div>
          <h2 style={{color:'#0f172a',marginBottom:'.5rem'}}>Tutors Only</h2>
          <p style={{color:'#64748b',maxWidth:360}}>The Answer Zone is reserved for tutors. Help students by answering their questions once you have a tutor account.</p>
        </Unauthorized>
      </Page>
    );
  }

  return (
    <Page>
      <TopBand>
        <TopInner>
          <Eyebrow><CheckCircle size={12}/>Answer Zone</Eyebrow>
          <PageTitle>Help Students Learn</PageTitle>
          <PageSub>Review questions from students and share your expertise.</PageSub>
        </TopInner>
      </TopBand>

      <Main>
        {doubts.length === 0 && (
          <div style={{textAlign:'center',padding:'4rem 2rem'}}>
            <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>📭</div>
            <h3 style={{color:'#0f172a',marginBottom:'.5rem'}}>No questions yet</h3>
            <p style={{color:'#64748b'}}>Students haven't posted any questions yet. Check back soon!</p>
          </div>
        )}

        {doubts.map((q, i) => (
          <QCard key={q._id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}>
            <QBody>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',marginBottom:'.5rem'}}>
                <QTitle>{q.title}</QTitle>
                <Badge variant={q.answers?.length?'success':'warning'} size="sm">
                  {q.answers?.length ? `${q.answers.length} answered` : 'Unanswered'}
                </Badge>
              </div>
              <QText>{q.content}</QText>
              <QMeta>
                <div style={{display:'flex',gap:'.375rem',flexWrap:'wrap',flex:1}}>
                  {q.tags?.map(t=><TagChip key={t}>{t}</TagChip>)}
                </div>
                <MetaItem><User size={12}/>{q.askedBy?.name}</MetaItem>
                <MetaItem><Clock size={12}/>{new Date(q.createdAt).toLocaleDateString()}</MetaItem>
              </QMeta>
              <AnswerBtn whileHover={{scale:1.02}} whileTap={{scale:.97}} onClick={()=>{setActive(q);setAnswer('');}}>
                <Send size={14}/> Write Answer
              </AnswerBtn>
            </QBody>

            {q.answers && q.answers.length > 0 && (
              <AnswersSection>
                <div style={{fontSize:'.8125rem',fontWeight:700,color:'#059669',marginBottom:'.75rem'}}>
                  {q.answers.length} Answer{q.answers.length>1?'s':''}
                </div>
                {q.answers.map(a=>(
                  <AnsItem key={a._id}>
                    <AnsAuthor>
                      <Avatar name={a.answeredBy?.name||'?'} size="xs"/>
                      <div>
                        <AnsName>{a.answeredBy?.name}</AnsName>
                        <AnsRole> · {a.answeredBy?.role}</AnsRole>
                      </div>
                      <span style={{marginLeft:'auto',fontSize:'.7rem',color:'#94a3b8'}}>{new Date(a.createdAt).toLocaleDateString()}</span>
                    </AnsAuthor>
                    <AnsText>{a.content}</AnsText>
                  </AnsItem>
                ))}
              </AnswersSection>
            )}
          </QCard>
        ))}
      </Main>

      <AnimatePresence>
        {active && (
          <Overlay initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setActive(null)}>
            <ModalBox initial={{scale:.94,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.94,opacity:0}} transition={{duration:.22}} onClick={e=>e.stopPropagation()}>
              <ModalHead>
                <ModalTitle>Write Your Answer</ModalTitle>
                <CloseBtn onClick={()=>setActive(null)}><X size={16}/></CloseBtn>
              </ModalHead>
              <ModalBody>
                <QContext>
                  <QContextTitle>{active.title}</QContextTitle>
                  <QContextText>{active.content}</QContextText>
                </QContext>
                <MTextarea placeholder="Write a clear and helpful answer…" value={answer} onChange={e=>setAnswer(e.target.value)}/>
                <SubmitBtn whileHover={{scale:1.02}} whileTap={{scale:.97}} onClick={submit}>
                  <Send size={15}/> Submit Answer
                </SubmitBtn>
              </ModalBody>
            </ModalBox>
          </Overlay>
        )}
      </AnimatePresence>
    </Page>
  );
};

export default AnswerZone;
