import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/* ─────────────────────────────────────────────────
   Button variants & sizes
───────────────────────────────────────────────── */
type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
type Size    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  as?: any;
  to?: string;
}

const sizeStyles = {
  xs: css`padding: 0.25rem 0.625rem; font-size: 0.75rem; border-radius: 0.375rem; gap: 0.25rem;`,
  sm: css`padding: 0.375rem 0.875rem; font-size: 0.8125rem; border-radius: 0.5rem; gap: 0.375rem;`,
  md: css`padding: 0.5625rem 1.25rem; font-size: 0.9375rem; border-radius: 0.625rem; gap: 0.5rem;`,
  lg: css`padding: 0.75rem 1.75rem;   font-size: 1rem;      border-radius: 0.75rem;  gap: 0.5rem;`,
  xl: css`padding: 1rem 2.25rem;      font-size: 1.0625rem; border-radius: 0.875rem; gap: 0.625rem;`,
};

const variantStyles = {
  primary: css`
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: #fff;
    border: 1.5px solid transparent;
    box-shadow: 0 1px 2px rgba(99,102,241,0.25), 0 4px 12px rgba(99,102,241,0.2);
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      box-shadow: 0 4px 20px rgba(99,102,241,0.4);
      transform: translateY(-1px);
    }
    &:active:not(:disabled) { transform: translateY(0); }
  `,
  secondary: css`
    background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%);
    color: #4f46e5;
    border: 1.5px solid rgba(99,102,241,0.2);
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%);
      border-color: rgba(99,102,241,0.4);
      transform: translateY(-1px);
    }
  `,
  outline: css`
    background: transparent;
    color: #4f46e5;
    border: 1.5px solid #6366f1;
    &:hover:not(:disabled) {
      background: rgba(99,102,241,0.06);
      transform: translateY(-1px);
    }
  `,
  ghost: css`
    background: transparent;
    color: #475569;
    border: 1.5px solid transparent;
    &:hover:not(:disabled) {
      background: #f1f5f9;
      color: #1e293b;
    }
  `,
  danger: css`
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #fff;
    border: 1.5px solid transparent;
    box-shadow: 0 4px 12px rgba(239,68,68,0.2);
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      box-shadow: 0 4px 20px rgba(239,68,68,0.35);
      transform: translateY(-1px);
    }
  `,
  success: css`
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #fff;
    border: 1.5px solid transparent;
    box-shadow: 0 4px 12px rgba(16,185,129,0.2);
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-1px);
    }
  `,
};

const StyledButton = styled(motion.button)<{
  $variant: Variant;
  $size: Size;
  $fullWidth?: boolean;
  $loading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  opacity: ${({ $loading }) => $loading ? 0.7 : 1};
  pointer-events: ${({ $loading }) => $loading ? 'none' : 'auto'};

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
`;

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...rest
}) => {
  const iconSize = { xs: 12, sm: 13, md: 15, lg: 16, xl: 18 }[size];
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      whileTap={!rest.disabled && !loading ? { scale: 0.97 } : {}}
      {...rest as any}
    >
      {loading ? (
        <LoadingSpinner size={iconSize} />
      ) : leftIcon ? (
        React.cloneElement(leftIcon as React.ReactElement<any>, { size: iconSize })
      ) : null}
      {children}
      {!loading && rightIcon
        ? React.cloneElement(rightIcon as React.ReactElement<any>, { size: iconSize })
        : null}
    </StyledButton>
  );
};
