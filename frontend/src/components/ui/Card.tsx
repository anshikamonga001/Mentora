import React from 'react';
import styled from 'styled-components';

/* ── Card ───────────────────────────────────────── */
type CardVariant = 'default' | 'glass' | 'elevated' | 'bordered' | 'dark';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:   CardVariant;
  padding?:   'sm' | 'md' | 'lg' | 'xl' | 'none';
  hoverable?: boolean;
  children:   React.ReactNode;
}

const paddingMap = {
  none: '0',
  sm:   '1rem',
  md:   '1.5rem',
  lg:   '2rem',
  xl:   '2.5rem',
};

const variantStyles: Record<CardVariant, string> = {
  default: `
    background: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
  `,
  glass: `
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.5);
    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
  `,
  elevated: `
    background: #ffffff;
    border: none;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
  `,
  bordered: `
    background: #ffffff;
    border: 2px solid #e2e8f0;
    box-shadow: none;
  `,
  dark: `
    background: #1e293b;
    border: 1px solid #334155;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    color: #f8fafc;
  `,
};

const StyledCard = styled.div<{
  $variant: CardVariant;
  $padding: string;
  $hoverable: boolean;
}>`
  border-radius: 1rem;
  padding: ${({ $padding }) => $padding};
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $hoverable }) => $hoverable && `
    cursor: pointer;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 20px 40px rgba(99,102,241,0.15), 0 4px 12px rgba(0,0,0,0.06);
      border-color: rgba(99,102,241,0.2);
    }
  `}
`;

export const Card: React.FC<CardProps> = ({
  variant  = 'default',
  padding  = 'lg',
  hoverable = false,
  children,
  ...rest
}) => (
  <StyledCard
    $variant={variant}
    $padding={paddingMap[padding]}
    $hoverable={hoverable}
    {...rest}
  >
    {children}
  </StyledCard>
);

/* ── Skeleton ───────────────────────────────────── */
interface SkeletonProps {
  width?:    string;
  height?:   string;
  radius?:   string;
  className?: string;
}

export const Skeleton = styled.div<{
  $w?: string; $h?: string; $r?: string;
}>`
  width:         ${({ $w }) => $w || '100%'};
  height:        ${({ $h }) => $h || '1rem'};
  border-radius: ${({ $r }) => $r || '0.5rem'};
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
`;

export const SkeletonBox: React.FC<SkeletonProps> = ({ width, height, radius, className }) => (
  <Skeleton $w={width} $h={height} $r={radius} className={className} />
);
