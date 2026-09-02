import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "light" | "quiet" | "danger";
type ButtonSize = "small" | "medium" | "large";

interface SharedProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

type AppButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;
type AppLinkButtonProps = SharedProps & LinkProps;

function buttonClassName({
  className = "",
  size = "medium",
  variant = "primary",
}: {
  className?: string | undefined;
  size?: ButtonSize | undefined;
  variant?: ButtonVariant | undefined;
}) {
  return `button button-${variant} button-${size} ${className}`.trim();
}

export function AppButton({
  children,
  className,
  icon,
  size,
  variant,
  ...props
}: AppButtonProps) {
  return (
    <button
      className={buttonClassName({ className, size, variant })}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function AppLinkButton({
  children,
  className,
  icon,
  size,
  variant,
  ...props
}: AppLinkButtonProps) {
  return (
    <Link className={buttonClassName({ className, size, variant })} {...props}>
      {icon}
      {children}
    </Link>
  );
}
