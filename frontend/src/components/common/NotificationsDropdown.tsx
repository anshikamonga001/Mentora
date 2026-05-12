import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, BookOpen, Briefcase, Bell, CheckCheck, Info } from 'lucide-react';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  Notification,
} from '../../services/notifications';

/* ── Styled Components ─────────────────────────── */
const Wrapper = styled.div`
  position: relative;
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 360px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06);
  z-index: 1200;
  overflow: hidden;
  @media(max-width: 480px) { width: calc(100vw - 2rem); right: -1rem; }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.125rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
`;

const HeaderTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UnreadBadge = styled.span`
  background: #6366f1;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.125rem 0.45rem;
  border-radius: 9999px;
`;

const MarkAllBtn = styled.button`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6366f1;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: background 150ms;
  &:hover { background: rgba(99,102,241,0.08); }
`;

const List = styled.div`
  max-height: 340px;
  overflow-y: auto;
`;

const Item = styled.div<{ $unread: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1.125rem;
  cursor: pointer;
  transition: background 150ms;
  background: ${p => p.$unread ? 'rgba(99,102,241,0.04)' : 'transparent'};
  border-left: 3px solid ${p => p.$unread ? '#6366f1' : 'transparent'};
  &:hover { background: #f8fafc; }
  & + & { border-top: 1px solid #f1f5f9; }
`;

const IconBox = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const ItemBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemMsg = styled.div`
  font-size: 0.8125rem;
  color: #1e293b;
  line-height: 1.45;
`;

const ItemTime = styled.div`
  font-size: 0.7rem;
  color: #94a3b8;
  margin-top: 0.25rem;
`;

const UnreadDot = styled.span`
  width: 8px;
  height: 8px;
  background: #6366f1;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  gap: 0.5rem;
`;

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
`;

const EmptyText = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
`;

/* ── helpers ─────────────────────────────────── */
const typeConfig: Record<string, { icon: React.FC<any>; color: string }> = {
  new_question: { icon: MessageCircle, color: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  new_answer:   { icon: BookOpen,      color: 'linear-gradient(135deg,#10b981,#059669)' },
  new_project:  { icon: Briefcase,     color: 'linear-gradient(135deg,#f97316,#f59e0b)' },
  system:       { icon: Info,          color: 'linear-gradient(135deg,#64748b,#94a3b8)' },
};

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ── BellBtn ─────────────────────────────────── */
const BellBtn = styled(motion.button)`
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
  &:hover { background: rgba(99,102,241,0.08); color: #4f46e5; }
`;

const Dot = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
`;

/* ── Component ───────────────────────────────── */
interface Props { isOpen: boolean; onToggle: () => void; onClose: () => void; }

const NotificationsDropdown: React.FC<Props> = ({ isOpen, onToggle, onClose }) => {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();
  const wrapRef      = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchInterval: 60000, // poll every minute
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const readMut = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const readAllMut = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  const handleClick = (n: Notification) => {
    if (!n.read) readMut.mutate(n._id);
    onClose();
    if (n.link) navigate(n.link);
  };

  return (
    <Wrapper ref={wrapRef}>
      <BellBtn
        id="notifications-bell"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        aria-label="Notifications"
      >
        <Bell size={17} />
        {unreadCount > 0 && <Dot />}
      </BellBtn>

      <AnimatePresence>
        {isOpen && (
          <Dropdown
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            <Header>
              <HeaderTitle>
                Notifications
                {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
              </HeaderTitle>
              {unreadCount > 0 && (
                <MarkAllBtn onClick={() => readAllMut.mutate()}>
                  <CheckCheck size={13} /> Mark all read
                </MarkAllBtn>
              )}
            </Header>

            <List>
              {notifications.length === 0 ? (
                <Empty>
                  <EmptyIcon><Bell size={20} /></EmptyIcon>
                  <EmptyText>You're all caught up!</EmptyText>
                </Empty>
              ) : (
                notifications.map(n => {
                  const cfg = typeConfig[n.type] || typeConfig.system;
                  const Icon = cfg.icon;
                  return (
                    <Item key={n._id} $unread={!n.read} onClick={() => handleClick(n)}>
                      <IconBox $color={cfg.color}><Icon size={16} /></IconBox>
                      <ItemBody>
                        <ItemMsg>{n.message}</ItemMsg>
                        <ItemTime>{timeAgo(n.createdAt)}</ItemTime>
                      </ItemBody>
                      {!n.read && <UnreadDot />}
                    </Item>
                  );
                })
              )}
            </List>
          </Dropdown>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default NotificationsDropdown;
