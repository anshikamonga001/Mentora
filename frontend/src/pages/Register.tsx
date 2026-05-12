import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, GraduationCap, BookOpen, Briefcase, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const gradShift = keyframes`0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}`;

type Role = 'student' | 'tutor' | 'freelancer';

/* ── Layout ── */
const Wrap = styled.div`display:flex;min-height:100vh;padding-top:68px;`;

const Left = styled.div`
  flex:1;background:#0f172a;display:flex;flex-direction:column;
  justify-content:center;padding:3rem 3.5rem;position:relative;overflow:hidden;
  @media(max-width:900px){display:none;}
`;
const LeftOrb = styled.div<{$s:number;$t:string;$l:string;$c:string}>`
  position:absolute;width:${p=>p.$s}px;height:${p=>p.$s}px;border-radius:50%;
  background:${p=>p.$c};filter:blur(70px);opacity:.2;top:${p=>p.$t};left:${p=>p.$l};pointer-events:none;
`;
const LeftGrid = styled.div`
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px);
  background-size:44px 44px;pointer-events:none;
`;
const BrandRow = styled.div`display:flex;align-items:center;gap:.625rem;margin-bottom:3rem;position:relative;z-index:1;`;
const BrandIcon = styled.div`width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:1.1rem;box-shadow:0 4px 16px rgba(99,102,241,.4);`;
const BrandName = styled.div`font-size:1.125rem;font-weight:800;color:#f8fafc;letter-spacing:-.03em;`;
const LeftContent = styled.div`position:relative;z-index:1;`;
const LeftTitle = styled.h1`
  font-size:2.25rem;font-weight:900;letter-spacing:-.04em;color:#f8fafc;margin-bottom:1rem;line-height:1.1;
  span{background:linear-gradient(135deg,#818cf8,#38bdf8);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:${gradShift} 4s linear infinite;}
`;
const LeftSub = styled.p`font-size:1rem;color:#64748b;line-height:1.65;margin-bottom:2.5rem;`;
const PerksTitle = styled.div`font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#334155;margin-bottom:1rem;`;
const Perk = styled.div`display:flex;align-items:center;gap:.75rem;padding:.625rem 0;`;
const PerkIcon = styled.div`color:#818cf8;flex-shrink:0;`;
const PerkText = styled.div`font-size:.9375rem;color:#94a3b8;`;

/* ── Right ── */
const Right = styled.div`
  width:520px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
  background:#fff;padding:2.5rem 2rem;overflow-y:auto;
  @media(max-width:900px){width:100%;}
`;
const FormBox = styled(motion.div)`width:100%;max-width:420px;`;
const FormHead = styled.div`margin-bottom:1.75rem;`;
const FormTitle = styled.h2`font-size:1.625rem;font-weight:800;color:#0f172a;letter-spacing:-.03em;margin-bottom:.375rem;`;
const FormSub = styled.p`font-size:.9375rem;color:#64748b;margin:0;`;
const Form = styled.form`display:flex;flex-direction:column;gap:1rem;`;
const Field = styled.div``;
const Label = styled.label`display:block;font-size:.8125rem;font-weight:600;color:#374151;margin-bottom:.4rem;`;
const InputWrap = styled.div`position:relative;display:flex;align-items:center;`;
const IcoLeft = styled.div`position:absolute;left:14px;color:#9ca3af;pointer-events:none;display:flex;`;
const IcoRight = styled.button`position:absolute;right:12px;background:none;border:none;color:#9ca3af;cursor:pointer;display:flex;padding:2px;&:hover{color:#6366f1;}`;
const Input = styled.input<{$err?:boolean}>`
  width:100%;padding:.6875rem .875rem .6875rem 2.75rem;border:1.5px solid ${p=>p.$err?'#ef4444':'#e2e8f0'};
  border-radius:.75rem;font-size:.9375rem;background:#fff;font-family:inherit;transition:all .2s;color:#0f172a;
  &:focus{outline:none;border-color:${p=>p.$err?'#ef4444':'#6366f1'};box-shadow:0 0 0 3px ${p=>p.$err?'rgba(239,68,68,.12)':'rgba(99,102,241,.12)'};}
  &::placeholder{color:#cbd5e1;}
`;
const ErrMsg = styled.div`font-size:.75rem;color:#ef4444;margin-top:.3rem;`;

