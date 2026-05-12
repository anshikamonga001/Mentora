import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  LayoutDashboard,
  MessageCircle,
  Users,
  Briefcase,
  Home,
  BookOpen,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

/* ── Styled Components ──────────────────────────── */
const Nav = styled(motion.nav)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1150;
  transition: all 350ms cubic-bezier(0.4, 0, 0.2, 1);

  ${({ $scrolled }) => $scrolled ? css`
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  ` : css`
    background: transparent;
    border-bottom: 1px solid transparent;
    box-shadow: none;
  `}
`;

const NavInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  flex-shrink: 0;
`;

const LogoMark = styled(motion.div)`
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.03em;
  box-shadow: 0 4px 12px rgba(99,102,241,0.35);
`;

const LogoText = styled.span<{ $scrolled: boolean }>`
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: ${({ $scrolled }) =>
    $scrolled
      ? 'linear-gradient(135deg, #1e293b, #4f46e5)'
      : 'linear-gradient(135deg, #1e293b, #6366f1)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.625rem;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: all 200ms ease;
  position: relative;

  color: ${({ $active }) => $active ? '#4f46e5' : '#475569'};
  background: ${({ $active }) => $active ? 'rgba(99,102,241,0.08)' : 'transparent'};

  &:hover {
    color: #4f46e5;
    background: rgba(99,102,241,0.06);
  }

  ${({ $active }) => $active && css`
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 2px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      border-radius: 9999px;
    }
  `}
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconBtn = styled(motion.button)`
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 0.625rem;
  border: none;
  background: rgba(241,245,249,0.8);
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;

  &:hover {
    background: rgba(99,102,241,0.08);
    color: #4f46e5;
  }
`;

const NotifDot = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
`;

const UserMenuWrapper = styled.div`
  position: relative;
`;

const UserTrigger = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.625rem 0.375rem 0.375rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: rgba(99,102,241,0.3);
    background: rgba(99,102,241,0.02);
    box-shadow: 0 4px 12px rgba(99,102,241,0.1);
  }
`;

const UserInfo = styled.div`
  text-align: left;
  @media (max-width: 640px) { display: none; }
`;

const UserName = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
`;

const UserRole = styled.div`
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: capitalize;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06);
  overflow: hidden;
  z-index: 1200;
`;

const DropdownHeader = styled.div`
  padding: 1rem 1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
`;

const DropdownHeaderName = styled.div`
  font-weight: 700;
  font-size: 0.9375rem;
  color: #0f172a;
`;

