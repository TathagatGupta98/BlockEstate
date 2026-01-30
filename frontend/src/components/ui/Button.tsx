import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 text-sm transition-colors duration-200 rounded border";

  const variants: Record<Variant, string> = {
    primary:
      "bg-oxblood border-gold text-cream hover:text-gold hover:border-gold",
    secondary:
      "bg-merlot border-taupe text-cream hover:text-gold hover:border-gold",
    ghost:
      "bg-transparent border-transparent text-cream hover:text-gold"
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    />
  );
}
