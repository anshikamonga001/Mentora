import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MessageCircle, Clock, User, X, ChevronRight, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/ui/Avatar';

/* ── Types ── */
interface Doubt {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  askedBy: { name: string; role: string };
  answers?: { _id: string; content: string; answeredBy?: { name: string; role: string }; createdAt: string }[];
  createdAt: string;
}

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
const TopInner = styled.div`max-width:900px;margin:0 auto;position:relative;z-index:1;`;
const Eyebrow = styled.div`
  display:inline-flex;align-items:center;gap:.4rem;
  padding:.2rem .75rem;border-radius:9999px;
  background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.25);
  color:#818cf8;font-size:.75rem;font-weight:600;margin-bottom:.875rem;
`;
const PageTitle = styled.h1`
  font-size:2rem;font-weight:900;letter-spacing:-.04em;color:#f8fafc;margin-bottom:.5rem;
`;
const PageSub = styled.p`font-size:.9375rem;color:#64748b;margin:0;`;

const Controls = styled.div`
  display:flex;align-items:center;gap:1rem;margin-top:1.5rem;flex-wrap:wrap;
`;

const SearchWrap = styled.div`position:relative;flex:1;min-width:220px;`;
const SearchIco = styled.div`position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#64748b;display:flex;`;
const SearchInput = styled.input`
  width:100%;padding:.625rem .875rem .625rem 2.5rem;
  border-radius:.75rem;border:1px solid rgba(255,255,255,.1);
  background:rgba(255,255,255,.07);color:#f8fafc;font-size:.9rem;
  font-family:inherit;transition:all .2s;
  &::placeholder{color:#475569;}
  &:focus{outline:none;border-color:rgba(99,102,241,.4);background:rgba(99,102,241,.08);}
`;

const AskBtn = styled(motion.button)`
  display:flex;align-items:center;gap:.5rem;padding:.625rem 1.25rem;
  border-radius:.75rem;border:none;cursor:pointer;font-family:inherit;font-weight:700;
  font-size:.9rem;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;
  box-shadow:0 4px 14px rgba(99,102,241,.4);white-space:nowrap;
`;

const Main = styled.div`max-width:900px;margin:0 auto;padding:2rem 1.5rem;`;

const QuestionCard = styled(motion.div)`
  background:#fff;border:1px solid #e2e8f0;border-radius:1rem;
  margin-bottom:1rem;overflow:hidden;transition:all .25s;
  &:hover{box-shadow:0 12px 32px rgba(99,102,241,.1);border-color:rgba(99,102,241,.2);transform:translateY(-2px);}
`;
const QCardTop = styled.div`padding:1.375rem 1.5rem;cursor:pointer;`;
const QTitle = styled.h3`font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:.5rem;`;
const QContent = styled.p`font-size:.875rem;color:#64748b;line-height:1.6;margin-bottom:.875rem;`;
const QMeta = styled.div`display:flex;align-items:center;gap:1rem;flex-wrap:wrap;`;
const QMetaItem = styled.div`display:flex;align-items:center;gap:.375rem;font-size:.75rem;color:#94a3b8;`;
const TagChip = styled.span`
  padding:.15rem .625rem;border-radius:9999px;font-size:.7rem;font-weight:600;
  background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.15);color:#6366f1;
`;
const AnswerCount = styled.div<{$has:boolean}>`
  display:flex;align-items:center;gap:.375rem;font-size:.75rem;font-weight:600;
  color:${p=>p.$has?'#059669':'#94a3b8'};
`;

const AnswerSection = styled(motion.div)`
  background:#f8fafc;border-top:1px solid #e2e8f0;padding:1rem 1.5rem;
`;
const AnswerItem = styled.div`
  padding:.75rem 1rem;background:#fff;border-radius:.75rem;
  border:1px solid #e2e8f0;margin-bottom:.625rem;
  &:last-child{margin-bottom:0;}
`;
const AnswerAuthor = styled.div`display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;`;
const AnswerName = styled.span`font-size:.8125rem;font-weight:700;color:#0f172a;`;
const AnswerRole = styled.span`font-size:.7rem;color:#94a3b8;text-transform:capitalize;`;
const AnswerText = styled.p`font-size:.875rem;color:#334155;line-height:1.6;margin:0;`;
const NoAnswers = styled.div`font-size:.875rem;color:#94a3b8;font-style:italic;`;

