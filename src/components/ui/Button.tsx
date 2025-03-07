import clsx from "clsx";
import { FC, ReactNode } from "react";

type ButtonVariants =
  | "btn-primary"
  | "btn-secondary"
  | "btn-accent"
  | "btn-neutral"
  | "btn-info"
  | "btn-success"
  | "btn-warning"
  | "btn-error";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariants;
  disabled?: boolean;
  className?: string;
};

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = "btn-neutral",
  disabled,
  className,
}) => {
  return (
    <button
      className={clsx("btn", variant, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
