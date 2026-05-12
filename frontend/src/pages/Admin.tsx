import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Users, BarChart3, Shield, Settings, TrendingUp,
  Eye, Edit, Trash2,
  Search, Filter, Download, RefreshCw, Calendar,
  DollarSign, MessageSquare, Activity, Plus,
  ChevronDown, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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
const TopInner = styled.div`max-width:1300px;margin:0 auto;position:relative;z-index:1;`;
const Eyebrow = styled.div`
  display:inline-flex;align-items:center;gap:.4rem;padding:.2rem .75rem;border-radius:9999px;
  background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.25);
  color:#818cf8;font-size:.75rem;font-weight:600;margin-bottom:.875rem;
`;
const PageTitle = styled.h1`font-size:2rem;font-weight:900;letter-spacing:-.04em;color:#f8fafc;margin-bottom:.375rem;`;
const PageSub = styled.p`font-size:.9375rem;color:#64748b;margin:0;`;

const Main = styled.div`max-width:1300px;margin:0 auto;padding:2rem 1.5rem;`;

const Tabs = styled.div`
  display:flex;gap:.25rem;background:#f1f5f9;padding:.3rem;border-radius:.875rem;margin-bottom:1.75rem;overflow-x:auto;
  &::-webkit-scrollbar{display:none;}
`;
const Tab = styled.button<{$active:boolean}>`
  display:flex;align-items:center;gap:.4rem;
  padding:.5rem 1rem;border-radius:.625rem;border:none;cursor:pointer;white-space:nowrap;
  font-family:inherit;font-weight:600;font-size:.875rem;transition:all .2s;
  background:${p=>p.$active?'#fff':'transparent'};
  color:${p=>p.$active?'#4f46e5':'#64748b'};
  box-shadow:${p=>p.$active?'0 1px 4px rgba(0,0,0,.08)':'none'};
`;

const StatsGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1.125rem;margin-bottom:1.75rem;
`;
const StatCard = styled(motion.div)<{$accent:string}>`
  background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.375rem;
  position:relative;overflow:hidden;
  &::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:${p=>p.$accent};}
  &:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(0,0,0,.06);}
  transition:all .2s;
`;
const StatHead = styled.div`display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;`;
const StatIco = styled.div<{$bg:string}>`
  width:44px;height:44px;border-radius:.75rem;background:${p=>p.$bg};
  display:flex;align-items:center;justify-content:center;color:#fff;
`;
const StatTrend = styled.div<{$up:boolean}>`
  font-size:.75rem;font-weight:700;
  color:${p=>p.$up?'#059669':'#dc2626'};
  background:${p=>p.$up?'rgba(16,185,129,.08)':'rgba(220,38,38,.08)'};
  padding:.2rem .5rem;border-radius:9999px;
`;
const StatVal = styled.div`font-size:1.75rem;font-weight:900;color:#0f172a;letter-spacing:-.04em;margin-bottom:.2rem;`;
const StatLbl = styled.div`font-size:.8125rem;color:#64748b;font-weight:500;`;

const Panel = styled.div`background:#fff;border:1px solid #e2e8f0;border-radius:1rem;overflow:hidden;`;
const PHead = styled.div`
  padding:1.25rem 1.5rem;border-bottom:1px solid #e2e8f0;
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;
`;
const PTitle = styled.h2`font-size:1rem;font-weight:700;color:#0f172a;`;
const PActions = styled.div`display:flex;align-items:center;gap:.625rem;flex-wrap:wrap;`;

const SearchWrap = styled.div`position:relative;`;
const SearchIco = styled.div`position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#94a3b8;display:flex;`;
const SearchInput = styled.input`
  padding:.5rem .75rem .5rem 2.25rem;border:1.5px solid #e2e8f0;border-radius:.75rem;
  font-size:.8125rem;font-family:inherit;color:#0f172a;width:220px;
  &:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1);}
  &::placeholder{color:#cbd5e1;}
`;
const ABtn = styled.button`
  display:flex;align-items:center;gap:.375rem;padding:.5rem .875rem;
  border:1.5px solid #e2e8f0;border-radius:.75rem;background:#fff;color:#475569;
  font-size:.8125rem;font-weight:600;cursor:pointer;font-family:inherit;
  &:hover{border-color:#6366f1;color:#6366f1;}transition:all .2s;
`;
const PrimaryABtn = styled(ABtn)`
  background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;
  box-shadow:0 3px 10px rgba(99,102,241,.3);&:hover{color:#fff;opacity:.92;}
`;

