import React from 'react';
import styled from 'styled-components';

/* ── Avatar ─────────────────────────────────────── */
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  name?:   string;
  src?:    string;
  size?:   AvatarSize;
  online?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, { dim: string; font: string; dot: string }> = {
  xs:  { dim: '24px',  font: '0.6rem',   dot: '6px' },
  sm:  { dim: '32px',  font: '0.75rem',  dot: '8px' },
  md:  { dim: '40px',  font: '0.875rem', dot: '10px' },
  lg:  { dim: '48px',  font: '1rem',     dot: '11px' },
  xl:  { dim: '64px',  font: '1.25rem',  dot: '13px' },
  '2xl': { dim: '80px', font: '1.5rem',  dot: '14px' },
};

const gradients = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #3b82f6, #6366f1)',
  'linear-gradient(135deg, #10b981, #0ea5e9)',
  'linear-gradient(135deg, #f97316, #f59e0b)',
  'linear-gradient(135deg, #f43f5e, #ec4899)',
  'linear-gradient(135deg, #8b5cf6, #a855f7)',
];

const getGradient = (name: string = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return gradients[hash % gradients.length];
};

const getInitials = (name: string = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AvatarRoot = styled.div<{ $dim: string }>`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width:  ${({ $dim }) => $dim};
  height: ${({ $dim }) => $dim};
`;

const AvatarImg = styled.img<{ $dim: string }>`
  width:  ${({ $dim }) => $dim};
  height: ${({ $dim }) => $dim};
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.8);
`;

const AvatarFallback = styled.div<{ $dim: string; $font: string; $gradient: string }>`
  width:  ${({ $dim }) => $dim};
  height: ${({ $dim }) => $dim};
  border-radius: 50%;
  background: ${({ $gradient }) => $gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: ${({ $font }) => $font};
  letter-spacing: 0.03em;
  user-select: none;
  border: 2px solid rgba(255,255,255,0.3);
`;

const OnlineDot = styled.span<{ $dot: string }>`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width:  ${({ $dot }) => $dot};
  height: ${({ $dot }) => $dot};
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid #fff;
  box-shadow: 0 0 6px rgba(34,197,94,0.4);
`;

export const Avatar: React.FC<AvatarProps> = ({
  name   = '',
  src,
  size   = 'md',
  online = false,
  className,
}) => {
  const { dim, font, dot } = sizeMap[size];
  const gradient = getGradient(name);
  const initials = getInitials(name);

  return (
    <AvatarRoot $dim={dim} className={className}>
      {src ? (
        <AvatarImg src={src} alt={name} $dim={dim} />
      ) : (
        <AvatarFallback $dim={dim} $font={font} $gradient={gradient}>
          {initials || '?'}
        </AvatarFallback>
      )}
      {online && <OnlineDot $dot={dot} />}
    </AvatarRoot>
  );
};

/* ── ProgressBar ────────────────────────────────── */
interface ProgressBarProps {
  value:   number; // 0-100
  max?:    number;
  color?:  'primary' | 'success' | 'warning' | 'error';
  size?:   'sm' | 'md' | 'lg';
  label?:  string;
  showValue?: boolean;
}

const colorMap = {
  primary: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
  success: 'linear-gradient(90deg, #10b981, #059669)',
  warning: 'linear-gradient(90deg, #f59e0b, #f97316)',
  error:   'linear-gradient(90deg, #ef4444, #dc2626)',
};

const heightMap = { sm: '4px', md: '8px', lg: '12px' };

const ProgressTrack = styled.div<{ $h: string }>`
  width: 100%;
  height: ${({ $h }) => $h};
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 9999px;
  transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 0 8px rgba(99,102,241,0.3);
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #475569;
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max   = 100,
  color = 'primary',
  size  = 'md',
  label,
  showValue = false,
}) => {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div>
      {(label || showValue) && (
        <ProgressLabel>
          {label && <span>{label}</span>}
          {showValue && <span>{pct}%</span>}
        </ProgressLabel>
      )}
      <ProgressTrack $h={heightMap[size]}>
        <ProgressFill $pct={pct} $color={colorMap[color]} />
      </ProgressTrack>
    </div>
  );
};