/* ── Role picker ── */
const RoleGrid = styled.div`display:grid;grid-template-columns:1fr 1fr 1fr;gap:.625rem;`;
const RoleCard = styled.button<{$sel:boolean}>`
  display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:.875rem .5rem;
  border-radius:.75rem;border:1.5px solid ${p=>p.$sel?'#6366f1':'#e2e8f0'};
  background:${p=>p.$sel?'rgba(99,102,241,.06)':'#fff'};cursor:pointer;
  transition:all .2s;font-family:inherit;
  &:hover{border-color:#6366f1;background:rgba(99,102,241,.04);}
`;
const RoleIco = styled.div<{$sel:boolean;$bg:string}>`
  width:36px;height:36px;border-radius:.625rem;
  background:${p=>p.$sel?p.$bg:'#f1f5f9'};
  display:flex;align-items:center;justify-content:center;
  color:${p=>p.$sel?'#fff':'#94a3b8'};transition:all .2s;
`;
const RoleName = styled.div`font-size:.75rem;font-weight:600;color:#0f172a;`;
const RoleSub = styled.div`font-size:.65rem;color:#94a3b8;`;

const SubmitBtn = styled(motion.button)<{$loading?:boolean}>`
  width:100%;display:flex;align-items:center;justify-content:center;gap:.5rem;
  padding:.8125rem;border-radius:.75rem;border:none;cursor:pointer;font-family:inherit;
  background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;font-size:.9375rem;
  box-shadow:0 6px 20px rgba(99,102,241,.35);transition:all .2s;opacity:${p=>p.$loading?.7:1};
  &:hover:not(:disabled){background:linear-gradient(135deg,#4f46e5,#7c3aed);}
  &:disabled{cursor:not-allowed;}
`;
const Divider = styled.div`
  display:flex;align-items:center;gap:.75rem;margin:.25rem 0;
  &::before,&::after{content:'';flex:1;height:1px;background:#e2e8f0;}
  span{font-size:.75rem;color:#94a3b8;white-space:nowrap;}
`;
const GoogleWrap = styled.div`display:flex;justify-content:center;`;
const BottomLink = styled.div`text-align:center;font-size:.875rem;color:#64748b;a{color:#6366f1;font-weight:600;text-decoration:none;&:hover{color:#4f46e5;text-decoration:underline;}}`;