/* Table */
const Table = styled.table`width:100%;border-collapse:collapse;`;
const THead = styled.thead`background:#f8fafc;`;
const TR = styled.tr`border-bottom:1px solid #f1f5f9;&:last-child{border:none;}&:hover{background:#fafafa;}`;
const TH = styled.th`padding:.875rem 1.25rem;text-align:left;font-size:.75rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;`;
const TD = styled.td`padding:.875rem 1.25rem;font-size:.875rem;color:#475569;`;
const UserCell = styled.div`display:flex;align-items:center;gap:.75rem;`;
const UserTexts = styled.div``;
const UserName = styled.div`font-size:.9rem;font-weight:700;color:#0f172a;`;
const UserEmail = styled.div`font-size:.75rem;color:#94a3b8;`;

const roleVariant: Record<string,'primary'|'success'|'secondary'|'warning'|'neutral'> = {
  student:'primary', tutor:'success', freelancer:'secondary', admin:'warning'
};
const statusVariant: Record<string,'success'|'neutral'|'warning'> = {
  active:'success', inactive:'neutral', suspended:'warning'
};

const IconBtn = styled.button`
  width:30px;height:30px;border-radius:.5rem;border:1px solid #e2e8f0;background:#fff;
  color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;
  &:hover{border-color:rgba(99,102,241,.3);color:#6366f1;}transition:all .15s;
`;

const ChartBox = styled.div`
  height:320px;display:flex;align-items:center;justify-content:center;
  flex-direction:column;gap:1rem;color:#94a3b8;padding:2rem;
`;

const Unauthorized = styled.div`
  min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem;
`;

const mockUsers = [
  {id:1,name:'John Doe',       email:'john@example.com',   role:'student',    status:'active',    joinDate:'Jan 15, 2024', lastActive:'2 hours ago'},
  {id:2,name:'Sarah Johnson',  email:'sarah@example.com',  role:'tutor',      status:'active',    joinDate:'Nov 20, 2023', lastActive:'1 day ago'},
  {id:3,name:'Mike Chen',      email:'mike@example.com',   role:'freelancer', status:'suspended', joinDate:'Feb 10, 2024', lastActive:'1 week ago'},
  {id:4,name:'David Wilson',   email:'david@example.com',  role:'student',    status:'inactive',  joinDate:'Mar 01, 2024', lastActive:'Never'},
  {id:5,name:'Priya Sharma',   email:'priya@example.com',  role:'tutor',      status:'active',    joinDate:'Dec 05, 2023', lastActive:'30 min ago'},
  {id:6,name:'Alex Rivera',    email:'alex@example.com',   role:'freelancer', status:'active',    joinDate:'Apr 12, 2024', lastActive:'3 days ago'},
];

