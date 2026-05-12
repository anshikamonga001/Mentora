import React from 'react';
import styled, { css } from 'styled-components';

/* ── Badge ──────────────────────────────────────── */
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'outline';
type BadgeSize    = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?:  BadgeVariant;
  size?:     BadgeSize;
  dot?:      boolean;
  children:  React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const variantMap: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  primary:   { bg: 'rgba(99,102,241,0.1)',  color: '#4f46e5', border: 'rgba(99,102,241,0.2)' },
  secondary: { bg: 'rgba(168,85,247,0.1)',  color: '#7e22ce', border: 'rgba(168,85,247,0.2)' },
  success:   { bg: 'rgba(16,185,129,0.1)',  color: '#047857', border: 'rgba(16,185,129,0.2)' },
  warning:   { bg: 'rgba(245,158,11,0.1)',  color: '#b45309', border: 'rgba(245,158,11,0.2)' },
  error:     { bg: 'rgba(239,68,68,0.1)',   color: '#b91c1c', border: 'rgba(239,68,68,0.2)'  },
  neutral:   { bg: 'rgba(100,116,139,0.1)', color: '#475569', border: 'rgba(100,116,139,0.2)' },
  outline:   { bg: 'transparent',           color: '#475569', border: '#cbd5e1' },
};

const sizeMap: Record<BadgeSize, string> = {
  sm: 'padding: 0.1rem 0.5rem;  font-size: 0.68rem;',
  md: 'padding: 0.2rem 0.625rem; font-size: 0.75rem;',
  lg: 'padding: 0.3rem 0.75rem; font-size: 0.8125rem;',
};

const StyledBadge = styled.span<{ $variant: BadgeVariant; $size: BadgeSize }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 9999px;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
  ${({ $variant }) => css`
    background: ${variantMap[$variant].bg};
    color: ${variantMap[$variant].color};
    border: 1px solid ${variantMap[$variant].border};
  `}
  ${({ $size }) => sizeMap[$size]}
`;

const Dot = styled.span<{ $variant: BadgeVariant }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $variant }) => variantMap[$variant].color};
  flex-shrink: 0;
`;

export const Badge: React.FC<BadgeProps> = ({
  variant  = 'neutral',
  size     = 'md',
  dot      = false,
  children,
  className,
  style,
}) => (
  <StyledBadge $variant={variant} $size={size} className={className} style={style}>
    {dot && <Dot $variant={variant} />}
    {children}
  </StyledBadge>
);