/* ── Component ── */
const roles: {id:Role;label:string;sub:string;icon:any;bg:string}[] = [
  {id:'student',    label:'Student',    sub:'I want to learn', icon:GraduationCap, bg:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
  {id:'tutor',      label:'Tutor',      sub:'I want to teach', icon:BookOpen,       bg:'linear-gradient(135deg,#10b981,#059669)'},
  {id:'freelancer', label:'Freelancer', sub:'I want to work',  icon:Briefcase,     bg:'linear-gradient(135deg,#f97316,#f59e0b)'},
];

const perks = [
  'Access Ask Zone & get answers instantly',
  'Connect with vetted expert mentors',
  'Find or post freelance projects',
  'Earn XP, badges & build your reputation',
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [form, setForm] = useState({name:'',email:'',password:'',role:'student' as Role});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const validate = () => {
    const e:Record<string,string>={};
    if(!form.name.trim())          e.name='Name is required';
    if(!form.email)                e.email='Email is required';
    else if(!/\S+@\S+\.\S+/.test(form.email)) e.email='Enter a valid email';
    if(!form.password)             e.password='Password is required';
    else if(form.password.length<6) e.password='Min 6 characters';
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const{name,value}=e.target;
    setForm(p=>({...p,[name]:value}));
    if(errors[name]) setErrors(p=>({...p,[name]:''}));
  };

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!validate()) return;
    setLoading(true);
    try{
      await register(form);
      toast.success('Account created! Welcome to Mentora 🎉');
      navigate('/dashboard');
    }catch(err:any){
      toast.error(err.message||'Registration failed');
    }finally{setLoading(false);}
  };

  const handleGoogle=async(cr:any)=>{
    try{
      await googleLogin(cr.credential);
      toast.success('Signed in with Google');
      navigate('/dashboard');
    }catch{toast.error('Google sign-in failed');}
  };

  return (
    <Wrap>
      <Left>
        <LeftGrid/>
        <LeftOrb $s={400} $t="-20%" $l="-15%" $c="#6366f1"/>
        <LeftOrb $s={300} $t="50%"  $l="55%"  $c="#8b5cf6"/>
        <BrandRow><BrandIcon>M</BrandIcon><BrandName>Mentora</BrandName></BrandRow>
        <LeftContent>
          <LeftTitle>Start your<br/><span>learning journey</span></LeftTitle>
          <LeftSub>Join 12,000+ students, tutors, and freelancers already growing on Mentora.</LeftSub>
          <PerksTitle>What you get for free</PerksTitle>
          {perks.map(p=>(
            <Perk key={p}>
              <PerkIcon><CheckCircle size={18}/></PerkIcon>
              <PerkText>{p}</PerkText>
            </Perk>
          ))}
        </LeftContent>
      </Left>

      <Right>
        <FormBox initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5}}>
          <FormHead>
            <FormTitle>Create your account</FormTitle>
            <FormSub>Free forever. No credit card required.</FormSub>
          </FormHead>

          <Form onSubmit={handleSubmit}>
            {/* Role picker */}
            <Field>
              <Label>I am a…</Label>
              <RoleGrid>
                {roles.map(r=>(
                  <RoleCard key={r.id} type="button" $sel={form.role===r.id} onClick={()=>setForm(p=>({...p,role:r.id}))}>
                    <RoleIco $sel={form.role===r.id} $bg={r.bg}><r.icon size={17}/></RoleIco>
                    <RoleName>{r.label}</RoleName>
                    <RoleSub>{r.sub}</RoleSub>
                  </RoleCard>
                ))}
              </RoleGrid>
            </Field>

            <Field>
              <Label htmlFor="name">Full name</Label>
              <InputWrap>
                <IcoLeft><User size={17}/></IcoLeft>
                <Input id="name" name="name" placeholder="Jane Doe" value={form.name} onChange={handleChange} $err={!!errors.name}/>
              </InputWrap>
              {errors.name&&<ErrMsg>{errors.name}</ErrMsg>}
            </Field>

            <Field>
              <Label htmlFor="reg-email">Email address</Label>
              <InputWrap>
                <IcoLeft><Mail size={17}/></IcoLeft>
                <Input id="reg-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} $err={!!errors.email}/>
              </InputWrap>
              {errors.email&&<ErrMsg>{errors.email}</ErrMsg>}
            </Field>

            <Field>
              <Label htmlFor="reg-password">Password</Label>
              <InputWrap>
                <IcoLeft><Lock size={17}/></IcoLeft>
                <Input id="reg-password" name="password" type={showPw?'text':'password'} placeholder="Min. 6 characters" value={form.password} onChange={handleChange} $err={!!errors.password}/>
                <IcoRight type="button" onClick={()=>setShowPw(!showPw)}>
                  {showPw?<EyeOff size={17}/>:<Eye size={17}/>}
                </IcoRight>
              </InputWrap>
              {errors.password&&<ErrMsg>{errors.password}</ErrMsg>}
            </Field>

            <SubmitBtn type="submit" disabled={loading} $loading={loading} whileTap={{scale:.97}}>
              {loading?'Creating account…':<><span>Create free account</span><ArrowRight size={17}/></>}
            </SubmitBtn>
          </Form>

          <Divider style={{margin:'1.25rem 0'}}><span>or sign up with Google</span></Divider>
          <GoogleWrap>
            <GoogleLogin onSuccess={handleGoogle} onError={()=>toast.error('Google sign-in failed')} useOneTap/>
          </GoogleWrap>

          <BottomLink style={{marginTop:'1.5rem'}}>
            Already have an account? <Link to="/login">Sign in →</Link>
          </BottomLink>
        </FormBox>
      </Right>
    </Wrap>
  );
};

export default Register;