/* ── Modal ── */
const Overlay = styled(motion.div)`
  position:fixed;inset:0;background:rgba(0,0,0,.55);
  display:flex;align-items:center;justify-content:center;z-index:2000;padding:1rem;
`;
const ModalBox = styled(motion.div)`
  width:100%;max-width:520px;background:#fff;border-radius:1.25rem;
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
  &:hover{background:#f1f5f9;color:#0f172a;}
`;
const ModalBody = styled.div`padding:1.5rem;`;
const MLabel = styled.label`display:block;font-size:.8125rem;font-weight:600;color:#374151;margin-bottom:.4rem;`;
const MInput = styled.input`
  width:100%;padding:.6875rem .875rem;border:1.5px solid #e2e8f0;border-radius:.75rem;
  font-size:.9rem;font-family:inherit;color:#0f172a;margin-bottom:1rem;transition:all .2s;
  &:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1);}
  &::placeholder{color:#cbd5e1;}
`;
const MTextarea = styled.textarea`
  width:100%;padding:.6875rem .875rem;border:1.5px solid #e2e8f0;border-radius:.75rem;
  font-size:.9rem;font-family:inherit;color:#0f172a;min-height:110px;resize:vertical;
  margin-bottom:1rem;transition:all .2s;
  &:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1);}
  &::placeholder{color:#cbd5e1;}
`;
const MSubmit = styled(motion.button)`
  width:100%;padding:.8125rem;border-radius:.75rem;border:none;cursor:pointer;
  font-family:inherit;font-weight:700;font-size:.9375rem;
  background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;
  box-shadow:0 4px 16px rgba(99,102,241,.35);
`;

const EmptyState = styled.div`
  text-align:center;padding:4rem 2rem;
`;
const EmptyIco = styled.div`
  width:72px;height:72px;border-radius:1rem;
  background:rgba(99,102,241,.08);display:flex;align-items:center;
  justify-content:center;margin:0 auto 1rem;
`;