const stats = [
  {label:'Total Users',    value:'12,847', trend:'+12%', up:true,  icon:Users,        bg:'linear-gradient(135deg,#6366f1,#818cf8)', accent:'#6366f1'},
  {label:'Active Sessions',value:'3,421',  trend:'+8%',  up:true,  icon:Activity,     bg:'linear-gradient(135deg,#10b981,#34d399)', accent:'#10b981'},
  {label:'Revenue',        value:'$89.4K', trend:'+23%', up:true,  icon:DollarSign,   bg:'linear-gradient(135deg,#8b5cf6,#a855f7)', accent:'#8b5cf6'},
  {label:'Support Tickets',value:'127',    trend:'-15%', up:false, icon:MessageSquare,bg:'linear-gradient(135deg,#f59e0b,#fbbf24)', accent:'#f59e0b'},
];

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'overview'|'users'|'content'|'reports'|'settings'>('overview');
  const [search, setSearch] = useState('');

  if (user?.role !== 'admin') {
    return (
      <Page>
        <TopBand><TopInner><PageTitle>Admin Panel</PageTitle></TopInner></TopBand>
        <Unauthorized>
          <div style={{width:80,height:80,borderRadius:'1.25rem',background:'rgba(239,68,68,.1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.25rem'}}>
            <Shield size={36} color="#ef4444"/>
          </div>
          <h2 style={{color:'#0f172a',marginBottom:'.5rem'}}>Access Denied</h2>
          <p style={{color:'#64748b',maxWidth:360}}>You don't have permission to access the Admin Panel. Contact your administrator if you believe this is an error.</p>
        </Unauthorized>
      </Page>
    );
  }

  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Page>
      <TopBand>
        <TopInner>
          <Eyebrow><Shield size={12}/>Admin</Eyebrow>
          <PageTitle>Admin Dashboard</PageTitle>
          <PageSub>Manage users, content, and platform settings.</PageSub>
        </TopInner>
      </TopBand>

      <Main>
        <Tabs>
          {([
            {id:'overview', icon:BarChart3, label:'Overview'},
            {id:'users',    icon:Users,     label:'Users'},
            {id:'content',  icon:AlertTriangle, label:'Content'},
            {id:'reports',  icon:TrendingUp, label:'Reports'},
            {id:'settings', icon:Settings,  label:'Settings'},
          ] as const).map(t=>(
            <Tab key={t.id} $active={tab===t.id} onClick={()=>setTab(t.id)}>
              <t.icon size={15}/>{t.label}
            </Tab>
          ))}
        </Tabs>

        {tab === 'overview' && (
          <>
            <StatsGrid>
              {stats.map((s,i)=>(
                <StatCard key={s.label} $accent={s.accent} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.08}}>
                  <StatHead>
                    <StatIco $bg={s.bg}><s.icon size={20}/></StatIco>
                    <StatTrend $up={s.up}>{s.trend}</StatTrend>
                  </StatHead>
                  <StatVal>{s.value}</StatVal>
                  <StatLbl>{s.label}</StatLbl>
                </StatCard>
              ))}
            </StatsGrid>

            <Panel>
              <PHead>
                <PTitle>Platform Analytics</PTitle>
                <PActions>
                  <ABtn><Calendar size={14}/>Last 30 days<ChevronDown size={14}/></ABtn>
                  <ABtn><Download size={14}/>Export</ABtn>
                </PActions>
              </PHead>
              <ChartBox>
                <BarChart3 size={48} color="#e2e8f0"/>
                <div>Analytics charts will render here once connected to real data</div>
              </ChartBox>
            </Panel>
          </>
        )}

        {tab === 'users' && (
          <Panel>
            <PHead>
              <PTitle>User Management</PTitle>
              <PActions>
                <SearchWrap>
                  <SearchIco><Search size={14}/></SearchIco>
                  <SearchInput placeholder="Search users…" value={search} onChange={e=>setSearch(e.target.value)}/>
                </SearchWrap>
                <ABtn><Filter size={14}/>Filter</ABtn>
                <ABtn><RefreshCw size={14}/>Refresh</ABtn>
                <PrimaryABtn><Plus size={14}/>Add User</PrimaryABtn>
              </PActions>
            </PHead>
            <div style={{overflowX:'auto'}}>
              <Table>
                <THead>
                  <TR>
                    <TH>User</TH><TH>Role</TH><TH>Status</TH><TH>Joined</TH><TH>Last Active</TH><TH>Actions</TH>
                  </TR>
                </THead>
                <tbody>
                  {filtered.map((u,i)=>(
                    <motion.tr key={u.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.04}}
                      style={{borderBottom:'1px solid #f1f5f9'}} onMouseEnter={e=>(e.currentTarget.style.background='#fafafa')}
                      onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                      <TD>
                        <UserCell>
                          <Avatar name={u.name} size="sm"/>
                          <UserTexts>
                            <UserName>{u.name}</UserName>
                            <UserEmail>{u.email}</UserEmail>
                          </UserTexts>
                        </UserCell>
                      </TD>
                      <TD><Badge variant={roleVariant[u.role]} size="sm">{u.role.charAt(0).toUpperCase()+u.role.slice(1)}</Badge></TD>
                      <TD><Badge variant={statusVariant[u.status]} size="sm" dot>{u.status.charAt(0).toUpperCase()+u.status.slice(1)}</Badge></TD>
                      <TD>{u.joinDate}</TD>
                      <TD>{u.lastActive}</TD>
                      <TD>
                        <div style={{display:'flex',gap:'.375rem'}}>
                          <IconBtn title="View"><Eye size={13}/></IconBtn>
                          <IconBtn title="Edit"><Edit size={13}/></IconBtn>
                          <IconBtn title="Delete" style={{color:'#ef4444'}} onClick={()=>{}}><Trash2 size={13}/></IconBtn>
                        </div>
                      </TD>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Panel>
        )}

        {tab === 'content' && (
          <Panel>
            <PHead><PTitle>Content Moderation</PTitle></PHead>
            <ChartBox><AlertTriangle size={48} color="#e2e8f0"/><div>Content moderation tools coming soon</div></ChartBox>
          </Panel>
        )}

        {tab === 'reports' && (
          <Panel>
            <PHead><PTitle>Reports & Analytics</PTitle><ABtn><Download size={14}/>Export Report</ABtn></PHead>
            <ChartBox><TrendingUp size={48} color="#e2e8f0"/><div>Detailed reports coming soon</div></ChartBox>
          </Panel>
        )}

        {tab === 'settings' && (
          <Panel>
            <PHead><PTitle>System Settings</PTitle></PHead>
            <ChartBox><Settings size={48} color="#e2e8f0"/><div>System configuration coming soon</div></ChartBox>
          </Panel>
        )}
      </Main>
    </Page>
  );
};

export default Admin;