const DropdownHeaderEmail = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 1px;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6875rem 1rem;
  border: none;
  background: transparent;
  color: #334155;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: #f8fafc;
    color: #4f46e5;

    svg { color: #4f46e5; }
  }

  svg { color: #94a3b8; transition: color 150ms ease; }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 0.25rem 0;
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AuthLink = styled(Link)<{ $primary?: boolean }>`
  padding: 0.5rem 1.125rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 200ms ease;
  letter-spacing: -0.01em;

  ${({ $primary }) => $primary ? css`
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    box-shadow: 0 4px 12px rgba(99,102,241,0.3);
    &:hover {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white;
      box-shadow: 0 6px 20px rgba(99,102,241,0.4);
      transform: translateY(-1px);
    }
  ` : css`
    color: #475569;
    background: transparent;
    &:hover {
      color: #4f46e5;
      background: rgba(99,102,241,0.06);
    }
  `}
`;

const HamburgerBtn = styled(motion.button)`
  display: none;
  width: 38px;
  height: 38px;
  border-radius: 0.625rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileDrawer = styled(motion.div)`
  position: fixed;
  top: 68px;
  left: 0;
  right: 0;
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 1.5rem 1.5rem;
  z-index: 1140;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
`;

const MobileNav = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 0.75rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  margin-bottom: 0.25rem;
  transition: all 200ms ease;
  color: ${({ $active }) => $active ? '#4f46e5' : '#334155'};
  background: ${({ $active }) => $active ? 'rgba(99,102,241,0.08)' : 'transparent'};

  &:hover {
    color: #4f46e5;
    background: rgba(99,102,241,0.06);
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 0.75rem 0;
`;

const MobileLogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 0.75rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 200ms ease;
  color: #ef4444;
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
  font-family: inherit;
  &:hover { background: rgba(239,68,68,0.06); }
`;

const MobileRegisterBtn = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.875rem 0.75rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  &:hover { color: white; opacity: 0.92; }
`;

/* ── Navbar Component ───────────────────────────── */
const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [scrolled,      setScrolled]      = useState(false);
  const [showUserMenu,  setShowUserMenu]  = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-usermenu]')) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const getNavItems = () => {
    if (!user) return []; // unauthenticated: logo click goes home, no nav items needed

    switch (user.role) {
      case 'student':
        return [
          { path: '/ask-zone',  label: 'Ask Zone',     icon: MessageCircle },
          { path: '/mentors',   label: 'Find Mentors', icon: Users },
          { path: '/dashboard', label: 'Dashboard',    icon: LayoutDashboard },
        ];
      case 'tutor':
        return [
          { path: '/answer-zone', label: 'Answer Zone', icon: BookOpen },
          { path: '/sessions',    label: 'My Sessions', icon: Users },
          { path: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
        ];
      case 'freelancer':
        return [
          { path: '/freelance', label: 'Projects',   icon: Briefcase },
          { path: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
        ];
      case 'admin':
        return [
          { path: '/ask-zone',  label: 'Ask Zone',  icon: MessageCircle },
          { path: '/mentors',   label: 'Mentors',   icon: Users },
          { path: '/freelance', label: 'Freelance', icon: Briefcase },
          { path: '/admin',     label: 'Admin',     icon: Settings },
        ];
      default:
        return [
          { path: '/ask-zone',  label: 'Ask Zone',  icon: MessageCircle },
          { path: '/mentors',   label: 'Mentors',   icon: Users },
          { path: '/freelance', label: 'Freelance', icon: Briefcase },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <Nav $scrolled={scrolled}>
        <NavInner>
          {/* Logo */}
          <LogoLink to="/">
            <LogoMark whileHover={{ scale: 1.05, rotate: 5 }} transition={{ type: 'spring', stiffness: 400 }}>
              M
            </LogoMark>
            <LogoText $scrolled={scrolled}>Mentora</LogoText>
          </LogoLink>

          {/* Desktop nav links */}
          <NavLinks>
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavItem key={path} to={path} $active={isActive(path)}>
                <Icon size={15} />
                {label}
              </NavItem>
            ))}
          </NavLinks>

          {/* Right section */}
          <RightSection>
            {user ? (
              <>
                {/* Notifications */}
                <IconBtn whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Bell size={17} />
                  <NotifDot />
                </IconBtn>

                {/* User menu */}
                <UserMenuWrapper data-usermenu>
                  <UserTrigger
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Avatar name={user.name} size="sm" online />
                    <UserInfo>
                      <UserName>{user.name?.split(' ')[0]}</UserName>
                      <UserRole>{user.role}</UserRole>
                    </UserInfo>
                    <motion.div
                      animate={{ rotate: showUserMenu ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} color="#94a3b8" />
                    </motion.div>
                  </UserTrigger>

                  <AnimatePresence>
                    {showUserMenu && (
                      <DropdownMenu
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0,  scale: 1    }}
                        exit={{    opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <DropdownHeader>
                          <DropdownHeaderName>{user.name}</DropdownHeaderName>
                          <DropdownHeaderEmail>{user.email}</DropdownHeaderEmail>
                        </DropdownHeader>
                        <div style={{ padding: '0.375rem 0' }}>
                          <DropdownItem onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}>
                            <LayoutDashboard size={16} /> Dashboard
                          </DropdownItem>
                          <DropdownItem onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
                            <Users size={16} /> Profile
                          </DropdownItem>
                          <DropdownItem onClick={() => { navigate('/sessions'); setShowUserMenu(false); }}>
                            <Sparkles size={16} /> My Sessions
                          </DropdownItem>
                          <DropdownDivider />
                          <DropdownItem onClick={handleLogout} style={{ color: '#ef4444' }}>
                            <LogOut size={16} /> Sign out
                          </DropdownItem>
                        </div>
                      </DropdownMenu>
                    )}
                  </AnimatePresence>
                </UserMenuWrapper>
              </>
            ) : (
              <AuthButtons>
                <AuthLink to="/login">Log in</AuthLink>
                <AuthLink to="/register" $primary>Get started</AuthLink>
              </AuthButtons>
            )}

            {/* Mobile hamburger */}
            <HamburgerBtn
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              whileTap={{ scale: 0.93 }}
            >
              <AnimatePresence mode="wait">
                {showMobileMenu
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={18} /></motion.div>
                  : <motion.div key="m" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={18} /></motion.div>
                }
              </AnimatePresence>
            </HamburgerBtn>
          </RightSection>
        </NavInner>
      </Nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <MobileDrawer
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0   }}
            exit={{    opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {navItems.map(({ path, label, icon: Icon }) => (
              <MobileNav
                key={path}
                to={path}
                $active={isActive(path)}
                onClick={() => setShowMobileMenu(false)}
              >
                <Icon size={18} />
                {label}
                {isActive(path) && <Badge variant="primary" size="sm" style={{ marginLeft: 'auto' }}>Active</Badge>}
              </MobileNav>
            ))}

            {!user && (
              <>
                <MobileDivider />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <MobileNav to="/login" onClick={() => setShowMobileMenu(false)}>
                    Log in
                  </MobileNav>
                  <MobileRegisterBtn to="/register" onClick={() => setShowMobileMenu(false)}>
                    Get started free
                  </MobileRegisterBtn>
                </div>
              </>
            )}

            {user && (
              <>
                <MobileDivider />
                <MobileLogoutBtn onClick={handleLogout}>
                  <LogOut size={18} />
                  Sign out
                </MobileLogoutBtn>
              </>
            )}
          </MobileDrawer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;