const AskZone: React.FC = () => {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState<string|null>(null);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const BACKEND = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000';

  const safeJson = async (res: Response) => {
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { throw new Error('Server returned invalid response'); }
  };

  const fetchDoubts = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/doubts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await safeJson(res);
      if (data.success) setDoubts(data.doubts);
    } catch (err) { console.error('Failed to load doubts', err); }
  };

  useEffect(() => { fetchDoubts(); }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.content) return;
    try {
      const res = await fetch(`${BACKEND}/api/doubts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ title: form.title, content: form.content, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) }),
      });
      const data = await safeJson(res);
      if (!res.ok) { alert(data.message || 'Failed'); return; }
      setShowModal(false);
      setForm({ title: '', content: '', tags: '' });
      fetchDoubts();
    } catch (err: any) { alert(err.message || 'Failed'); }
  };

  const filtered = doubts.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Page>
      <TopBand>
        <TopInner>
          <Eyebrow><MessageCircle size={12}/>Ask Zone</Eyebrow>
          <PageTitle>Ask. Learn. Grow.</PageTitle>
          <PageSub>Post your doubts and get answers from peers & tutors.</PageSub>
          <Controls>
            <SearchWrap>
              <SearchIco><Search size={16}/></SearchIco>
              <SearchInput placeholder="Search questions…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </SearchWrap>
            {user?.role === 'student' && (
              <AskBtn onClick={()=>setShowModal(true)} whileHover={{scale:1.03}} whileTap={{scale:.97}}>
                <Plus size={17}/> Ask Question
              </AskBtn>
            )}
          </Controls>
        </TopInner>
      </TopBand>

      <Main>
        {filtered.length === 0 ? (
          <EmptyState>
            <EmptyIco><BookOpen size={30} color="#6366f1"/></EmptyIco>
            <h3 style={{color:'#0f172a',marginBottom:'.5rem'}}>No questions yet</h3>
            <p style={{color:'#64748b',fontSize:'.9rem'}}>Be the first to ask a question in the community!</p>
          </EmptyState>
        ) : (
          filtered.map((q, i) => (
            <QuestionCard key={q._id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:i*.05}}>
              <QCardTop onClick={()=>setExpanded(expanded===q._id?null:q._id)}>
                <QTitle>{q.title}</QTitle>
                <QContent>{q.content}</QContent>
                <QMeta>
                  <div style={{display:'flex',gap:'.375rem',flexWrap:'wrap',flex:1}}>
                    {q.tags.map(t=><TagChip key={t}>{t}</TagChip>)}
                  </div>
                  <QMetaItem><User size={12}/>{q.askedBy.name}</QMetaItem>
                  <QMetaItem><Clock size={12}/>{new Date(q.createdAt).toLocaleDateString()}</QMetaItem>
                  <AnswerCount $has={!!(q.answers?.length)}>
                    <MessageCircle size={13}/>
                    {q.answers?.length || 0} {q.answers?.length === 1 ? 'answer' : 'answers'}
                  </AnswerCount>
                  <ChevronRight size={16} color="#94a3b8" style={{transform:expanded===q._id?'rotate(90deg)':'none',transition:'transform .2s'}}/>
                </QMeta>
              </QCardTop>

              <AnimatePresence>
                {expanded === q._id && (
                  <AnswerSection initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.25}}>
                    <div style={{fontSize:'.8125rem',fontWeight:700,color:'#6366f1',marginBottom:'.75rem'}}>
                      {q.answers?.length ? `${q.answers.length} Answer${q.answers.length>1?'s':''}` : 'No answers yet'}
                    </div>
                    {!q.answers?.length && <NoAnswers>No answers yet. Be the first to help!</NoAnswers>}
                    {q.answers?.map(a=>(
                      <AnswerItem key={a._id}>
                        <AnswerAuthor>
                          <Avatar name={a.answeredBy?.name||'?'} size="xs"/>
                          <div>
                            <AnswerName>{a.answeredBy?.name||'Anonymous'}</AnswerName>
                            <AnswerRole> · {a.answeredBy?.role}</AnswerRole>
                          </div>
                          <span style={{marginLeft:'auto',fontSize:'.7rem',color:'#94a3b8'}}>{new Date(a.createdAt).toLocaleDateString()}</span>
                        </AnswerAuthor>
                        <AnswerText>{a.content}</AnswerText>
                      </AnswerItem>
                    ))}
                  </AnswerSection>
                )}
              </AnimatePresence>
            </QuestionCard>
          ))
        )}
      </Main>

      {/* Ask Modal */}
      <AnimatePresence>
        {showModal && (
          <Overlay initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowModal(false)}>
            <ModalBox initial={{scale:.94,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.94,opacity:0}} transition={{duration:.22}} onClick={e=>e.stopPropagation()}>
              <ModalHead>
                <ModalTitle>Ask a Question</ModalTitle>
                <CloseBtn onClick={()=>setShowModal(false)}><X size={16}/></CloseBtn>
              </ModalHead>
              <ModalBody>
                <MLabel>Title *</MLabel>
                <MInput placeholder="e.g. How does async/await work in JS?" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
                <MLabel>Describe your doubt *</MLabel>
                <MTextarea placeholder="Explain your problem in detail…" value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/>
                <MLabel>Tags <span style={{color:'#94a3b8',fontWeight:400}}>(comma separated)</span></MLabel>
                <MInput placeholder="JavaScript, React, Node.js" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/>
                <MSubmit onClick={handleSubmit} whileHover={{scale:1.02}} whileTap={{scale:.97}}>Post Question</MSubmit>
              </ModalBody>
            </ModalBox>
          </Overlay>
        )}
      </AnimatePresence>
    </Page>
  );
};

export default AskZone;
